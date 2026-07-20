"""
dbd-diagnose.py
---------------
Standalone diagnostic for the "148/149 — 1 missing dbd_scraped_at" gap.

Reuses the same Supabase client setup as companu-details.py, so run it
anywhere that scraper runs (e.g. the lighthouse-core host). No arguments.

It prints:
  1. The dbd_freshness_report summary (total / populated / missing / stale).
  2. Every agency with dbd_scraped_at IS NULL   — the actual gap.
  3. Every agency with a null/empty juristic_id  — the most likely cause
     (companu-details.py:167 skips these, so they never get scraped).

Prerequisites (same as the scraper):
    pip install supabase python-dotenv
    .env.local must define NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY

Run:
    python3 scripts/dbd-diagnose.py
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

from dotenv import load_dotenv
from supabase import create_client

# Match companu-details.py exactly: load .env.local from the repo root.
ROOT = Path(__file__).parent.parent
load_dotenv(ROOT / ".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

# Columns we'd like to show if present. We select "*" and print whatever
# exists, so the script doesn't break if the schema differs.
PREFERRED_COLS = [
    "id", "name_th", "name_en", "license_number",
    "juristic_id", "dbd_scraped_at", "created_at",
]


def die(msg: str) -> None:
    print(f"ERROR: {msg}", file=sys.stderr)
    sys.exit(1)


def show(row: dict) -> str:
    """Render a row using preferred columns first, then any extras."""
    keys = [c for c in PREFERRED_COLS if c in row]
    keys += [k for k in row if k not in keys]
    return "\n".join(f"    {k:16} = {row.get(k)!r}" for k in keys)


def main() -> None:
    if not SUPABASE_URL or not SUPABASE_KEY:
        die(
            "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY. "
            "Check .env.local (same file the scraper uses)."
        )

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    # ── 1. Summary via the same RPC the scraper logs ────────────────────────
    print("=" * 60)
    print("DBD freshness summary (dbd_freshness_report RPC)")
    print("=" * 60)
    try:
        rep = supabase.rpc("dbd_freshness_report").execute()
        for r in rep.data:
            print(f"  total_agencies : {r.get('total_agencies')}")
            print(f"  dbd_populated  : {r.get('dbd_populated')}")
            print(f"  dbd_missing    : {r.get('dbd_missing')}")
            print(f"  dbd_stale      : {r.get('dbd_stale')}")
            print(f"  last_dbd_update: {r.get('last_dbd_update')}")
    except Exception as e:  # noqa: BLE001
        print(f"  (could not run RPC: {e})")

    # ── 2. Agencies with dbd_scraped_at IS NULL — the real gap ──────────────
    print()
    print("=" * 60)
    print("Agencies with dbd_scraped_at IS NULL  (the gap)")
    print("=" * 60)
    missing = supabase.table("agencies").select("*").is_(
        "dbd_scraped_at", "null"
    ).execute()
    if not missing.data:
        print("  none — every agency has DBD data. Nothing to fix.")
    else:
        for i, row in enumerate(missing.data, 1):
            print(f"  [{i}] ------------------------------------------------")
            print(show(row))

    # ── 3. Agencies with null/empty juristic_id — the likely cause ──────────
    print()
    print("=" * 60)
    print("Agencies with null/empty juristic_id  (skipped by scraper)")
    print("=" * 60)
    no_jid = supabase.table("agencies").select("*").or_(
        "juristic_id.is.null,juristic_id.eq."
    ).execute()
    if not no_jid.data:
        print("  none — every agency has a juristic_id.")
        print("  => the gap is NOT a missing juristic_id; the scrape may have")
        print("     failed for that row for another reason. Check the run log.")
    else:
        for i, row in enumerate(no_jid.data, 1):
            print(f"  [{i}] ------------------------------------------------")
            print(show(row))
        print()
        print("  FIX: set juristic_id (13-digit DBD registration number, from")
        print("  https://www.dbd.go.th) on the row(s) above, then re-run the")
        print("  scraper. companu-details.py:167 skips rows without one.")


if __name__ == "__main__":
    main()
