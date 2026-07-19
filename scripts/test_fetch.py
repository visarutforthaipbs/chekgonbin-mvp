"""
Test script — fetches DBD data for the first N companies from company-id.csv
and saves results to test_output.json (no Supabase).

The DBD API:
  1. Returns an idToken (JWT) whose payload contains "encKey" — the AES-256 key.
  2. All data responses are AES-GCM encrypted: {"kid":N,"salt":"...","iv":"...","ct":"..."}
  3. Imperva WAF blocks non-browser TLS fingerprints → we use curl-cffi (Chrome impersonation).

Usage:
    pip install curl-cffi cryptography
    python test_fetch.py
"""

from __future__ import annotations

import base64
import csv
import gzip
import json
import logging
import re
from datetime import datetime
from pathlib import Path
from urllib.parse import urlparse

from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from curl_cffi import requests as cffi_requests

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

DBD_BASE = "https://datawarehouse.dbd.go.th"
CSV_PATH = Path(__file__).parent / "company-id.csv"
OUTPUT_PATH = Path(__file__).parent / "test_output.json"
TEST_LIMIT = None  # None = all companies

BROWSER_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Origin": DBD_BASE,
    "Referer": DBD_BASE + "/",
    "Accept": "application/json",
}


# ── Helpers ───────────────────────────────────────────────────────────────────

def b64url_decode(s: str) -> bytes:
    """Decode base64url without padding."""
    padding = 4 - len(s) % 4
    if padding != 4:
        s += "=" * padding
    return base64.urlsafe_b64decode(s)


def decrypt_response(enc_key_str: str, payload: dict, request_url: str) -> dict | None:
    """
    Decrypt an encrypted DBD API response using HKDF + AES-256-GCM + gzip.

    Algorithm (from /_nuxt/CptXCjuL.js):
      info = "bdw|v{kid}|{url_pathname}".encode("utf-8")  (also used as AAD)
      derived_key = HKDF(SHA-256, ikm=b64url_decode(encKey),
                         salt=b64url_decode(response.salt), info=info, length=32)
      compressed = AES-GCM-Decrypt(key=derived_key, nonce=b64url_decode(iv),
                                   ciphertext=b64url_decode(ct), aad=info)
      plaintext = gzip.decompress(compressed)
    """
    try:
        raw_key = b64url_decode(enc_key_str)
        if len(raw_key) not in (16, 24, 32):
            m = re.match(r'^\d+_(.*)', enc_key_str)
            if m:
                raw_key = b64url_decode(m.group(1))
        if len(raw_key) not in (16, 24, 32):
            log.debug("Bad key length %d from encKey %r", len(raw_key), enc_key_str[:20])
            return None

        # Extract URL pathname (e.g. "/api/v1/company-profiles/info/5/0105520008760")
        url_path = urlparse(request_url).path
        if not url_path.startswith("/"):
            url_path = "/" + url_path

        # Build HKDF info string (also serves as AES-GCM AAD)
        info = f"bdw|v{payload['kid']}|{url_path}".encode()

        salt = b64url_decode(payload["salt"])
        iv   = b64url_decode(payload["iv"])
        ct   = b64url_decode(payload["ct"])

        derived_key = HKDF(algorithm=hashes.SHA256(), length=32, salt=salt, info=info).derive(raw_key)
        compressed = AESGCM(derived_key).decrypt(iv, ct, info)
        return json.loads(gzip.decompress(compressed))
    except Exception as e:
        log.debug("Decryption failed: %s", e)
        return None


def decode_jwt_payload(token: str) -> dict:
    """Decode the middle (payload) segment of a JWT without verifying signature."""
    parts = token.split(".")
    return json.loads(b64url_decode(parts[1]))


# ── API calls ─────────────────────────────────────────────────────────────────

def get_session() -> cffi_requests.Session:
    return cffi_requests.Session(impersonate="chrome124")


def get_token(session: cffi_requests.Session) -> tuple[str, str]:
    """Returns (raw_token, enc_key)."""
    resp = session.post(f"{DBD_BASE}/api/refresh", headers=BROWSER_HEADERS)
    resp.raise_for_status()
    data = resp.json()
    token = data.get("idToken") or data.get("accessToken")
    payload = decode_jwt_payload(token)
    enc_key = payload.get("encKey", "")
    log.info("Token refreshed | encKey prefix: %s", enc_key[:6])
    return token, enc_key


def api_get(session: cffi_requests.Session, url: str, token: str, enc_key: str) -> dict | None:
    headers = {**BROWSER_HEADERS, "Authorization": f"Bearer {token}"}
    try:
        resp = session.get(url, headers=headers)
        if resp.status_code != 200:
            log.debug("  %s → HTTP %d", url.split("/")[-1], resp.status_code)
            return None
        body = resp.json()
        # If the response is encrypted, decrypt it
        if isinstance(body, dict) and "ct" in body:
            result = decrypt_response(enc_key, body, url)
            if result is None:
                log.debug("  decryption failed for %s", url.split("/")[-1])
            return result
        return body
    except Exception as e:
        log.debug("  request error: %s", e)
        return None


# ── Core logic ────────────────────────────────────────────────────────────────

def load_companies(csv_path: Path) -> list[dict]:
    companies = []
    with open(csv_path, encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            companies.append({
                "name_th":    row["name_th"].strip(),
                "company_id": row["company_Id"].strip(),
            })
    log.info("Loaded %d companies from CSV", len(companies))
    return companies


def parse_ids(company_id: str) -> tuple[str, str]:
    if len(company_id) == 14:
        return company_id[0], company_id[1:]
    else:
        return "5", "0" + company_id


def fetch_company(session, company: dict, token: str, enc_key: str) -> dict:
    type_id, reg = parse_ids(company["company_id"])
    base = f"{DBD_BASE}/api/v1/company-profiles"
    thai_year = datetime.now().year + 543

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
        "company_id":      company["company_id"],
        "reg_number":      reg,
        "type_id":         type_id,
        "name_th":         company["name_th"],
        **results,
        "scraped_at":      datetime.utcnow().isoformat(),
    }


def main():
    companies = load_companies(CSV_PATH)
    sample = companies if TEST_LIMIT is None else companies[:TEST_LIMIT]
    total = len(sample)

    session = get_session()
    token, enc_key = get_token(session)

    records = []
    for i, company in enumerate(sample):
        log.info("[%d/%d] %s (%s)", i + 1, total, company["name_th"], company["company_id"])
        record = fetch_company(session, company, token, enc_key)
        records.append(record)
        if (i + 1) % 50 == 0:
            token, enc_key = get_token(session)

    OUTPUT_PATH.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8")
    log.info("Done — saved %d records to %s", len(records), OUTPUT_PATH)
    log.info("=== Preview ===")
    for rec in records:
        info = rec.get("info") or {}
        filled = sum(1 for k in ["info", "committees", "committee_signs", "mergers", "financials", "financials_prev"] if rec.get(k))
        log.info("  %s | status: %s | %d/6 endpoints with data",
                 rec["name_th"], info.get("juristicStatus", "?"), filled)


if __name__ == "__main__":
    main()
