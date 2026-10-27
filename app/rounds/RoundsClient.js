"use client";

import { useMemo, useState } from "react";
import { activeRounds, checkEligibility, COUNTRIES, ROUNDS_UPDATED, thaiDate } from "@/data/rounds";
import { RoundCard } from "@/components/rounds/RoundParts";
import { trackEvent } from "@/utils/analytics";

const SEX_OPTIONS = [
  { value: "", label: "ไม่ระบุ" },
  { value: "male", label: "ชาย" },
  { value: "female", label: "หญิง" },
];

function Segmented({ label, options, value, onChange, name }) {
  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="text-footnote font-bold text-label-2 mb-1.5">{label}</legend>
      <div className="inline-flex flex-wrap gap-2" role="radiogroup">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <button
              key={o.value || "all"}
              type="button"
              role="radio"
              aria-checked={active}
              name={name}
              onClick={() => onChange(o.value)}
              className={`btn ${active ? "btn-prominent" : "btn-gray"}`}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function RoundsClient() {
  const [sex, setSex] = useState("");
  const [age, setAge] = useState("");
  const [country, setCountry] = useState("");
  const [sort, setSort] = useState("end");

  const rounds = useMemo(() => activeRounds(), []);
  const countryOptions = useMemo(() => {
    const codes = [...new Set(rounds.map((r) => r.country))];
    return [{ value: "", label: "ทุกประเทศ" }, ...codes.map((c) => ({ value: c, label: COUNTRIES[c].name }))];
  }, [rounds]);

  const filtering = sex !== "" || age !== "";
  const results = useMemo(() => {
    const list = rounds
      .filter((r) => !country || r.country === country)
      .map((r) => ({ r, verdict: filtering ? checkEligibility(r, { sex, age }) : null }));
    const order = { fit: 0, ask: 1, no: 2 };
    const by = {
      end: (a, b) => a.r.windowEnd.localeCompare(b.r.windowEnd) || b.r.total - a.r.total,
      places: (a, b) => b.r.total - a.r.total,
    }[sort];
    return [...list].sort((a, b) => (filtering ? order[a.verdict.status] - order[b.verdict.status] : 0) || by(a, b));
  }, [rounds, country, sex, age, filtering, sort]);

  const shown = results.filter((x) => !x.verdict || x.verdict.status !== "no");
  const ruledOut = results.filter((x) => x.verdict && x.verdict.status === "no");
  const places = shown.reduce((s, x) => s + x.r.total, 0);

  const onAge = (v) => {
    const clean = v.replace(/\D/g, "").slice(0, 2);
    setAge(clean);
  };

  const track = (field, value) => trackEvent("rounds_filter", { field, value });

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-6xl px-4 md:px-6 pt-8 md:pt-14 pb-12 md:pb-20 flex flex-col gap-5 md:gap-6">
        <header className="flex flex-col gap-2 max-w-3xl">
          <h1 className="text-title1 md:text-large font-bold text-label tracking-tight">งานต่างประเทศ<wbr />ที่มี<span className="whitespace-nowrap">ใบอนุญาต</span></h1>
          <p className="text-body text-label-2">
            งานต่างประเทศที่กรมการจัดหางานออกใบอนุญาตให้รับสมัคร อ่านจากใบอนุญาตตัวจริงทีละฉบับ · <span className="whitespace-nowrap">อัปเดต {thaiDate(ROUNDS_UPDATED)}</span>
          </p>
          <p className="text-footnote text-label-2">
            Thai Migrant Watch ไม่ใช่ช่องทางสมัครงาน และไม่รับเงินจากใคร สมัครผ่านบริษัทที่ระบุในใบอนุญาตเท่านั้น
          </p>
        </header>

        <section aria-labelledby="eligibility-heading" className="card p-4 md:p-5 flex flex-col gap-4 lg:flex-row lg:flex-wrap lg:items-end lg:gap-x-8">
          <div className="flex flex-col gap-1 lg:basis-full">
            <h2 id="eligibility-heading" className="text-headline font-bold text-label">ฉันสมัครได้ไหม</h2>
            <p className="text-footnote text-label-2">ใส่ข้อมูลเพื่อเทียบกับเงื่อนไขในใบอนุญาต ข้อมูลไม่ถูกส่งหรือเก็บไว้ที่ใด</p>
          </div>
          <Segmented
            label="เพศ"
            name="sex"
            options={SEX_OPTIONS}
            value={sex}
            onChange={(v) => {
              setSex(v);
              track("sex", v || "none");
            }}
          />
          <div className="flex flex-col gap-1.5">
            <label htmlFor="age" className="text-footnote font-bold text-label-2">
              อายุ (ปี)
            </label>
            <input
              id="age"
              inputMode="numeric"
              pattern="[0-9]*"
              value={age}
              onChange={(e) => onAge(e.target.value)}
              onBlur={() => age && track("age", age)}
              placeholder="เช่น 35"
              className="field bg-surface-2 max-w-[10rem] tabular-nums"
              autoComplete="off"
            />
          </div>
          {countryOptions.length > 2 && (
            <Segmented
              label="ประเทศ"
              name="country"
              options={countryOptions}
              value={country}
              onChange={(v) => {
                setCountry(v);
                track("country", v || "all");
              }}
            />
          )}
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <p className="text-callout font-bold text-label" aria-live="polite">
          {rounds.length === 0
            ? "ตอนนี้ไม่มีใบอนุญาตที่เราอ่านแล้วและยังอยู่ในช่วงรับสมัคร ใบใหม่จะขึ้นที่นี่หลังตรวจจากใบอนุญาตตัวจริง"
            : shown.length > 0
              ? `${shown.length} ใบอนุญาต · รวม ${places.toLocaleString("th-TH")} อัตรา${filtering ? " ที่ไม่ขัดกับเงื่อนไขของคุณ" : ""}`
              : "ไม่มีใบอนุญาตที่ตรงกับเงื่อนไขของคุณในตอนนี้"}
        </p>
          {shown.length > 1 && (
            <label className="inline-flex items-center gap-2 text-footnote text-label-2">
              เรียงตาม
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  track("sort", e.target.value);
                }}
                className="field bg-surface w-auto py-2 text-callout"
              >
                <option value="end">วันสุดท้ายของใบอนุญาตใกล้สุด</option>
                <option value="places">รับคนมากสุด</option>
              </select>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 items-stretch">
          {shown.map(({ r, verdict }) => (
            <RoundCard key={r.slug} r={r} verdict={verdict} />
          ))}
        </div>

        {ruledOut.length > 0 && (
          <details className="card overflow-hidden">
            <summary className="min-h-11 px-4 md:px-5 flex items-center text-callout font-bold text-label-2 cursor-pointer hover:bg-fill">
              ไม่ตรงเงื่อนไขในใบอนุญาต ({ruledOut.length} ฉบับ)
            </summary>
            <div className="p-3 md:p-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 bg-surface-2">
              {ruledOut.map(({ r, verdict }) => (
                <RoundCard key={r.slug} r={r} verdict={verdict} />
              ))}
            </div>
          </details>
        )}

        <section className="rounded-2xl bg-fill p-4 md:p-5 flex flex-col gap-2 text-footnote text-label-2 max-w-3xl">
          <h2 className="text-callout font-bold text-label">อ่านอย่างไร</h2>
          <p>• “ใบอนุญาตไม่ได้ระบุ” แปลว่าใบไม่ได้เขียนเรื่องนั้นไว้ ไม่ได้แปลว่ารับทุกคน ให้ถามบริษัทก่อนสมัคร</p>
          <p>• วันที่บนการ์ดคือช่วงที่บริษัทได้รับอนุญาตให้รับสมัคร รอบอาจเต็มและปิดก่อน</p>
          <p>• ค่าเงินบาทเป็นตัวเลขที่กรมฯ แปลงไว้ในแต่ละใบ อัตราจริงตอนรับเงินอาจต่างไป</p>
          <p>
            • สงสัยอะไร โทรสายด่วนกรมการจัดหางาน{" "}
            <a href="tel:1506" className="font-bold text-accent-ink underline underline-offset-2">1506 กด 2</a>
          </p>
        </section>
      </div>
    </div>
  );
}
