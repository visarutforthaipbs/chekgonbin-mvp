#!/usr/bin/env python3
"""Thai-OCR double check for one /rounds permit entry before it goes live.

  python3 scripts/permit-verify.py <entry.json> <permit.pdf> [--ocr-cache DIR] [--json]

<entry.json> is the PRIMARY parse: one ROUNDS entry in the exact data/rounds.js shape
(source: {"pool_id": N, "page": 1}; feeBan omitted). It was read from the scan by the primary reader.
The check reads the same scan independently with typhoon-ocr1.5-3b on lighthouse-gpu01 and requires
every fact that will be shown on the site to be found in the OCR transcript. Any miss = HOLD.

Exit: 0 PASS (safe to publish) · 1 HOLD (mismatch, do not publish) · 3 ENDED (window over, skip) · 2 error.
"""
import argparse, difflib, hashlib, json, re, subprocess, sys, time, unicodedata, urllib.parse, urllib.request
from datetime import date, datetime, timedelta, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import permit_readers as R  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
WAKE = Path.home() / "Documents/Personal-Project/project-lighthouse/scripts/wake-gpu.sh"
TZ = timezone(timedelta(hours=7))
DPIS = (200, 240, 170)  # extra OCR passes only run when a check fails on the first
THAI_DIGITS = str.maketrans("๐๑๒๓๔๕๖๗๘๙", "0123456789")
MONTHS = ["มกราคม|ม\\.ค\\.", "กุมภาพันธ์|ก\\.พ\\.", "มีนาคม|มี\\.ค\\.", "เมษายน|เม\\.ย\\.", "พฤษภาคม|พ\\.ค\\.",
          "มิถุนายน|มิ\\.ย\\.", "กรกฎาคม|ก\\.ค\\.", "สิงหาคม|ส\\.ค\\.", "กันยายน|ก\\.ย\\.", "ตุลาคม|ต\\.ค\\.",
          "พฤศจิกายน|พ\\.ย\\.", "ธันวาคม|ธ\\.ค\\."]
WHO = {"employer", "worker", "deduct", "partial", "unclear", "employer-unclear", "in-pay", None}
_b = re.search(r"const BANNED = \[(.*?)\];", (ROOT / "scripts/test-countries.mjs").read_text(encoding="utf-8"))
if not _b:
    raise SystemExit("BANNED list not found in scripts/test-countries.mjs")
BANNED = re.findall(r'"([^"]+)"', _b.group(1))


def norm(s):
    s = unicodedata.normalize("NFC", s or "").translate(THAI_DIGITS)
    s = s.replace("\u200b", "").replace("ํา", "ำ")
    return re.sub(r"\s+", " ", s)


def squash(s):
    return re.sub(r"[\s\-–—:()\"'“”]", "", norm(s))


def best_ratio(needle, hay):
    """Best similarity of `needle` against any equal-length window of `hay` (whitespace-insensitive)."""
    n, h = squash(needle), squash(hay)
    if not n:
        return 1.0
    if n in h:
        return 1.0
    L, best = len(n), 0.0
    sm = difflib.SequenceMatcher(None, n, "", autojunk=False)
    step = max(1, L // 8)
    for i in range(0, max(1, len(h) - L + 1), step):
        for w in (L - 2, L, L + 2):
            sm.set_seq2(h[i:i + w])
            if sm.real_quick_ratio() > best and sm.quick_ratio() > best:
                best = max(best, sm.ratio())
    return best


def numbers(s):
    out = set()
    for m in re.findall(r"\d[\d,]*(?:\.\d+)?", norm(s)):
        m = re.sub(r"[,\s]", "", m)
        out.add(m)
        if re.fullmatch(r"\d{1,3}\.\d{3}", m):  # Thai OCR / typists use "." as thousands separator: 33.335
            out.add(m.replace(".", ""))
    return out


NOT_AGENCY = re.compile(r"TAIWAN|ISRAEL|R\.O\.C|โครงการ|หน่วยงานตั้งอยู่|นายจ้าง|กรมการจัดหางาน|DEPARTMENT|EMPLOYMENT|สำนักงานใหญ่", re.I)


def phone_digits(s, raw=False):
    """Thai numbers: 02/03/04/05/07 landline = 9 digits, 06/08/09 mobile = 10. A trailing '-6' range suffix is dropped.
    Numbers whose preceding ~45 chars name the employer's workplace or the DOE seal are not the agency's -> skipped."""
    t = unicodedata.normalize("NFC", s or "").translate(THAI_DIGITS)
    out = set()
    for m in re.finditer(r"(?<!\d)0[\d\-\s.]{7,14}\d", t):
        if NOT_AGENCY.search(t[max(0, m.start() - 45):m.start()]):
            continue
        d = re.sub(r"\D", "", m.group(0))
        n = 10 if d[1] in "689" else 9
        if len(d) >= n:
            out.add(d if raw else d[:n])
    return out


def seen_twice(sets):
    """Values present in at least 2 OCR passes (a single-pass reading is treated as noise)."""
    from collections import Counter
    c = Counter(x for st in sets for x in set(st))
    return {x for x, k in c.items() if k >= 2 or len(sets) == 1}


AGE_RE = re.compile(r"อายุ[^\d\n]{0,25}(\d{2})(?:\s*(?:-|–|ถึง)\s*(\d{2}))?\s*ปี")


def ages_in(t):
    return {int(x) for m in AGE_RE.finditer(t) for x in m.groups() if x}


def near(a, b):
    """Same length and at most one differing digit (an OCR slip), or one is the other with one digit missing."""
    if len(a) == len(b):
        return sum(x != y for x, y in zip(a, b)) <= 1
    if abs(len(a) - len(b)) == 1:
        s, l = sorted((a, b), key=len)
        return any(l[:i] + l[i + 1:] == s for i in range(len(l)))
    return False


def registry(license_):
    """DOE agency registry as served by thaimigrantwatch.org (refreshed nightly by the collector)."""
    try:
        q = urllib.parse.quote(license_)
        data = json.load(urllib.request.urlopen(f"https://thaimigrantwatch.org/api/agencies?q={q}", timeout=20))["data"]
    except Exception:  # noqa: BLE001
        return None
    hit = [r for r in data if (r.get("license_no") or "").replace(" ", "") == license_]
    if not hit:
        return None
    name = re.sub(r"^บริษัทจัดหางาน\s*|\s*จำกัด$", "", hit[0]["name_th"]).strip()
    return {"name": name, "status": hit[0].get("company_status")}


def thai_date_re(iso):
    d = date.fromisoformat(iso)
    return re.compile(rf"(?<!\d){d.day}\s*(?:เดือน)?\s*(?:{MONTHS[d.month - 1]})\s*(?:พ\.ศ\.)?\s*{d.year + 543}")


def ensure_gpu():
    try:
        urllib.request.urlopen(f"{R.OLLAMA}/api/tags", timeout=8)
        return
    except Exception:  # noqa: BLE001
        pass
    subprocess.run(["bash", str(WAKE)], capture_output=True, timeout=120)
    for _ in range(24):
        time.sleep(10)
        try:
            urllib.request.urlopen(f"{R.OLLAMA}/api/tags", timeout=8)
            return
        except Exception:  # noqa: BLE001
            continue
    raise RuntimeError("lighthouse-gpu01 Ollama unreachable after wake")


def ocr(pdf, dpi, cache):
    key = hashlib.sha256(Path(pdf).read_bytes()).hexdigest()[:16]
    f = cache / f"{key}-{dpi}.txt" if cache else None
    if f and f.exists():
        return f.read_text(encoding="utf-8")
    ensure_gpu()
    txt = ""
    for _ in range(3):  # typhoon occasionally echoes its prompt instead of reading
        txt = R.ocr_text(R.page_png(pdf, dpi))
        if "ใบอนุญาต" in txt or "อนุญาต" in txt:
            break
    if f:
        f.write_text(txt, encoding="utf-8")
    return txt



def word_count(n, flat):
    """Thai-word evidence for count n in squashed text. "<n><words(n)>" or "<words(n)>คน" counts, but NOT when the
    words sit right after DIFFERENT digits (142's OCR: "300สองร้อยคน" — digits and words disagree, so the line
    proves neither 300 nor 200)."""
    w = thai_words(n)
    if f"{n}{w}" in flat or f"{n:,}{w}" in flat:
        return True
    for m in re.finditer(re.escape(w) + "คน", flat):
        before = re.search(r"(\d[\d,]*)$", flat[max(0, m.start() - 8):m.start()])
        if not before or int(before.group(1).replace(",", "")) == n:
            return True
    return False

def checks(e, T, passes=None):
    """Return list of (field, ok, detail). T = normalised OCR transcript (one or more passes joined)."""
    res = []
    add = lambda f, ok, d="": res.append((f, bool(ok), d))  # noqa: E731
    flat = re.sub(r"\s+", "", T)
    no, yr = e["permit"].split("/")
    add("permit", re.search(rf"(?<!\d){no}\s*/\s*{yr}", T), e["permit"])
    lic = re.match(r"ต\.(\d+)/(\d{4})$", e["agency"]["license"])
    add("agency.license format", lic, e["agency"]["license"])
    if lic:
        add("agency.license", re.search(rf"(?<!\d){lic.group(1)}\s*/\s*{lic.group(2)}", T), e["agency"]["license"])
    # Agency name: one letter = another company. Exact in OCR, OR identical to the DOE registry name for this
    # licence number (third source) while still close to the OCR text. A registry mismatch always fails.
    name = e["agency"]["name"]
    reg = registry(e["agency"]["license"]) if lic else None
    in_ocr = squash(name) in squash(T)
    loose = lambda x: re.sub(r"[.\s]", "", squash(x))  # dots/spaces only — a tone/การันต์ mark is a different spelling  # noqa: E731
    if reg and loose(reg["name"]) != loose(name):
        add("agency.name vs DOE registry", False, f"entry {name} · registry {reg['name']}")
    else:
        add("agency.name", in_ocr or (reg and best_ratio(name, T) >= 0.85),
            f"{name} · OCR exact={in_ocr} · registry={'match' if reg else 'not found'}")
    passes = passes or [T]
    want, got = {re.sub(r"\D", "", p) for p in e["agency"].get("phones", [])}, phone_digits(T)
    # every entry phone must be read exactly by OCR (any pass); any OTHER agency-line number read in >=2 passes
    # that is not a 1-digit slip of an entry phone = a phone the entry missed -> HOLD
    raw2 = seen_twice([phone_digits(t, raw=True) for t in passes])
    stray = sorted(g for g in raw2 if g[:len(g)] not in want and g[:10 if g[1] in "689" else 9] not in want
                   and not any(near(g, w) for w in want))
    add("agency.phones", want <= got and not stray, f"entry {sorted(want)} vs OCR {sorted(got)} · unexplained {stray}")
    add("employer", best_ratio(e["employer"], T) >= 0.85, e["employer"])
    add("total", re.search(rf"(?<![\d,]){e['total']:,}(?![\d,])|(?<![\d,]){e['total']}(?![\d,])", T)
        or word_count(e["total"], squash(T)), e["total"])
    add("total = sum(positions)", sum(p["count"] for p in e["positions"]) == e["total"],
        f"{[p['count'] for p in e['positions']]} vs {e['total']}")
    m = re.search(r"รวม\D{0,30}?(\d+)\s*\(?[ก-๙]*\)?\s*-?\s*ตำแหน่ง", T)
    if m:
        add("number of positions", int(m.group(1)) == len(e["positions"]), f"OCR {m.group(1)} vs {len(e['positions'])}")
    rows = re.findall(r"<tr>(.*?)</tr>", T, re.S)
    for p in e["positions"]:
        r = max((best_ratio(t, T), t) for t in [p["title"]])[0] if " · " not in p["title"] else min(
            best_ratio(t, T) for t in p["title"].split(" · "))
        add(f"position '{p['title']}'", r >= 0.8, f"similarity {r:.2f}")
        row = next((x for x in rows if squash(p["title"].split(" · ")[0]) in squash(x)), None)
        if row:  # the count column is often blank in OCR; when OCR does read a number in this row it must agree
            cells = [norm(c).strip() for c in re.findall(r"<t[dh][^>]*>(.*?)</t[dh]>", row, re.S)]
            nums = [int(c) for c in cells[2:] if re.fullmatch(r"\d{1,4}", c)]
            if nums:
                add(f"count '{p['title']}'", p["count"] in nums, f"entry {p['count']} vs OCR row {nums}")
    for k in ("windowStart", "windowEnd", "issued"):
        if e.get(k):
            add(k, thai_date_re(e[k]).search(T), e[k])
    for i, p in enumerate(e["pay"]):
        for part in ("main", "baht"):
            for n in numbers(p.get(part) or ""):
                if len(n.replace(".", "")) >= 3:
                    add(f"pay[{i}].{part} {n}", n in numbers(T), p.get(part))
    has_m, has_f = "ชาย" in flat, "หญิง" in flat
    sex = e.get("sex")
    ok = {"male": has_m and not has_f, "female": has_f and not has_m, "any": True, None: not (has_m or has_f)}.get(sex, False)
    add("sex", ok, f"entry {sex} · OCR ชาย={has_m} หญิง={has_f}")
    if e.get("sexQuote"):
        add("sexQuote", best_ratio(e["sexQuote"], T) >= 0.85, e["sexQuote"])
    ages_any = sorted(ages_in(T))
    ages = sorted(seen_twice([ages_in(t) for t in passes]))
    for k in ("ageMin", "ageMax"):
        if e.get(k) is not None:
            add(k, e[k] in ages_any, f"entry {e[k]} vs OCR ages {ages_any}")
    if e.get("ageMin") is None and e.get("ageMax") is None:
        add("age not stated", not ages, f"OCR ages {ages}")
    for c in e.get("costs", []):
        add(f"cost who '{c['item']}'", c.get("who") in WHO, c.get("who"))
        if c.get("quote"):
            r = best_ratio(c["quote"], T)
            add(f"cost quote '{c['item']}'", r >= 0.85, f"similarity {r:.2f}")
            q = squash(c["quote"])
            if "หัก" in q and c["who"] not in ("deduct",):
                add(f"cost who '{c['item']}' vs quote", False, "quote says หัก (deduct)")
            if re.search(r"ลูกจ้าง(เป็น)?ผู้?รับผิดชอบ", q) and c["who"] != "worker":
                add(f"cost who '{c['item']}' vs quote", False, "quote says worker pays")
    for t in e.get("terms", []):
        r = best_ratio(t, T)
        add(f"term '{t[:30]}'", r >= 0.8, f"similarity {r:.2f}")
    text = json.dumps(e, ensure_ascii=False)
    for w in BANNED:
        if w in text:
            add("banned wording", False, w)
    return res


def table_counts(pdf, cache):
    """Third reader for the positions table: qwen3.8 vision on a zoomed crop (Typhoon often leaves the count
    column blank, and DOE stamps sit on it). Returns {"rows":[{"title","count"}],"total"} or None."""
    key = hashlib.sha256(Path(pdf).read_bytes()).hexdigest()[:16]
    f = cache / f"{key}-table.json" if cache else None
    if f and f.exists():
        return json.loads(f.read_text(encoding="utf-8"))
    import pymupdf
    ensure_gpu()
    page = pymupdf.open(pdf)[0]
    r = page.rect
    png = page.get_pixmap(dpi=220, clip=pymupdf.Rect(0, r.height * 0.33, r.width, r.height * 0.8)).tobytes("png")
    q = ('ภาพนี้คือตารางตำแหน่งงานจากหนังสืออนุญาต ตอบเป็น JSON {"rows":[{"title":"ตำแหน่ง","count":จำนวนคน}],"total":จำนวนคนรวม} '
         'count คือตัวเลขในคอลัมน์ "จำนวน (คน)" ของแถวนั้น (ไม่ใช่ลำดับที่ และไม่ใช่อัตราค่าจ้าง) '
         'total คือจำนวน "คน" รวมในแถว รวม (ไม่ใช่จำนวนตำแหน่ง) ถ้าตัวเลขช่องไหนอ่านไม่ได้ให้ใส่ null ห้ามเดา')
    try:
        out = R._json(R._chat(R.VISION, q, image=png, fmt="json", think=False, num_predict=800))
    except Exception:  # noqa: BLE001
        return None
    if f:
        f.write_text(json.dumps(out, ensure_ascii=False), encoding="utf-8")
    return out


_D = ["", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"]


def thai_words(n):
    """454 -> สี่ร้อยห้าสิบสี่ (DOE permits spell counts out in brackets next to the digits)."""
    if n == 0:
        return "ศูนย์"
    out, units = "", ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน"]
    ds = str(n)
    for i, ch in enumerate(ds):
        d, pos = int(ch), len(ds) - i - 1
        if d == 0:
            continue
        if pos == 1 and d == 1:
            out += "สิบ"
        elif pos == 1 and d == 2:
            out += "ยี่สิบ"
        elif pos == 0 and d == 1 and len(ds) > 1:
            out += "เอ็ด"
        else:
            out += _D[d] + units[pos]
    return out


def count_checks(e, tab, T=""):
    """Each count needs an independent confirmation: qwen's zoomed table read, or the Thai-word spelling of
    the number found in the OCR transcript (it often survives where the digits sit under the DOE seal).
    A total of 1 from qwen is the 'รวม 1 ตำแหน่ง' position count, not people -> treated as unread."""
    res = []
    flat = squash(T)
    # the spelled number must sit next to the digits "454(สี่ร้อย…)" or before "คน" — a bare "เก้า" anywhere
    # on the page (dates, pay) is not evidence
    words = lambda n: word_count(n, flat)  # noqa: E731
    rows = (tab or {}).get("rows") if isinstance((tab or {}).get("rows"), list) else []
    qt = (tab or {}).get("total")
    if qt == 1 and e["total"] != 1:
        qt = None  # qwen read the "รวม 1 ตำแหน่ง" position count, not people
    rl = {int(x.replace(",", "")) for x in re.findall(r"ตำแหน่ง\D{0,14}?(\d[\d,]*)\s*\(?[ก-๙]{0,14}\)?\s*-?\s*คน", norm(T))}
    ok = qt == e["total"] or words(e["total"]) or e["total"] in rl
    res.append(("total (qwen table / Thai words)", ok, f"entry {e['total']} · qwen {qt} · words {words(e['total'])}"))
    if len(e["positions"]) == 1:
        return res  # single row: count == total, already checked
    for i, p in enumerate(e["positions"]):
        row = rows[i] if len(rows) == len(e["positions"]) else {}
        ok = row.get("count") == p["count"] or words(p["count"])
        res.append((f"count '{p['title']}' (qwen table / Thai words)", ok,
                    f"entry {p['count']} · qwen {row.get('count')} · words {words(p['count'])}"))
    return res


def crop_checks(e, pdf, cache):
    """Located evidence for fields the full-page OCR can't read (digits under the DOE seal).
    entry "crops": [{"field": "total", "box": [x0, y0, x1, y1]}]  (page fractions). The box only says WHERE to
    look; typhoon-ocr reads that crop at 400/500/600 dpi and must produce the entry value itself, spelled
    "<digits>(<Thai words>)" or "<Thai words> คน", in >=3 of 6 reads (350-800 dpi). Random tiling was rejected: it
    hallucinates "200 (สองร้อย) คน"-style text and would confirm wrong counts."""
    out = []
    crops = e.get("crops") or []
    if not crops:
        return out
    import pymupdf
    page = pymupdf.open(pdf)[0]
    W, H = page.rect.width, page.rect.height
    key = hashlib.sha256(Path(pdf).read_bytes()).hexdigest()[:16]
    for c in crops:
        x0, y0, x1, y1 = c["box"]
        if c["field"] != "total" or not (0 <= x0 < x1 <= 1 and 0 <= y0 < y1 <= 1) or (x1 - x0) * (y1 - y0) > 0.06:
            out.append((f"crop {c['field']}", False, "only field 'total', box <= 6 % of the page"))
            continue
        hits, reads = 0, []
        for dpi in (350, 450, 550, 650, 700, 800):
            f = cache / f"{key}-crop-{x0}-{y0}-{x1}-{y1}-{dpi}.txt"
            if f.exists():
                t = f.read_text(encoding="utf-8")
            else:
                ensure_gpu()
                png = page.get_pixmap(dpi=dpi, clip=pymupdf.Rect(W * x0, H * y0, W * x1, H * y1)).tobytes("png")
                t = R._chat(R.OCR, R.OCR_PROMPT, image=png, num_predict=200).strip()
                f.write_text(t, encoding="utf-8")
            reads.append(t[:60])
            fl = squash(norm(t))
            n = e["total"]
            hits += word_count(n, fl)
        out.append(("total (located crop)", hits >= 3, f"{hits}/6 reads · {reads}"))
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("entry"), ap.add_argument("pdf")
    ap.add_argument("--ocr-cache", default=str(ROOT / "scripts/permits-inbox/ocr"))
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    e = json.loads(Path(a.entry).read_text(encoding="utf-8"))
    cache = Path(a.ocr_cache)
    cache.mkdir(parents=True, exist_ok=True)
    today = datetime.now(TZ).date().isoformat()
    if e.get("windowEnd") and e["windowEnd"] < today:
        out = {"verdict": "ENDED", "permit": e.get("permit"), "windowEnd": e["windowEnd"]}
        print(json.dumps(out, ensure_ascii=False) if a.json else f"ENDED {e.get('permit')} window ended {e['windowEnd']}")
        return 3
    passes, res = [], []
    for dpi in DPIS:  # first pass decides; later passes only add evidence for fields the first one missed
        passes.append(norm(ocr(a.pdf, dpi, cache)))
        res = checks(e, "\n".join(passes), passes)
        if all(ok for _, ok, _ in res):
            break
    def full(ps):
        r = checks(e, "\n".join(ps), ps) + count_checks(e, table_counts(a.pdf, cache), "\n".join(ps))
        if any(f.startswith("total (qwen") and ok for f, ok, _ in r):
            r = [(f, ok or f == "total", d) for f, ok, d in r]  # total confirmed by table read / รวม line
        return r

    res = full(passes)
    cr = crop_checks(e, a.pdf, cache)
    if cr:
        res += cr
        if all(ok for _, ok, _ in cr):  # located crop read the total itself -> it stands in for the table/word read
            res = [(f, ok or f in ("total", "total (qwen table / Thai words)"), d) for f, ok, d in res]
    fails = [(f, d) for f, ok, d in res if not ok]
    verdict = "PASS" if not fails else "HOLD"
    out = {"verdict": verdict, "permit": e["permit"], "checked": len(res), "ocr_passes": len(passes),
           "failures": [{"field": f, "detail": str(d)} for f, d in fails],
           "pdf_sha256": hashlib.sha256(Path(a.pdf).read_bytes()).hexdigest()}
    if a.json:
        print(json.dumps(out, ensure_ascii=False, indent=1))
    else:
        print(f"{verdict} {e['permit']} · {len(res) - len(fails)}/{len(res)} checks · OCR passes {len(passes)}")
        for f, d in fails:
            print(f"  ✗ {f}: {d}")
    return 0 if verdict == "PASS" else 1


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as ex:  # noqa: BLE001
        print(json.dumps({"verdict": "ERROR", "error": str(ex)}, ensure_ascii=False))
        sys.exit(2)
