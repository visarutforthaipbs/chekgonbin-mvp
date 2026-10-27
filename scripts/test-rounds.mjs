// Data + eligibility checks for /rounds. Run: npm run test:rounds
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("../data/rounds.js", import.meta.url), "utf8");
const { ROUNDS, checkEligibility, activeRounds, thaiDate, COUNTRIES, COST_LABEL } = await import("data:text/javascript;base64," + Buffer.from(src).toString("base64"));
import assert from "node:assert/strict";
const g=(s)=>ROUNDS.find(r=>r.slug===s);
const IL=g("149-2569"), RO=g("148-2569"), LT=g("145-2569");
const t=(r,i)=>checkEligibility(r,i);
assert.ok(ROUNDS.length>=8);
assert.equal(new Set(ROUNDS.map(r=>r.permit)).size,ROUNDS.length, "duplicate permit");
assert.equal(new Set(ROUNDS.map(r=>r.slug)).size,ROUNDS.length, "duplicate slug");
assert.deepEqual(ROUNDS.filter(r=>r.country==="RO"&&["148/2569","150/2569","151/2569","152/2569"].includes(r.permit)).reduce((s,r)=>s+r.total,0),1900);
assert.deepEqual(ROUNDS.filter(r=>r.country==="LT"&&["145/2569","146/2569","147/2569"].includes(r.permit)).reduce((s,r)=>s+r.total,0),180);
assert.equal(IL.total, IL.positions.reduce((s,p)=>s+p.count,0));
for (const r of ROUNDS) assert.equal(r.total, r.positions.reduce((s,p)=>s+p.count,0), r.permit);
assert.equal(t(IL,{sex:"female",age:""}).status,"no");
assert.equal(t(IL,{sex:"male",age:"24"}).status,"no");
assert.deepEqual(t(IL,{sex:"male",age:"50"}),{status:"ask",reasons:["ใบอนุญาตไม่ได้ระบุอายุสูงสุด"]});
assert.equal(t(IL,{sex:"male",age:""}).status,"fit");
assert.deepEqual(t(RO,{sex:"female",age:""}),{status:"ask",reasons:["ใบอนุญาตไม่ได้ระบุเพศ"]});
assert.deepEqual(t(RO,{sex:"male",age:"58"}),{status:"ask",reasons:["ใบอนุญาตไม่ได้ระบุเพศ","ใบอนุญาตไม่ได้ระบุเกณฑ์อายุ"]});
assert.equal(t(LT,{sex:"female",age:"30"}).status,"no");
assert.deepEqual(t(LT,{sex:"male",age:"58"}),{status:"ask",reasons:["ใบอนุญาตไม่ได้ระบุเกณฑ์อายุ"]});
for (const r of ROUNDS) {
  const next = new Date(r.windowEnd + "T00:00:00Z"); next.setUTCDate(next.getUTCDate()+1);
  assert.ok(activeRounds(r.windowEnd).includes(r), "active on last day: "+r.permit);
  assert.ok(!activeRounds(next.toISOString().slice(0,10)).includes(r), "gone the day after: "+r.permit);
  assert.ok(COUNTRIES[r.country], "country label: "+r.country);
  for (const c of r.costs) assert.ok(COST_LABEL[c.who], "cost who: "+r.permit+" "+c.who);
  assert.ok(r.windowStart<=r.windowEnd, "window order: "+r.permit);
}
assert.equal(activeRounds("2099-01-01").length,0);
assert.equal(thaiDate("2026-12-07"),"7 ธ.ค. 2569");
const txt=JSON.stringify(ROUNDS);
for (const bad of ["ฟรี","ยังเปิด","เรียกเก็บเงิน","ค่าใช้จ่ายก่อนเดินทาง"]) assert.ok(!txt.includes(bad), "banned word: "+bad);
console.log("all eligibility/data tests pass");
