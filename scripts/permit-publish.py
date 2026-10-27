#!/usr/bin/env python3
"""Publish ONE verified permit to thaimigrantwatch.org/rounds — no human step.

  python3 scripts/permit-publish.py scripts/permits-inbox/<slug>.entry.json <permit.pdf> [--dry-run]

Re-runs scripts/permit-verify.py itself (OCR is cached, so this is cheap) and refuses unless it PASSes,
so nothing can reach the site without the GPU Thai-OCR double check. Then:
  insert entry into data/rounds.js (AUTO block) -> bump ROUNDS_UPDATED -> npm test:rounds + test:countries
  -> commit data/rounds.js only -> push feat/journey + main (Vercel deploys main) -> wait for the live page.
Any failure restores data/rounds.js and exits non-zero.
Exit: 0 published · 1 refused (verify HOLD/ENDED/duplicate) · 2 error (tests/git/deploy).
"""
import json, re, subprocess, sys, time, urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / "data/rounds.js"
TZ = timezone(timedelta(hours=7))
AUTO = "  // ───────────────────────── AUTO (permit-publish.py: primary read + GPU Thai-OCR check) ─────────────────────────\n"
COUNTRY_TH = {"IL": "อิสราเอล", "RO": "โรมาเนีย", "LT": "ลิทัวเนีย", "TW": "ไต้หวัน", "KR": "เกาหลีใต้", "JP": "ญี่ปุ่น",
              "MY": "มาเลเซีย", "SG": "สิงคโปร์", "AU": "ออสเตรเลีย", "NZ": "นิวซีแลนด์", "PL": "โปแลนด์", "SE": "สวีเดน",
              "FI": "ฟินแลนด์", "HU": "ฮังการี", "CZ": "เช็กเกีย", "HR": "โครเอเชีย", "SK": "สโลวาเกีย", "AE": "สหรัฐอาหรับเอมิเรตส์",
              "SA": "ซาอุดีอาระเบีย", "QA": "กาตาร์", "KW": "คูเวต", "US": "สหรัฐอเมริกา", "CA": "แคนาดา", "DE": "เยอรมนี",
              "PT": "โปรตุเกส", "ES": "สเปน", "MT": "มอลตา", "BN": "บรูไน", "HK": "ฮ่องกง", "MO": "มาเก๊า"}
REQUIRED = ["permit", "slug", "country", "channel", "industry", "employer", "agency", "positions", "total", "sex",
            "ageMin", "ageMax", "pay", "costs", "terms", "windowStart", "windowEnd", "issued", "source"]
IDENT = re.compile(r"[A-Za-z_]\w*")
COST_WHO = {"employer", "partial", "deduct", "in-pay", "employer-unclear", "unclear", "worker"}


def sh(cmd, **kw):
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True, **kw)
    if r.returncode:
        raise RuntimeError(f"{' '.join(cmd)} -> {r.returncode}\n{(r.stdout + r.stderr)[-1500:]}")
    return r.stdout


def js(v, ind=4):
    """Python value -> JS literal in the file's house style (unquoted identifier keys)."""
    pad, inner = " " * (ind - 2), " " * ind
    if isinstance(v, dict):
        if not v:
            return "{}"
        items = [f"{inner}{k if IDENT.fullmatch(k) else json.dumps(k, ensure_ascii=False)}: {js(x, ind + 2)}"
                 for k, x in v.items()]
        return "{\n" + ",\n".join(items) + f",\n{pad}}}"
    if isinstance(v, list):
        if not v:
            return "[]"
        if all(not isinstance(x, (dict, list)) for x in v) and len(json.dumps(v, ensure_ascii=False)) < 90:
            return "[" + ", ".join(js(x) for x in v) + "]"
        return "[\n" + ",\n".join(f"{inner}{js(x, ind + 2)}" for x in v) + f",\n{pad}]"
    return json.dumps(v, ensure_ascii=False)


def validate(e):
    miss = [k for k in REQUIRED if k not in e]
    if miss:
        raise ValueError(f"entry missing keys {miss}")
    if e["slug"] != e["permit"].replace("/", "-"):
        raise ValueError("slug must be permit with '-'")
    if not re.fullmatch(r"[A-Z]{2}", e["country"]):
        raise ValueError("country must be ISO-2")
    bad = [c for c in e["costs"] if c.get("who") not in COST_WHO or (not c.get("quote") and c.get("who") != "unclear")]
    if bad:
        raise ValueError(f"cost who not in COST_LABEL, or quote missing on a non-'unclear' item: {bad}")
    if not isinstance(e["source"].get("pool_id"), int):
        raise ValueError("source.pool_id (int) required")


def render(e, verified_note):
    e = dict(e)
    pool = e.pop("source")["pool_id"]
    e.pop("feeBan", None)
    e.pop("crops", None)  # verifier evidence only, not site data
    e["verified"] = verified_note
    body = js(e, 4)
    body = body[:-1].rstrip() + f"\n    feeBan: FEE_BAN,\n    source: {{ url: doe({pool}), page: 1 }},\n  }}"
    return "  " + body + ",\n"


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    dry = "--dry-run" in sys.argv
    entry_path, pdf = Path(args[0]), args[1]
    e = json.loads(entry_path.read_text(encoding="utf-8"))
    validate(e)
    src = DATA.read_text(encoding="utf-8")
    if re.search(rf'permit:\s*"{re.escape(e["permit"])}"', src):
        print(f"REFUSED {e['permit']} already on /rounds")
        return 1
    v = subprocess.run([sys.executable, str(ROOT / "scripts/permit-verify.py"), str(entry_path), pdf, "--json"],
                       capture_output=True, text=True, cwd=ROOT)
    verdict = json.loads(v.stdout or '{"verdict":"ERROR"}')
    if verdict.get("verdict") != "PASS":
        print(f"REFUSED {e['permit']} verify={verdict.get('verdict')} "
              f"{[f['field'] for f in verdict.get('failures', [])]}")
        return 1
    today = datetime.now(TZ)
    th = f"{today.day} {['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'][today.month-1]} {today.year+543}"
    note = (f"อ่านจากใบอนุญาตโดย thmw-pm และตรวจซ้ำด้วย Thai OCR (typhoon-ocr บน gpu01) {th}; "
            f"ผ่าน {verdict['checked']} จุดตรวจ")

    new = src
    if AUTO not in new:
        new = new.replace("\n];\n\n// What each `who` value", "\n" + AUTO + "];\n\n// What each `who` value", 1)
    i = new.index(AUTO) + len(AUTO)
    j = new.index("\n];\n", i - 1) + 1  # end of ROUNDS, after any earlier AUTO entries
    new = new[:j] + render(e, note) + new[j:]
    cm = re.search(r"export const COUNTRIES = \{(.*?)\n\};", new, re.S)
    if not cm:
        raise RuntimeError("COUNTRIES block not found")
    if f"\n  {e['country']}:" not in cm.group(1):
        name = COUNTRY_TH.get(e["country"])
        if not name:
            raise ValueError(f"no Thai name for country {e['country']} — add it to COUNTRY_TH")
        new = re.sub(r"(export const COUNTRIES = \{.*?)(\n\};)", rf'\1\n  {e["country"]}: {{ name: "{name}" }},\2', new, 1, re.S)
    new = re.sub(r'ROUNDS_UPDATED = "\d{4}-\d{2}-\d{2}"', f'ROUNDS_UPDATED = "{today:%Y-%m-%d}"', new)
    if new.count(f'permit: "{e["permit"]}"') != 1:
        raise RuntimeError("insert failed")
    DATA.write_text(new, encoding="utf-8")
    try:
        sh(["npm", "run", "-s", "test:rounds"])
        sh(["node", "scripts/test-countries.mjs"])
        sh(["npx", "eslint", "data/rounds.js"])
        if dry:
            print(f"DRY-RUN OK {e['permit']} (tests pass) — data/rounds.js restored")
            DATA.write_text(src, encoding="utf-8")
            return 0
        sh(["git", "add", "data/rounds.js"])
        sh(["git", "commit", "-m", f"data(rounds): auto-publish จต.2 {e['permit']} {e['country']} {e['total']} อัตรา "
            f"(primary read + GPU Thai-OCR check PASS {verdict['checked']}/{verdict['checked']})", "--", "data/rounds.js"])
    except Exception:
        DATA.write_text(src, encoding="utf-8")
        raise
    branch = sh(["git", "rev-parse", "--abbrev-ref", "HEAD"]).strip()
    sh(["git", "push", "-q", "origin", f"{branch}:{branch}"])
    sh(["git", "push", "-q", "origin", f"{branch}:main"])
    sha = sh(["git", "rev-parse", "--short", "HEAD"]).strip()
    url = f"https://thaimigrantwatch.org/rounds/{e['slug']}"
    for _ in range(40):  # up to ~10 min for Vercel
        time.sleep(15)
        try:
            if urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": "thmw-publish"}), timeout=20).status == 200:
                print(f"PUBLISHED {e['permit']} commit {sha} live {url}")
                return 0
        except Exception:  # noqa: BLE001
            continue
    print(f"PUSHED {e['permit']} commit {sha} but {url} not live after 10 min")
    return 2


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as ex:  # noqa: BLE001
        print(f"ERROR {ex}")
        sys.exit(2)
