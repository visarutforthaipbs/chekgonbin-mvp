"""
import_dbd_data.py
------------------
One-time import: reads test_output.json (148 companies) and updates the
Supabase `agencies` table with DBD financial data.

Match key: agencies.juristic_id = record["reg_number"]

Run AFTER applying the SQL migration:
    python3 scripts/import_dbd_data.py
"""
import json
import os
import sys
import logging
from pathlib import Path
from datetime import datetime, timezone

from supabase import create_client
from dotenv import load_dotenv

# ── Config ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent          # chekgonbin-mvp-1/
load_dotenv(ROOT / ".env.local")             # reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_KEY

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    sys.exit("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local")

INPUT_FILE = Path(__file__).parent / "test_output.json"


# ── Mapping helpers ───────────────────────────────────────────────────────────
def safe_float(val):
    try:
        return float(val) if val is not None else None
    except (TypeError, ValueError):
        return None


def safe_int(val):
    try:
        return int(float(val)) if val not in (None, "", "-") else None
    except (TypeError, ValueError):
        return None


def build_update(record: dict) -> dict:
    """Extract the new DBD columns from a fetched record."""
    info = record.get("info") or {}
    return {
        "cap_amt":             safe_int(info.get("capAmt")),
        "paid_amt":            safe_int(info.get("paidAmt")),
        "share_qty":           safe_int(info.get("shareQty")),
        "share_vol":           safe_int(info.get("shareVol")),
        "jp_stat_code":        info.get("jpStatCode"),
        "fiscal_year":         str(info["fiscalYear"]) if info.get("fiscalYear") else None,
        "total_asset":         safe_float(info.get("totalAsset")),
        "total_income":        safe_float(info.get("totalIncome")),
        "net_profit":          safe_float(info.get("netProfit")),
        "total_equity":        safe_float(info.get("totalEquity")),
        "current_ratio":       safe_float(info.get("currentRatio")),
        "debt_to_equity":      safe_float(info.get("debtToEquity")),
        "return_on_asset":     safe_float(info.get("returnOnAsset")),
        "return_on_equity":    safe_float(info.get("returnOnEquity")),
        "net_profit_margin":   safe_float(info.get("netProfitMargin")),
        "gross_profit_margin": safe_float(info.get("grossProfitMargin")),
        "business_size_code":  info.get("businessSizeCode"),
        "company_age":         safe_int(info.get("jpAge")),
        "committees":          record.get("committees"),
        "financials":          record.get("financials"),
        "financials_prev":     record.get("financials_prev"),
        "dbd_scraped_at":      record.get("scraped_at"),
    }


# ── Main ──────────────────────────────────────────────────────────────────────
def main():
    log.info("Loading %s", INPUT_FILE)
    with open(INPUT_FILE, encoding="utf-8") as f:
        records = json.load(f)
    log.info("Loaded %d records", len(records))

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

    ok = 0
    fail = 0
    for i, record in enumerate(records, 1):
        juristic_id = record.get("reg_number")
        if not juristic_id:
            log.warning("[%d] Missing reg_number, skipping", i)
            fail += 1
            continue

        payload = build_update(record)

        result = (
            supabase.table("agencies")
            .update(payload)
            .eq("juristic_id", juristic_id)
            .execute()
        )

        if hasattr(result, "data") and result.data:
            log.info("[%d/%d] ✓ Updated %s (%s)", i, len(records), juristic_id, record.get("name_th", ""))
            ok += 1
        else:
            log.warning("[%d/%d] ✗ No row matched juristic_id=%s — data=%s", i, len(records), juristic_id, result.data)
            fail += 1

    log.info("Done — %d updated, %d failed/unmatched", ok, fail)


if __name__ == "__main__":
    main()
