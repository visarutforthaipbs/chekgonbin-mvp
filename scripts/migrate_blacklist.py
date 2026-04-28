"""
Migrate blacklist.csv → Supabase blacklist table
Run once: python scripts/migrate_blacklist.py
"""
import csv
import os
from supabase import create_client
from dotenv import load_dotenv

load_dotenv(".env.local", override=False)

supabase = create_client(
    os.environ["NEXT_PUBLIC_SUPABASE_URL"],
    os.environ["SUPABASE_SERVICE_KEY"],
)

rows = []
with open("data/blacklist.csv", encoding="utf-8-sig") as f:
    for row in csv.DictReader(f):
        contacts = []
        for col in ["เบอร์โทรศัพท์", "อีเมล", "LINE ID/QR Code", "Facebook Profile/Page", "เว็บไซต์ปลอม"]:
            val = row.get(col, "").strip()
            if val and val != "(ไม่ระบุ)":
                contacts.append(val)

        rows.append({
            "original_id":  row.get("ID", "").strip() or None,
            "name":         row.get("ชื่อบริษัท/นายหน้า", "").strip() or None,
            "contact_name": row.get("ชื่อติดต่อ/นามแฝง", "").strip() or None,
            "contacts":     contacts,
            "type":         row.get("ประเภท", "").strip() or None,
            "destination":  row.get("ประเทศปลายทาง (หลอก)", "").strip() or None,
            "scam_method":  row.get("รูปแบบการหลอก", "").strip() or None,
            "status":       "active",
            "source_url":   row.get("แหล่งที่มาของข้อมูล", "").strip() or None,
            "source":       "csv_import",
        })

supabase.table("blacklist").insert(rows).execute()
print(f"Migrated {len(rows)} blacklist entries to Supabase.")
