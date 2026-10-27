"""Two independent readers of a scanned DOE recruitment permit (จต.2), both on lighthouse-gpu01 (Ollama).

  Reader A ("parse")  : qwen3.8:27b vision  — page image  -> structured JSON
  Reader B ("Thai OCR"): typhoon-ocr1.5-3b  — page image  -> Thai transcript text
                         typhoon2.5-qwen3-30b (Thai LLM) — transcript -> the same JSON (never sees A)

DOE permit PDFs are 1-page scans with no text layer, so "parse the PDF" means reading the image.
The two readings share no model and no intermediate output; scripts/permit-verify.py compares them.
"""
import base64, json, os, re, time, urllib.request
from pathlib import Path

OLLAMA = os.environ.get("THMW_OLLAMA", "http://100.106.37.87:11434")
VISION = "qwen3.8:27b"
OCR = "scb10x/typhoon-ocr1.5-3b:latest"
THAI_LLM = "scb10x/typhoon2.5-qwen3-30b-a3b:latest"

SCHEMA_HINT = """Return ONE JSON object, no prose, with exactly these keys:
{
 "permit": "เลขที่ใบอนุญาต เช่น 154/2569",
 "country": "ชื่อประเทศปลายทางภาษาไทยตามเอกสาร",
 "employer": "ชื่อนายจ้างตามเอกสาร",
 "employerPlace": "ที่ตั้งนายจ้างตามเอกสาร หรือ null",
 "industry": "ประเภทกิจการ/อุตสาหกรรมตามเอกสาร หรือ null",
 "agency_name": "ชื่อบริษัทจัดหางาน (ไม่ต้องมีคำว่า บริษัท/จำกัด)",
 "agency_license": "เลขใบอนุญาตจัดหางาน รูปแบบ ต.<เลข>/<ปี พ.ศ.> เช่น ต.1302/2568",
 "phones": ["เบอร์โทรที่พิมพ์ในเอกสาร รูปแบบ 0xx-xxx-xxxx"],
 "positions": [{"title": "ตำแหน่ง", "count": 0}],
 "total": 0,
 "sex": "male | female | any | null (null ถ้าเอกสารไม่ได้ระบุ)",
 "sexQuote": "ข้อความในเอกสารที่ระบุเพศ หรือ null",
 "ageMin": null, "ageMax": null,
 "pay_amount": "ตัวเลขค่าจ้างตามเอกสาร เช่น 6443.85",
 "pay_currency": "สกุลเงินตามเอกสาร เช่น เชเกล",
 "pay_period": "เดือน | ชั่วโมง | วัน",
 "pay_text": "ข้อความค่าจ้างตามเอกสารทั้งวลี",
 "baht_amount": "ตัวเลขเงินบาทที่เอกสารแปลงไว้ หรือ null",
 "housing": {"who": "employer|worker|deduct|partial|unclear|null", "quote": "ข้อความจากเอกสาร"},
 "food": {"who": "employer|worker|deduct|partial|unclear|null", "quote": "ข้อความจากเอกสาร"},
 "airfare": {"who": "employer|worker|deduct|partial|unclear|null", "quote": "ข้อความจากเอกสาร"},
 "terms": ["เงื่อนไขการจ้างอื่น ๆ ตามเอกสาร ทีละข้อ"],
 "windowStart": "YYYY-MM-DD (ค.ศ.) วันเริ่มรับสมัคร",
 "windowEnd": "YYYY-MM-DD (ค.ศ.) วันสิ้นสุดรับสมัคร",
 "issued": "YYYY-MM-DD (ค.ศ.) วันที่ออกใบอนุญาต"
}
Rules: copy only what the document says; anything not stated = null. Convert พ.ศ. to ค.ศ. by subtracting 543.
who: employer = นายจ้างจัดให้/รับผิดชอบ, worker = ลูกจ้าง/คนงานจ่าย, deduct = นายจ้างจัดให้แต่หักค่าใช้จ่าย,
partial = นายจ้างจัดให้บางส่วน, unclear = จัดหาให้แต่ไม่ระบุว่าใครจ่าย, null = ไม่กล่าวถึง."""


def page_png(pdf, dpi=150):
    import pymupdf
    doc = pymupdf.open(pdf)
    if doc.page_count != 1:
        raise ValueError(f"expected a 1-page permit, got {doc.page_count} pages")
    return doc[0].get_pixmap(dpi=dpi).tobytes("png")


def unload(model):
    """Free VRAM: the 27B vision model and the OCR model don't fit on the 24 GB RTX 3090 together."""
    try:
        body = json.dumps({"model": model, "keep_alive": 0}).encode()
        urllib.request.urlopen(urllib.request.Request(f"{OLLAMA}/api/generate", body, {"Content-Type": "application/json"}), timeout=60)
    except Exception:  # noqa: BLE001
        pass


def _chat(model, prompt, image=None, fmt=None, num_predict=6000, think=None):
    for other in {VISION, OCR, THAI_LLM} - {model}:
        unload(other)
    msg = {"role": "user", "content": prompt}
    if image:
        msg["images"] = [base64.b64encode(image).decode()]
    body = {"model": model, "messages": [msg], "stream": False, "keep_alive": "3m",
            "options": {"temperature": 0, "num_predict": num_predict, "num_ctx": 16384}}
    if fmt:
        body["format"] = fmt
    if think is not None:
        body["think"] = think
    req = urllib.request.Request(f"{OLLAMA}/api/chat", json.dumps(body).encode(), {"Content-Type": "application/json"})
    return json.load(urllib.request.urlopen(req, timeout=1200))["message"]["content"]


def _json(text):
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.S)
    m = re.search(r"\{.*\}", text, re.S)
    if not m:
        raise ValueError("no JSON object in model output")
    return json.loads(m.group(0))


def reader_a(png):
    """Vision parse: image -> JSON."""
    out = _chat(VISION, "อ่านหนังสืออนุญาตให้รับสมัครคนหางาน (จต.2) ของกรมการจัดหางานในภาพนี้\n" + SCHEMA_HINT,
                image=png, fmt="json", think=False)
    return _json(out)


# typhoon-ocr1.5 was trained on this exact prompt; a free-form Thai request makes it echo the preamble instead.
OCR_PROMPT = """Below is an image of a document page. Just return the plain text representation of this document as if you were reading it naturally.
Instructions:
- Only return the clean Markdown.
- Do not include any explanation or extra text.
- You must include all information on the page.

Formatting Rules:
- Tables: Render tables using <table>...</table> in clean HTML format.
- Equations: Render equations using LaTeX syntax with inline ($...$) and block ($$...$$).
- Images/Charts/Diagrams: Wrap any clearly defined visual areas (e.g. charts, diagrams, pictures) in:

<figure>
Describe the image's main elements (people, objects, text), note any contextual clues (place, event, culture), mention visible text and its meaning, provide deeper analysis when relevant (especially for financial charts, graphs, or documents), comment on style or architecture if relevant, then give a concise overall summary. Describe in Thai.
</figure>

- Page Numbers: Wrap page numbers in <page_number>...</page_number> (e.g., <page_number>14</page_number>).
- Checkboxes: Use ☐ for unchecked and ☑ for checked boxes."""
TABLE_PROMPT = ("ในตารางตำแหน่งงานของเอกสารนี้ เขียนทีละแถวในรูปแบบ: ลำดับ | ตำแหน่ง | จำนวน (คน) | อัตราค่าจ้าง  "
                "แล้วบรรทัดสุดท้ายเขียนแถว รวม  อย่าเพิ่มคำอธิบาย")


def ocr_text(png):
    """Thai OCR transcript of the whole page (typhoon-ocr, official prompt)."""
    return _chat(OCR, OCR_PROMPT, image=png, num_predict=8000)


def ocr_table(png):
    """Targeted Typhoon pass over the positions table (the full pass tends to drop the count column)."""
    return _chat(OCR, TABLE_PROMPT, image=png, num_predict=3000)


def reader_b(transcript):
    """OCR route: transcript -> JSON with a Thai LLM that never sees the image or reader A."""
    out = _chat(THAI_LLM, "ข้อความด้านล่างถอดมาจากหนังสืออนุญาตให้รับสมัครคนหางาน (จต.2) ของกรมการจัดหางาน\n"
                + SCHEMA_HINT + "\n\n----- ข้อความ -----\n" + transcript, fmt="json", think=False)
    return _json(out)


def read_both(pdf):
    png = page_png(pdf)
    t = time.time()
    a = reader_a(png)
    ta = time.time() - t
    transcript = ocr_text(png)
    b = reader_b(transcript)
    return {"a": a, "b": b, "transcript": transcript, "seconds": {"a": round(ta), "b": round(time.time() - t - ta)}}
