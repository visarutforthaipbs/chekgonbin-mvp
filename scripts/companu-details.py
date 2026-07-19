"""
companu-details.py
------------------
Production scraper: fetches DBD financial data for all 148 recruitment agencies
and updates the Supabase `agencies` table.

Prerequisites:
    pip install curl-cffi cryptography supabase python-dotenv

Run manually:
    python3 scripts/companu-details.py

Or call from the Next.js cron route at /api/cron/scrape-agencies (set X-Secret).
"""

from __future__ import annotations

import base64
import csv
import gzip
import json
import logging
import os
import re
import sys
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from curl_cffi import requests as cffi_requests
from dotenv import load_dotenv
from supabase import create_client

# ── Config ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent          # chekgonbin-mvp-1/
load_dotenv(ROOT / ".env.local")

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
DBD_BASE     = "https://datawarehouse.dbd.go.th"
CSV_PATH     = Path(__file__).parent / "company-id.csv"

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Origin":  DBD_BASE,
    "Referer": DBD_BASE + "/",
    "Accept":  "application/json",
}


# ── Decryption (HKDF + AES-256-GCM + gzip) ───────────────────────────────────

def b64url_decode(s: str) -> bytes:
    padding = 4 - len(s) % 4
    if padding != 4:
        s += "=" * padding
    return base64.urlsafe_b64decode(s)


def decrypt_response(enc_key_str: str, payload: dict, request_url: str) -> dict | None:
    try:
        raw_key = b64url_decode(enc_key_str)
        if len(raw_key) not in (16, 24, 32):
            m = re.match(r'^\d+_(.*)', enc_key_str)
            if m:
                raw_key = b64url_decode(m.group(1))
        if len(raw_key) not in (16, 24, 32):
            return None

        url_path = urlparse(request_url).path
        if not url_path.startswith("/"):
            url_path = "/" + url_path

        info        = f"bdw|v{payload['kid']}|{url_path}".encode()
        salt        = b64url_decode(payload["salt"])
        iv          = b64url_decode(payload["iv"])
        ct          = b64url_decode(payload["ct"])
        derived_key = HKDF(algorithm=hashes.SHA256(), length=32, salt=salt, info=info).derive(raw_key)
        compressed  = AESGCM(derived_key).decrypt(iv, ct, info)
        return json.loads(gzip.decompress(compressed))
    except Exception as e:
        log.debug("Decryption failed: %s", e)
        return None


def decode_jwt_payload(token: str) -> dict:
    return json.loads(b64url_decode(token.split(".")[1]))


# ── API helpers ───────────────────────────────────────────────────────────────

def get_session() -> cffi_requests.Session:
    return cffi_requests.Session(impersonate="chrome124")


def get_token(session: cffi_requests.Session) -> tuple[str, str]:
    resp = session.post(f"{DBD_BASE}/api/refresh", headers=BROWSER_HEADERS)
    resp.raise_for_status()
    data    = resp.json()
    token   = data.get("idToken") or data.get("accessToken")
    payload = decode_jwt_payload(token)
    enc_key = payload.get("encKey", "")
    log.info("Token refreshed | encKey prefix: %s", enc_key[:6])
    return token, enc_key


def api_get(session, url: str, token: str, enc_key: str) -> dict | None:
    headers = {**BROWSER_HEADERS, "Authorization": f"Bearer {token}"}
    try:
        resp = session.get(url, headers=headers)
        if resp.status_code != 200:
            return None
        body = resp.json()
        if isinstance(body, dict) and "ct" in body:
            return decrypt_response(enc_key, body, url)
        return body
    except Exception as e:
        log.debug("Request error: %s", e)
        return None


# ── Company data ──────────────────────────────────────────────────────────────

def load_companies(supabase) -> list[dict]:
    response = supabase.table("agencies").select("juristic_id, name_th").execute()
    companies = []
    for row in response.data:
        juristic_id = row.get("juristic_id")
        if juristic_id:
            companies.append({
                "name_th":    row.get("name_th", "").strip(),
                "company_id": juristic_id.strip(),
            })
    log.info("Loaded %d companies from Supabase", len(companies))
    return companies


def parse_ids(company_id: str) -> tuple[str, str]:
    if len(company_id) == 14:
        return company_id[0], company_id[1:]
    if len(company_id) == 13:
        return "5", company_id
    return "5", "0" + company_id


def fetch_company(session, company: dict, token: str, enc_key: str) -> dict:
    type_id, reg = parse_ids(company["company_id"])
    base       = f"{DBD_BASE}/api/v1/company-profiles"
    thai_year  = datetime.now().year + 543

    endpoints = {
        "info":            f"{base}/info/{type_id}/{reg}",
        "committees":      f"{base}/committees/{type_id}/{reg}",
        "committee_signs": f"{base}/committee-signs/{type_id}/{reg}",
        "mergers":         f"{base}/mergers/{type_id}/{reg}",
        "financials":      f"{DBD_BASE}/api/v1/fin/balancesheet/year/{type_id}/{reg}?fiscalYear={thai_year}",
        "financials_prev": f"{DBD_BASE}/api/v1/fin/balancesheet/year/{type_id}/{reg}?fiscalYear={thai_year - 1}",
    }

    results = {}
    for key, url in endpoints.items():
        data = api_get(session, url, token, enc_key)
        log.info("  %-20s -> %s", key, "OK" if data else "no data")
        results[key] = data

    return {
        "company_id": company["company_id"],
        "reg_number": reg,
        "type_id":    type_id,
        "name_th":    company["name_th"],
        **results,
        "scraped_at": datetime.utcnow().isoformat() + "Z",
    }


# ── Supabase update ───────────────────────────────────────────────────────────

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
        "committees":          record.get("committees"),
        "financials":          record.get("financials"),
        "financials_prev":     record.get("financials_prev"),
        "dbd_scraped_at":      record.get("scraped_at"),
    }


def upsert_record(supabase, record: dict) -> bool:
    juristic_id = record.get("reg_number")
    if not juristic_id:
        return False
    payload = build_update(record)
    result = (
        supabase.table("agencies")
        .update(payload)
        .eq("juristic_id", juristic_id)
        .execute()
    )
    return bool(result.data)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        sys.exit("ERROR: Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_KEY in .env.local")

    supabase  = create_client(SUPABASE_URL, SUPABASE_KEY)
    companies = load_companies(supabase)
    total     = len(companies)

    session    = get_session()
    token, enc_key = get_token(session)

    ok = fail = 0
    for i, company in enumerate(companies, 1):
        log.info("[%d/%d] %s", i, total, company["name_th"])
        try:
            record = fetch_company(session, company, token, enc_key)
            if upsert_record(supabase, record):
                log.info("  ✓ Supabase updated")
                ok += 1
            else:
                log.warning("  ✗ Supabase: no row matched juristic_id=%s", record.get("reg_number"))
                fail += 1
        except Exception as e:
            log.error("  ✗ Error for %s: %s", company["company_id"], e)
            fail += 1

        # Refresh token every 50 companies to avoid expiry
        if i % 50 == 0:
            token, enc_key = get_token(session)

    log.info("Done — %d updated, %d failed", ok, fail)

    # Post-run freshness report: warn if any agencies still have no DBD data
    try:
        result = supabase.rpc("dbd_freshness_report").execute()
        if result.data:
            r = result.data[0]
            if r["dbd_missing"] > 0:
                log.warning(
                    "DBD coverage: %d/%d populated, %d missing dbd_scraped_at "
                    "(not matched in company-id.csv)",
                    r["dbd_populated"], r["total_agencies"], r["dbd_missing"],
                )
            if r["dbd_stale"] > 0:
                log.warning(
                    "%d agencies have dbd_scraped_at older than 40 days — "
                    "consider re-running the DBD scraper",
                    r["dbd_stale"],
                )
            log.info(
                "DBD freshness: %d/%d populated | last update: %s",
                r["dbd_populated"], r["total_agencies"], r["last_dbd_update"],
            )
    except Exception as e:
        log.warning("Could not fetch DBD freshness report: %s", e)

    # Exit non-zero so CI marks the run as failed if too many records failed
    if fail > max(5, total // 20):
        sys.exit(1)


if __name__ == "__main__":
    main()


