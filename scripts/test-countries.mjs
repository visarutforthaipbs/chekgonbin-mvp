// Guards for data/countries.js — run with `npm run test:countries`.
// Every stat/risk must carry a source URL; banned wordings never ship; every tel: is dialable.
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("../data/countries.js", import.meta.url), "utf8");
const { COUNTRIES, THAI_HOTLINES, FUND, STAGES, WOMEN, COSTS } = await import("data:text/javascript;base64," + Buffer.from(src).toString("base64"));

const EMOJI = /[\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
const BANNED = ["ค่าใช้จ่ายก่อนเดินทาง", "เรียกเก็บเงิน", "ถูกเรียกเก็บเงิน", "ปิด 7 ธ.ค.", "ยังเปิด", "ฟรี", "free meals"];
let fails = 0;
const fail = (m) => { fails++; console.error("✗", m); };

const text = JSON.stringify({ COUNTRIES, THAI_HOTLINES, FUND, WOMEN, COSTS });
for (const w of BANNED) if (text.includes(w)) fail(`banned wording present: "${w}"`);
if (EMOJI.test(text)) fail("emoji in data — use <Flag code> / lucide icons");

for (const c of COUNTRIES) {
  if (!c.slug || !/^[A-Z]{2}$/.test(c.code) || !c.name || !c.jobs) fail(`${c.slug}: missing base field`);
  if (!Array.isArray(c.routes) || c.routes.length === 0) fail(`${c.slug}: no routes`);
  for (const k of ["stat", "risk"]) {
    if (c[k] && !/^https:\/\//.test(c[k].source || "")) fail(`${c.slug}.${k}: no https source`);
  }
}
let abroad = 0;
for (const c of COUNTRIES) for (const h of c.abroad || []) {
  abroad++;
  if (!/^\+\d{8,15}$|^1\d{3,7}$/.test(h.tel)) fail(`${c.slug} abroad ${h.label}: tel "${h.tel}" not E.164`);
  if (!/^https:\/\//.test(h.source || "")) fail(`${c.slug} abroad ${h.label}: no source`);
}
for (const x of [...WOMEN.stats, ...COSTS]) if (!/^https?:\/\//.test(x.source || "")) fail(`uncited: ${x.label || x.route}`);
const slugs = new Set(COUNTRIES.map((c) => c.slug));
if (slugs.size !== COUNTRIES.length) fail("duplicate slug");

for (const h of THAI_HOTLINES) {
  if (!/^(\+66\d{8,9}|1\d{3})$/.test(h.tel)) fail(`hotline ${h.label}: tel "${h.tel}" not dialable`);
}
if (!/^https:\/\//.test(FUND.source)) fail("FUND.source missing");
if (STAGES.length !== 7) fail(`STAGES must be 7, got ${STAGES.length}`);

// LINE greeting (data/line-greeting.js): same wording rules + mandatory disclaimer.
const greet = readFileSync(new URL("../data/line-greeting.js", import.meta.url), "utf8");
for (const w of BANNED) if (greet.includes(w)) fail(`LINE greeting banned wording: "${w}"`);
if (EMOJI.test(greet)) fail("emoji in LINE greeting");
if (!greet.includes("เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน")) fail("LINE greeting missing disclaimer");

if (fails) { console.error(`${fails} failure(s)`); process.exit(1); }
console.log(`✓ countries: ${COUNTRIES.length} countries, ${THAI_HOTLINES.length} Thai hotlines, ${abroad} abroad numbers (all cited), 7 stages, no banned wording`);
