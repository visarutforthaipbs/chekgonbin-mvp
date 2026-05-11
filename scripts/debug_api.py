"""Extract more context around the decryptEnvelope call to find the 'I' parameter."""
import re
from curl_cffi import requests as cffi_requests

DBD_BASE = "https://datawarehouse.dbd.go.th"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Origin": DBD_BASE, "Referer": DBD_BASE+"/", "Accept": "text/html,*/*",
}

session = cffi_requests.Session(impersonate="chrome124")
r = session.get(DBD_BASE, headers=HEADERS)
js_urls = re.findall(r'href="(/_nuxt/[^"]+\.js)"', r.text)

for js_path in js_urls[:12]:
    url = DBD_BASE + js_path
    resp = session.get(url, headers={**HEADERS, "Accept": "*/*"})
    content = resp.text
    if 'decryptEnvelope' not in content:
        continue
    print(f"=== {js_path} ===")
    # Show 3000 chars of context around the fetchWrapper / decrypt call area
    idx = content.find('decryptEnvelope(O,I,D)')
    if idx < 0:
        idx = content.find('decryptEnvelope')
    if idx >= 0:
        start = max(0, idx - 2000)
        end = min(len(content), idx + 1000)
        print(content[start:end])
    break







