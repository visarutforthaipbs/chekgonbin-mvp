#!/usr/bin/env python3
"""Watch the DOE list of overseas recruitment permits (จต.2 / จต.2ข) for ones not yet on /rounds.

Detect-only: downloads new permit PDFs + sha256 into scripts/permits-inbox/, prints a report.
It NEVER edits data/rounds.js — every permit is read by two readers and approved by the owner.

Run from a Thai IP (doe.go.th drops cloud IPs).  Exit codes: 0 nothing new · 10 new permits · 2 fetch/parse failure.
  python3 scripts/watch-permits.py            # report + download new PDFs
  python3 scripts/watch-permits.py --json     # machine-readable
"""
import hashlib, html, json, re, subprocess, sys, time
from datetime import datetime, timezone, timedelta
from pathlib import Path

LIST_URL = "https://www.doe.go.th/prd/overseas/news/param/site/149/cat/9/sub/0/pull/category/view/list-label"
POOL = "https://www.doe.go.th/prd/download/download_by_pool_file/"
ROOT = Path(__file__).resolve().parent.parent
INBOX = ROOT / "scripts" / "permits-inbox"
STATE = INBOX / "state.json"
TZ = timezone(timedelta(hours=7))
MIN_ON_PAGE = 5  # fewer permits than this on the list page = layout changed / blocked, not "nothing new"


def curl(url, out=None):
    cmd = ["curl", "-sL", "--max-time", "60", "-A", "Mozilla/5.0", url]
    if out:
        cmd += ["-o", str(out)]
    r = subprocess.run(cmd, capture_output=True)
    if r.returncode:
        raise RuntimeError(f"curl exit {r.returncode} for {url}")
    return r.stdout


def list_permits():
    page = curl(LIST_URL).decode("utf-8", "ignore")
    found = {}
    for m in re.finditer(r'href="[^"]*download_by_pool_file/(\d+)"[^>]*>(.*?)</a>', page, re.S):
        title = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", "", m.group(2)))).strip()
        p = re.search(r"(จต\.\s*2\s*ข?)\s*(\d+\s*/\s*\d{4})", title)
        if not p:
            continue
        kind = p.group(1).replace(" ", "")
        no = p.group(2).replace(" ", "")
        found.setdefault(f"{kind} {no}", {"kind": kind, "permit": no, "pool_id": m.group(1), "title": title})
    return list(found.values())


def on_site():
    src = (ROOT / "data" / "rounds.js").read_text(encoding="utf-8")
    return set(re.findall(r'permit:\s*"(\d+/\d{4})"', src))


def main():
    as_json = "--json" in sys.argv
    INBOX.mkdir(parents=True, exist_ok=True)
    state = json.loads(STATE.read_text()) if STATE.exists() else {"seen": {}, "failures": 0}
    try:
        listed = list_permits()
        if len(listed) < MIN_ON_PAGE:
            raise RuntimeError(f"only {len(listed)} permits parsed from list page (expected >= {MIN_ON_PAGE})")
    except Exception as e:  # noqa: BLE001
        state["failures"] = state.get("failures", 0) + 1
        state["last_error"] = f"{datetime.now(TZ):%Y-%m-%d %H:%M} {e}"
        STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2))
        print(json.dumps({"ok": False, "error": str(e), "consecutive_failures": state["failures"]}, ensure_ascii=False))
        return 2

    site = on_site()
    # จต.2 = recruitment by licensed agency (what /rounds shows). จต.2ข is a different permit type — reported separately.
    new, other = [], []
    for p in listed:
        if p["kind"] == "จต.2" and p["permit"] in site:
            continue
        key = f'{p["kind"]} {p["permit"]}'
        rec = state["seen"].get(key)
        if not rec:
            pdf = INBOX / f'{p["kind"].replace(".", "")}-{p["permit"].replace("/", "-")}-{p["pool_id"]}.pdf'
            curl(POOL + p["pool_id"], pdf)
            ok = pdf.exists() and pdf.stat().st_size > 1000 and pdf.read_bytes()[:4] == b"%PDF"
            rec = {**p, "first_seen": f"{datetime.now(TZ):%Y-%m-%d}", "pdf": str(pdf.relative_to(ROOT)),
                   "sha256": hashlib.sha256(pdf.read_bytes()).hexdigest() if ok else None, "pdf_ok": ok}
            state["seen"][key] = rec
            time.sleep(1)
        (new if p["kind"] == "จต.2" else other).append(rec)

    state.update(failures=0, last_ok=f"{datetime.now(TZ):%Y-%m-%d %H:%M}", listed=len(listed))
    STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2))
    report = {"ok": True, "listed": len(listed), "on_site": len(site), "new_jt2": new, "other_types": other}
    if as_json:
        print(json.dumps(report, ensure_ascii=False, indent=2))
    else:
        print(f"DOE list: {len(listed)} permits · on /rounds: {len(site)} · new จต.2 not on site: {len(new)}")
        for r in new:
            print(f'  NEW จต.2 {r["permit"]}  first seen {r["first_seen"]}  pdf {"OK" if r["pdf_ok"] else "FAILED"}  {r["title"][:90]}')
        if other:
            print(f"  (+{len(other)} จต.2ข permits — different permit type, not shown on /rounds)")
    return 10 if new else 0


if __name__ == "__main__":
    sys.exit(main())
