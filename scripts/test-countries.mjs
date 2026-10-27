// Guards for data/countries.js — run with `npm run test:countries`.
// Every stat/risk must carry a source URL; banned wordings never ship; every tel: is dialable.
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("../data/countries.js", import.meta.url), "utf8");
const { COUNTRIES, THAI_HOTLINES, FUND, STAGES } = await import("data:text/javascript;base64," + Buffer.from(src).toString("base64"));

const BANNED = ["ค่าใช้จ่ายก่อนเดินทาง", "เรียกเก็บเงิน", "ถูกเรียกเก็บเงิน", "ปิด 7 ธ.ค.", "ยังเปิด", "ฟรี", "free meals"];
let fails = 0;
const fail = (m) => { fails++; console.error("✗", m); };

const text = JSON.stringify({ COUNTRIES, THAI_HOTLINES, FUND });
for (const w of BANNED) if (text.includes(w)) fail(`banned wording present: "${w}"`);

for (const c of COUNTRIES) {
  if (!c.slug || !c.code || !c.name || !c.flag || !c.jobs) fail(`${c.slug}: missing base field`);
  if (!Array.isArray(c.routes) || c.routes.length === 0) fail(`${c.slug}: no routes`);
  for (const k of ["stat", "risk"]) {
    if (c[k] && !/^https:\/\//.test(c[k].source || "")) fail(`${c.slug}.${k}: no https source`);
  }
}
const slugs = new Set(COUNTRIES.map((c) => c.slug));
if (slugs.size !== COUNTRIES.length) fail("duplicate slug");

for (const h of THAI_HOTLINES) {
  if (!/^(\+66\d{8,9}|1\d{3})$/.test(h.tel)) fail(`hotline ${h.label}: tel "${h.tel}" not dialable`);
}
if (!/^https:\/\//.test(FUND.source)) fail("FUND.source missing");
if (STAGES.length !== 7) fail(`STAGES must be 7, got ${STAGES.length}`);

if (fails) { console.error(`${fails} failure(s)`); process.exit(1); }
console.log(`✓ countries: ${COUNTRIES.length} countries, ${THAI_HOTLINES.length} hotlines, 7 stages, no banned wording`);
