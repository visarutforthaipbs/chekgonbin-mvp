#!/usr/bin/env python3
"""Planted-error regression for permit-verify.py. usage: mutate_verify.py <entry.json> <pdf> [out.json]
Baseline must PASS; every mutation must HOLD (exit 1). Mutated entries go to a temp dir."""
import os, copy, json, subprocess, sys, tempfile, pathlib, re
from concurrent.futures import ThreadPoolExecutor

ROOT = pathlib.Path.home() / "Documents/Personal-Project/chekgonbin-mvp-1"
entry_path, pdf = sys.argv[1], sys.argv[2]
out = sys.argv[3] if len(sys.argv) > 3 else None
base = json.load(open(entry_path))
muts = []  # (name, entry)

def add(name, fn):
    e = copy.deepcopy(base)
    try:
        fn(e)
    except Exception as ex:  # mutation not applicable to this entry shape
        return
    if e != base:
        muts.append((name, e))

THAI_CONS = "กขคงจฉชซญดตทนบปผพมยรลวสหอฮ"
def bump_letter(s):
    for i, ch in enumerate(s):
        if ch in THAI_CONS:
            alt = THAI_CONS[(THAI_CONS.index(ch) + 1) % len(THAI_CONS)]
            yield s[:i] + alt + s[i + 1:]

def digit_bump(s, k=0):
    idx = [i for i, c in enumerate(s) if c.isdigit()]
    if not idx: return s
    i = idx[min(k, len(idx) - 1)]
    return s[:i] + str((int(s[i]) + 1) % 10) + s[i + 1:]

# agency name: every single-letter substitution, plus drop of each char, plus dotted-fold abuse
name = base["agency"]["name"]
for n, alt in enumerate(bump_letter(name)):
    add(f"agency name letter#{n}", lambda e, alt=alt: e["agency"].__setitem__("name", alt))
for i in range(len(name)):
    add(f"agency name drop#{i}", lambda e, i=i: e["agency"].__setitem__("name", name[:i] + name[i + 1:]))
# fold-abuse: swap a จ for ฉ / จู for ฐ in the ENTRY name (registry must still reject)
if "จ" in name: add("agency name จ->ฉ", lambda e: e["agency"].__setitem__("name", name.replace("จ", "ฉ", 1)))
if "จู" in name: add("agency name จู->ฐ", lambda e: e["agency"].__setitem__("name", name.replace("จู", "ฐ", 1)))
if "ฉ" in name: add("agency name ฉ->จ", lambda e: e["agency"].__setitem__("name", name.replace("ฉ", "จ", 1)))
add("agency name other company", lambda e: e["agency"].__setitem__("name", "เวิลด์ แม็ป"))
# licence
lic = base["agency"]["license"]
for k in range(len(re.findall(r"\d", lic))):
    add(f"licence digit#{k}", lambda e, k=k: e["agency"].__setitem__("license", digit_bump(lic, k)))
add("licence year", lambda e: e["agency"].__setitem__("license", re.sub(r"/\d{4}", "/2500", lic)))
# phones
for j, ph in enumerate(base["agency"].get("phones", [])):
    for k in range(len(re.findall(r"\d", ph))):
        add(f"phone#{j} digit#{k}", lambda e, j=j, k=k, ph=ph: e["agency"]["phones"].__setitem__(j, digit_bump(ph, k)))
    if len(base["agency"]["phones"]) > 1:
        add(f"phone#{j} dropped", lambda e, j=j: e["agency"]["phones"].pop(j))
    else:
        add("phone dropped (only)", lambda e: e["agency"].__setitem__("phones", []))
add("phone invented", lambda e: e["agency"]["phones"].append("081-234-5678"))
# dates
for f in ("windowStart", "windowEnd", "issued"):
    for d in (1, 10):
        add(f"{f} +{d}d", lambda e, f=f, d=d: e.__setitem__(f, e[f][:-2] + f"{(int(e[f][-2:]) % 28) + d if (int(e[f][-2:]) % 28) + d < 29 else 1:02d}"))
    add(f"{f} month", lambda e, f=f: e.__setitem__(f, e[f][:5] + f"{(int(e[f][5:7]) % 12) + 1:02d}" + e[f][7:]))
# counts
add("total +1", lambda e: e.__setitem__("total", e["total"] + 1))
add("total 445", lambda e: e.__setitem__("total", 445))
add("total 9", lambda e: e.__setitem__("total", 9))
add("total x10", lambda e: e.__setitem__("total", e["total"] * 10))
for v in (200, 30, 250, 301, 3000):
    def _t(e, v=v):
        e["total"] = v; e["positions"][0]["count"] = v
    add(f"total+row {v}", _t)
add("row count +1 only", lambda e: e["positions"][0].__setitem__("count", e["positions"][0]["count"] + 1))
# pay
for i, p in enumerate(base["pay"]):
    for k in range(len(re.findall(r"\d", p["main"]))):
        add(f"pay main digit#{k}", lambda e, i=i, k=k: e["pay"][i].__setitem__("main", digit_bump(p["main"], k)))
    for k in range(len(re.findall(r"\d", p["baht"]))):
        add(f"pay baht digit#{k}", lambda e, i=i, k=k: e["pay"][i].__setitem__("baht", digit_bump(p["baht"], k)))
# sex / age
add("sex flipped", lambda e: e.__setitem__("sex", "female" if base["sex"] in (None, "male", "any") else "male"))
add("sex any", lambda e: e.__setitem__("sex", "any" if base["sex"] != "any" else "male"))
add("invented age min", lambda e: e.__setitem__("ageMin", (base.get("ageMin") or 20) + 3))
add("invented age max", lambda e: e.__setitem__("ageMax", (base.get("ageMax") or 40) + 3))
if base.get("sexQuote"): add("sexQuote changed", lambda e: e.__setitem__("sexQuote", base["sexQuote"].replace("ชาย", "หญิง", 1) if "ชาย" in base["sexQuote"] else base["sexQuote"] + "x"))
else: add("sexQuote invented", lambda e: e.__setitem__("sexQuote", "ผู้ชายเท่านั้น"))
# costs
WHO = ["employer", "worker", "deduct", "unclear"]
for i, c in enumerate(base["costs"]):
    other = next(w for w in WHO if w != c["who"])
    add(f"cost#{i} who {c['who']}->{other}", lambda e, i=i, other=other: e["costs"][i].__setitem__("who", other))
    if c.get("quote"):
        add(f"cost#{i} quote invented", lambda e, i=i: e["costs"][i].__setitem__("quote", c["quote"] + " และนายจ้างจ่ายเงินพิเศษให้"))
        add(f"cost#{i} quote paraphrase", lambda e, i=i: e["costs"][i].__setitem__("quote", c["quote"][3:]))
    else:
        add(f"cost#{i} quote invented from null", lambda e, i=i: e["costs"][i].__setitem__("quote", "นายจ้างจัดหาให้โดยไม่คิดมูลค่า"))
add("cost invented extra", lambda e: e["costs"].append({"item": "ค่าวีซ่า", "who": "employer", "quote": "นายจ้างออกค่าวีซ่าให้", "ref": "ข้อ 9"}))
# terms
for i, t in enumerate(base["terms"]):
    add(f"term#{i} digit", lambda e, i=i, t=t: e["terms"].__setitem__(i, digit_bump(t, 0)) if re.search(r"\d", t) else (_ for _ in ()).throw(ValueError))
    add(f"term#{i} paraphrase", lambda e, i=i, t=t: e["terms"].__setitem__(i, t[:-4] + "เท่านั้น"))
add("term invented", lambda e: e["terms"].append("นายจ้างให้โบนัสปีละ 2 เดือน"))
# position / employer / permit
add("position wrong", lambda e: e["positions"][0].__setitem__("title", "พนักงานขับรถ"))
add("position extra", lambda e: e["positions"].append({"title": "ช่างไฟฟ้า", "count": 5}))
add("employer wrong", lambda e: e.__setitem__("employer", "ACME CONSTRUCTION LTD."))
for k in range(len(re.findall(r"\d", base["employer"]))):
    add(f"employer digit#{k}", lambda e, k=k: e.__setitem__("employer", digit_bump(base["employer"], k)))
add("permit no", lambda e: e.__setitem__("permit", "159/2569"))
add("permit year", lambda e: e.__setitem__("permit", base["permit"].split("/")[0] + "/2570"))
# banned words (parsed from test-countries.mjs like the verifier)
banned = re.search(r"const BANNED = \[(.*?)\]", (ROOT / "scripts/test-countries.mjs").read_text(), re.S).group(1)
banned = re.findall(r'"([^"]+)"', banned)
for w in banned:
    add(f"banned '{w}' in term", lambda e, w=w: e["terms"].append(f"นายจ้างจัดให้ {w}"))
    if base["costs"]:
        add(f"banned '{w}' in cost quote", lambda e, w=w: e["costs"][0].__setitem__("quote", (base["costs"][0].get("quote") or "") + f" {w}"))

def run(item):
    name, e = item
    with tempfile.NamedTemporaryFile("w", suffix=".entry.json", delete=False) as f:
        json.dump(e, f, ensure_ascii=False); tmp = f.name
    r = subprocess.run([sys.executable, str(ROOT / "scripts" / os.environ.get("VERIFY", "permit-verify.py")), tmp, pdf, "--json"],
                       capture_output=True, text=True, timeout=400, cwd=ROOT)
    pathlib.Path(tmp).unlink(missing_ok=True)
    try: v = json.loads(r.stdout).get("verdict")
    except Exception: v = f"ERR{r.returncode}"
    return name, r.returncode, v

b = subprocess.run([sys.executable, str(ROOT / "scripts" / os.environ.get("VERIFY", "permit-verify.py")), entry_path, pdf, "--json"], capture_output=True, text=True, timeout=400, cwd=ROOT)
print("BASELINE", b.returncode, json.loads(b.stdout).get("verdict") if b.stdout else b.stderr[-200:])
first = run(muts[0])  # warm OCR cache serially
with ThreadPoolExecutor(4) as ex: res = [first] + list(ex.map(run, muts[1:]))
passed = [r for r in res if r[1] == 0]
errs = [r for r in res if r[1] not in (0, 1)]
print(f"MUTATIONS {len(res)}  HOLD {sum(1 for r in res if r[1]==1)}  PASS(bad!) {len(passed)}  ERR {len(errs)}")
for r in passed: print("  WRONGLY PASSED:", r)
for r in errs[:10]: print("  ERROR:", r)
if out: json.dump(res, open(out, "w"), ensure_ascii=False, indent=1)
