"""
TOEA Employment Agency Scraper
================================
Scrapes data from https://toea.doe.go.th/LBANK-WEB/
Covers all 5 steps:
  1. Session initialization
  2. Scrape all list pages
  3. Scrape each company's detail page
  4. Upsert into Supabase (agencies table)
  5. Scheduled re-scraping (runs nightly)

Requires env vars:
  NEXT_PUBLIC_SUPABASE_URL        - your Supabase project URL
  SUPABASE_SERVICE_KEY            - service role key (Settings → API)
"""

import os
import re
import time
import logging
import schedule
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from datetime import datetime, timezone
from bs4 import BeautifulSoup
from supabase import create_client as create_supabase_client
from dotenv import load_dotenv

load_dotenv(".env.local", override=False)  # no-op in CI; env vars injected by GitHub Actions

# ── Config ─────────────────────────────────────────────────────────────────────
BASE_URL   = "https://toea.doe.go.th/LBANK-WEB/main.php"
ENCODING   = "tis-620"
DELAY_SEC  = 2.0
TIMEOUT    = 60  # seconds per request

SUPABASE_URL         = os.environ["NEXT_PUBLIC_SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s"
)
log = logging.getLogger(__name__)


# ── Step 1: Session Initialization ─────────────────────────────────────────────
def init_session() -> tuple[requests.Session, dict]:
    session = requests.Session()

    # Retry up to 3 times on connection errors with exponential backoff
    retry = Retry(
        total=3,
        backoff_factor=2,
        status_forcelist=[429, 500, 502, 503, 504],
        allowed_methods=["GET", "POST"],
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount("http://", adapter)
    session.mount("https://", adapter)

    session.headers.update({
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) "
                      "Chrome/124.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "th-TH,th;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Referer": BASE_URL,
    })

    log.info("Step 1 — Initialising session...")
    resp = session.get(BASE_URL, params={"menu": "viewer_agent", "gmenu": "2"}, timeout=TIMEOUT)
    resp.raise_for_status()

    html = resp.content.decode(ENCODING, errors="replace")
    soup = BeautifulSoup(html, "html.parser")

    hidden = {}
    for inp in soup.select("input[type=hidden]"):
        name = inp.get("name") or inp.get("id")
        if name and inp.get("value"):
            hidden[name] = inp["value"]

    log.info(f"  Session fields captured: {list(hidden.keys())}")
    return session, hidden


# ── Step 2: Scrape All List Pages ───────────────────────────────────────────────
def fetch_list_page(session: requests.Session, hidden: dict, page: int) -> list[dict]:
    payload = {
        **hidden,
        "agentnameth": "",
        "province_id": "",
        "sortby2":     "agentnameth",
        "sorttype2":   "asc",
        "page":        str(page),
    }
    resp = session.post(
        BASE_URL,
        params={"menu": "viewer_agent", "step": "1", "task": "search"},
        data=payload,
        timeout=TIMEOUT,
    )
    resp.raise_for_status()

    html = resp.content.decode(ENCODING, errors="replace")
    soup = BeautifulSoup(html, "html.parser")

    tables = soup.find_all("table")
    if len(tables) < 4:
        log.warning(f"  Page {page}: expected ≥4 tables, got {len(tables)}")
        return []

    data_table = tables[3]
    rows = data_table.find_all("tr")[1:]

    records = []
    for row in rows:
        cells = row.find_all("td")
        if len(cells) < 5:
            continue

        action_cell = cells[4]
        onclick_el  = action_cell.find(attrs={"onclick": True})
        cid = None
        if onclick_el:
            match = re.search(r"cid.*?'(\d+)'", onclick_el["onclick"])
            if match:
                cid = match.group(1)

        records.append({
            "number":     cells[0].get_text(strip=True),
            "name_th":    cells[1].get_text(strip=True),
            "province":   cells[2].get_text(strip=True),
            "license_no": cells[3].get_text(strip=True),
            "cid":        cid,
        })

    log.info(f"  Page {page}: {len(records)} records found")
    return records


def scrape_all_pages(session: requests.Session, hidden: dict) -> list[dict]:
    all_records = []
    page = 1
    while True:
        records = fetch_list_page(session, hidden, page)
        if not records:
            break
        all_records.extend(records)
        if len(records) < 30:
            break
        page += 1
        time.sleep(DELAY_SEC)

    log.info(f"Step 2 complete — {len(all_records)} total agencies across {page} pages")
    return all_records


# ── Step 3: Scrape Each Company Detail Page ─────────────────────────────────────
def fetch_detail(session: requests.Session, hidden: dict, cid: str) -> dict:
    payload = {**hidden, "cid": cid}
    resp = session.post(
        BASE_URL,
        params={"menu": "viewer_agent", "smenu": "view", "step": "1"},
        data=payload,
        timeout=TIMEOUT,
    )
    resp.raise_for_status()

    html = resp.content.decode(ENCODING, errors="replace")
    soup = BeautifulSoup(html, "html.parser")

    detail = {"cid": cid}
    field_map = {
        "เลขทะเบียนนิติบุคคล":       "juristic_id",
        "วันที่จดทะเบียน":            "registered_date",
        "สถานะบริษัท":               "company_status",
        "ชื่อบริษัทจัดหางาน (ไทย)":  "name_th",
        "ชื่อบริษัทจัดหางาน (Eng)":  "name_en",
        "ที่อยู่ (ไทย)":              "address_th",
        "ที่อยู่ (Eng)":             "address_en",
        "โทรศัพท์":                   "phone",
        "โทรสาร":                    "fax",
        "หน่วยงานรับเรื่อง":          "responsible_office",
        "เลขที่ใบอนุญาต":            "license_no",
        "วันที่ได้รับใบอนุญาต":       "license_date",
        "วันที่หมดอายุ":              "license_expiry",
        "ชื่อ - นามสกุล (ไทย)":      "director_name_th",
        "ชื่อ - นามสกุล (Eng)":      "director_name_en",
        "วันเกิด":                   "director_dob",
        "อายุ":                      "director_age",
        "สัญชาติ":                   "director_nationality",
        "ที่อยู่":                   "director_address",
        "โทรศัพท์ที่สามารถติดต่อได้": "director_mobile",
    }

    for td in soup.find_all("td"):
        text = td.get_text(separator="\n", strip=True)
        for label, key in field_map.items():
            if text.startswith(label):
                detail[key] = text.replace(label, "").strip()
                break

    return detail


def scrape_all_details(session: requests.Session, hidden: dict, records: list[dict]) -> list[dict]:
    enriched = []
    total = len(records)
    for i, rec in enumerate(records, 1):
        cid = rec.get("cid")
        if not cid:
            enriched.append(rec)
            continue
        log.info(f"  Detail {i}/{total} — cid={cid} ({rec['name_th'][:30]}...)")
        try:
            detail = fetch_detail(session, hidden, cid)
            enriched.append({**rec, **detail})
        except Exception as e:
            log.warning(f"  Failed cid={cid}: {e}")
            enriched.append(rec)
        time.sleep(DELAY_SEC)

    log.info(f"Step 3 complete — {len(enriched)} detail pages scraped")
    return enriched


# ── Step 4: Upsert into Supabase ────────────────────────────────────────────────
COLUMNS = [
    "cid", "number", "name_th", "name_en", "province", "license_no",
    "license_date", "license_expiry", "juristic_id", "registered_date",
    "company_status", "address_th", "address_en", "phone", "fax",
    "responsible_office", "director_name_th", "director_name_en",
    "director_dob", "director_age", "director_nationality",
    "director_address", "director_mobile", "scraped_at",
]

BATCH_SIZE = 200


def save_to_supabase(records: list[dict]):
    supabase = create_supabase_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    scraped_at = datetime.now(timezone.utc).isoformat()

    rows = []
    for rec in records:
        row = {col: rec.get(col) for col in COLUMNS}
        row["scraped_at"] = scraped_at
        if row.get("cid"):
            rows.append(row)

    # Upsert in batches to stay within Supabase request limits
    total = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        supabase.table("agencies").upsert(batch).execute()
        total += len(batch)
        log.info(f"  Upserted {total}/{len(rows)} rows...")

    log.info(f"Step 4 complete — {total} agencies saved to Supabase")


# ── Step 5: Full Run + Scheduled Re-scraping ─────────────────────────────────
def run_scraper():
    log.info("=" * 60)
    log.info(f"Scrape run started at {datetime.now().isoformat()}")
    log.info("=" * 60)

    try:
        session, hidden = init_session()

        records = scrape_all_pages(session, hidden)
        if not records:
            log.error("No records found — aborting")
            return

        enriched = scrape_all_details(session, hidden, records)

        save_to_supabase(enriched)

        log.info(f"Run complete. {len(enriched)} agencies saved.")

    except Exception as e:
        log.exception(f"Scraper failed: {e}")


def start_scheduler(run_hour: int = 2):
    log.info(f"Scheduler started — will re-scrape daily at {run_hour:02d}:00")
    run_scraper()

    schedule.every().day.at(f"{run_hour:02d}:00").do(run_scraper)

    while True:
        schedule.run_pending()
        time.sleep(60)


# ── Entry Point ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    run_scraper()
    # To run on schedule: start_scheduler(run_hour=2)
