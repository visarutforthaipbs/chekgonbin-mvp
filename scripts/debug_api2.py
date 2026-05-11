"""Verify the correct HKDF + AES-GCM decryption using the URL pathname as info."""
import base64, json, zlib
from urllib.parse import urlparse
from curl_cffi import requests as cffi_requests
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

DBD_BASE = "https://datawarehouse.dbd.go.th"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Origin": DBD_BASE, "Referer": DBD_BASE+"/", "Accept": "application/json",
}

def b64url_decode(s):
    pad = 4 - len(s) % 4
    if pad != 4: s += "=" * pad
    return base64.urlsafe_b64decode(s)

def decode_jwt_payload(token):
    return json.loads(b64url_decode(token.split(".")[1]))

session = cffi_requests.Session(impersonate="chrome124")

# Get token
r = session.post(f"{DBD_BASE}/api/refresh", headers=HEADERS)
refresh_data = r.json()
token = refresh_data.get("idToken")
payload = decode_jwt_payload(token)
enc_key_str = payload.get("encKey", "")
enc_key_bytes = b64url_decode(enc_key_str)
print(f"encKey: {enc_key_str!r}")
print(f"Key bytes: {len(enc_key_bytes)}")

# Fetch encrypted data
test_url = f"{DBD_BASE}/api/v1/company-profiles/info/5/0105520008760"
r2 = session.get(test_url, headers={**HEADERS, "Authorization": f"Bearer {token}"})
print(f"\nData status: {r2.status_code}")
enc = r2.json()
print(f"Encrypted: kid={enc['kid']}, salt={enc['salt'][:12]}..., iv={enc['iv']!r}")

salt = b64url_decode(enc["salt"])
iv   = b64url_decode(enc["iv"])
ct   = b64url_decode(enc["ct"])
kid  = enc["kid"]

# The pathname from URL (as per JS function `o`)
pathname = urlparse(test_url).path  # "/api/v1/company-profiles/info/5/0105520008760"
print(f"Pathname: {pathname!r}")

# HKDF info: "bdw|v{kid}|{pathname}".encode()
info = f"bdw|v{kid}|{pathname}".encode()
print(f"HKDF info: {info!r}")

# HKDF key derivation (SHA-256, 256 bits)
hkdf = HKDF(algorithm=hashes.SHA256(), length=32, salt=salt, info=info)
derived_key = hkdf.derive(enc_key_bytes)
print(f"Derived key: {len(derived_key)}B hex={derived_key.hex()[:20]}...")

# AES-GCM decrypt with AAD = info
print("\nDecrypting...")
aesgcm = AESGCM(derived_key)
try:
    plaintext = aesgcm.decrypt(iv, ct, info)
    print(f"Decrypted OK! ({len(plaintext)} bytes)")
    # Try JSON parse directly
    try:
        result = json.loads(plaintext)
        print("JSON parse OK!")
        print(json.dumps(result, ensure_ascii=False, indent=2)[:600])
    except json.JSONDecodeError:
        # Try decompress first
        print("JSON parse failed, trying zlib inflate...")
        try:
            inflated = zlib.decompress(plaintext, wbits=-15)
            result = json.loads(inflated)
            print(f"zlib inflate + JSON OK! ({len(inflated)} bytes)")
            print(json.dumps(result, ensure_ascii=False, indent=2)[:600])
        except Exception as e2:
            print(f"inflate also failed: {e2}")
            print(f"Raw plaintext (first 100 bytes): {plaintext[:100]!r}")
except Exception as e:
    print(f"AES-GCM decrypt FAILED: {type(e).__name__}: {e}")
    # Try with no AAD
    try:
        plaintext_noaad = aesgcm.decrypt(iv, ct, None)
        print(f"Decrypted (no AAD) OK! ({len(plaintext_noaad)} bytes)")
    except Exception as e2:
        print(f"Also failed with no AAD: {type(e2).__name__}")
