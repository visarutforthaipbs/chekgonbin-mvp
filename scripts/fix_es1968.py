#!/usr/bin/env python3
"""One-off fix: fetch DBD data for เอส1968 (juristic_id=0145563001881) and update Supabase."""
import os, json, base64, gzip
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv

load_dotenv(Path(__file__).parent.parent / '.env.local')

from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
import curl_cffi.requests as req
from supabase import create_client

BASE = 'https://datawarehouse.dbd.go.th'
HDRS = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "th,en;q=0.9",
    "Origin": BASE,
    "Referer": BASE + "/",
}

def b64u(s):
    s += '=' * ((-len(s)) % 4)
    return base64.urlsafe_b64decode(s)

def jwt_payload(tok):
    return json.loads(b64u(tok.split('.')[1]))

def decrypt(enc_key_str, payload, url):
    raw_key = b64u(enc_key_str)
    info = f"bdw|v{payload['kid']}|{urlparse(url).path}".encode()
    salt = b64u(payload['salt']); iv = b64u(payload['iv']); ct = b64u(payload['ct'])
    key = HKDF(algorithm=hashes.SHA256(), length=32, salt=salt, info=info).derive(raw_key)
    return json.loads(gzip.decompress(AESGCM(key).decrypt(iv, ct, info)))

def api_get(s, path, tok, ek):
    url = f'{BASE}{path}'
    r = s.get(url, headers={**HDRS, 'Authorization': f'Bearer {tok}'})
    r.raise_for_status()
    return decrypt(ek, r.json(), url)

def safe_f(v):
    try: return float(v) if v not in (None, '', '-') else None
    except: return None

def safe_i(v):
    try: return int(float(v)) if v not in (None, '', '-') else None
    except: return None

SUPA = create_client(os.getenv('NEXT_PUBLIC_SUPABASE_URL'), os.getenv('SUPABASE_SERVICE_KEY'))
session = req.Session(impersonate='chrome124')

r = session.post(f'{BASE}/api/refresh', headers=HDRS)
r.raise_for_status()
d = r.json()
token = d.get('idToken') or d.get('accessToken')
enc_key = jwt_payload(token).get('encKey')
print(f'Token OK, encKey prefix={enc_key[:8]}...')

type_id, reg = '5', '0145563001881'
print(f'Fetching /info/{type_id}/{reg} ...')
info = api_get(session, f'/api/v1/company-profiles/info/{type_id}/{reg}', token, enc_key)
print(f'  jpName:  {info.get("jpName")}')
print(f'  jpNameE: {info.get("jpNameE")}')
print(f'  jpNo:    {info.get("jpNo")}')

from datetime import datetime
thai_year = datetime.now().year + 543
def try_fin(year):
    url = f'/api/v1/fin/balancesheet/year/{type_id}/{reg}?fiscalYear={year}'
    try:
        return api_get(session, url, token, enc_key)
    except Exception as e:
        print(f'  fin {year} failed: {e}')
        return None

# Try current year first, then walk back to find latest available
fin_cur = None
for y in range(thai_year, thai_year - 4, -1):
    fin_cur = try_fin(y)
    if fin_cur:
        print(f'  financials year {y}: OK')
        break
fin_prev = None
if fin_cur:
    fiscal_yr = info.get('fiscalYear') or info.get('fiscalyear')
    try:
        fin_prev = try_fin(int(fiscal_yr) - 1) if fiscal_yr else None
    except Exception:
        fin_prev = None

payload = {
    'cap_amt':              safe_i(info.get('capAmt')),
    'paid_amt':             safe_i(info.get('paidAmt')),
    'share_qty':            safe_i(info.get('shareQty')),
    'share_vol':            safe_i(info.get('shareVol')),
    'jp_stat_code':         info.get('jpStatCode'),
    'fiscal_year':          info.get('fiscalYear') or info.get('fiscalyear'),
    'total_asset':          safe_f(info.get('totalAsset')),
    'total_income':         safe_f(info.get('totalIncome')),
    'net_profit':           safe_f(info.get('netProfit')),
    'total_equity':         safe_f(info.get('totalEquity')),
    'current_ratio':        safe_f(info.get('currentRatio')),
    'debt_to_equity':       safe_f(info.get('debtToEquity')),
    'return_on_asset':      safe_f(info.get('returnOnAsset')),
    'return_on_equity':     safe_f(info.get('returnOnEquity')),
    'net_profit_margin':    safe_f(info.get('netProfitMargin')),
    'gross_profit_margin':  safe_f(info.get('grossProfitMargin')),
    'business_size_code':   info.get('businessSizeCode'),
    'financials':           fin_cur  or None,
    'financials_prev':      fin_prev or None,
}
payload = {k: v for k, v in payload.items() if v is not None}
print(f'Payload keys: {list(payload.keys())}')

result = SUPA.table('agencies').update(payload).eq('juristic_id', '0145563001881').execute()
print(f'Rows updated: {len(result.data)}')
if result.data:
    row = result.data[0]
    print('✓ SUCCESS: เอส1968 patched')
    print(f'  name_th:     {row.get("name_th")}')
    print(f'  total_asset: {row.get("total_asset")}')
    print(f'  net_profit:  {row.get("net_profit")}')
    print(f'  fiscal_year: {row.get("fiscal_year")}')
else:
    print('✗ STILL no match')
