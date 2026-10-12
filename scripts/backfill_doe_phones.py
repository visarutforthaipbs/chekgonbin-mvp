"""Probe/backfill DOE detail fields after the label-matching fix in scripts/scraper.py.

Usage:
  python3 backfill_doe_phones.py --probe N      # parse N companies, print old vs new (no writes)
  python3 backfill_doe_phones.py --apply        # update phone / director_mobile / fax for all rows

Only writes phone, director_mobile, fax — and only when the freshly parsed value is
non-empty, so a failed fetch can never blank a row. Runs on a Thai IP (DOE WAF).
"""
import argparse, json, os, sys, time, types, urllib.parse, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ENV = os.path.join(HERE, "..", ".env.local")
for line in open(ENV):
    if "=" in line and not line.startswith("#"):
        k, v = line.strip().split("=", 1)
        os.environ.setdefault(k, v.strip().strip('"'))

# scraper.py imports supabase/schedule/dotenv at module level; we only need its
# session + detail parser, so stub the heavy imports.
for name in ("schedule", "dotenv", "supabase"):
    if name not in sys.modules:
        m = types.ModuleType(name)
        m.load_dotenv = lambda *a, **k: None
        m.create_client = lambda *a, **k: None
        sys.modules[name] = m
sys.path.insert(0, HERE)
import scraper  # noqa: E402

U = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
K = os.environ["SUPABASE_SERVICE_KEY"]
H = {"apikey": K, "Authorization": "Bearer " + K, "Content-Type": "application/json"}


def rest(method, path, body=None, extra=None):
    req = urllib.request.Request(f"{U}/rest/v1/{path}", method=method, headers={**H, **(extra or {})},
                                 data=json.dumps(body).encode() if body is not None else None)
    with urllib.request.urlopen(req, timeout=60) as r:
        txt = r.read().decode()
        return json.loads(txt) if txt else None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--probe", type=int, default=0)
    ap.add_argument("--apply", action="store_true")
    a = ap.parse_args()

    rows = rest("GET", "agencies?select=cid,name_th,phone,director_mobile,fax&cid=not.is.null&order=name_th")
    if a.probe:
        rows = rows[: a.probe]
    session, hidden = scraper.init_session()
    changed = failed = 0
    for i, row in enumerate(rows, 1):
        try:
            d = scraper.fetch_detail(session, hidden, row["cid"])
        except Exception as e:  # never blank a row on a failed fetch
            failed += 1
            print(f"[{i}] FAIL cid={row['cid']}: {e}")
            continue
        patch = {k: d[k] for k in ("phone", "director_mobile", "fax") if d.get(k) and d.get(k) != row.get(k)}
        if a.probe or patch:
            print(f"[{i}] {row['name_th'][:40]} | old phone={row['phone']!r} -> {patch or 'unchanged'}")
        if patch and a.apply:
            rest("PATCH", f"agencies?cid=eq.{urllib.parse.quote(row['cid'])}", patch, {"Prefer": "return=minimal"})
            changed += 1
        time.sleep(scraper.DELAY_SEC)
    print(f"done: rows={len(rows)} changed={changed} failed={failed} apply={a.apply}")


if __name__ == "__main__":
    main()
