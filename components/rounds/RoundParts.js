import Link from "next/link";
import { BadgeCheck, CalendarClock, FileText, Phone, ShieldAlert, Users, Banknote, ChevronRight } from "lucide-react";
import { COUNTRIES, COST_LABEL, thaiDate, positionsLabel, headline } from "@/data/rounds";

const TONE = {
  safe: "bg-safe-tint text-safe-ink",
  caution: "bg-caution-tint text-caution-ink",
  danger: "bg-danger-tint text-danger-ink",
};

export function sexText(r) {
  return r.sex === "male" ? "เฉพาะผู้ชาย" : "ใบอนุญาตไม่ได้ระบุเพศ";
}

export function ageText(r) {
  if (r.ageMin != null && r.ageMax != null) return `${r.ageMin}–${r.ageMax} ปี`;
  if (r.ageMin != null) return `ไม่ต่ำกว่า ${r.ageMin} ปี (ไม่ได้ระบุอายุสูงสุด)`;
  if (r.ageMax != null) return `ไม่เกิน ${r.ageMax} ปี`;
  return "ใบอนุญาตไม่ได้ระบุเกณฑ์อายุ";
}

export function WindowLine({ r, className = "" }) {
  return (
    <p className={`flex items-start gap-2 text-footnote text-label-2 ${className}`}>
      <CalendarClock size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
      <span>
        ใบอนุญาตให้รับสมัครได้ถึง <span className="font-bold text-label">{thaiDate(r.windowEnd)}</span> อาจปิดก่อนหากเต็ม
      </span>
    </p>
  );
}

export function CostList({ r, showQuote = false }) {
  return (
    <ul className="flex flex-col gap-2">
      {r.costs.map((c) => {
        const label = COST_LABEL[c.who];
        return (
          <li key={c.item} className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="text-callout font-medium text-label min-w-[7.5rem]">{c.item}</span>
              <span className={`inline-flex rounded-md px-2 py-0.5 text-footnote font-bold ${TONE[label.tone]}`}>{label.text}</span>
            </div>
            {showQuote && (
              <p className="text-footnote text-label-2 pl-3 border-l-2 border-separator-strong">
                “{c.quote}” <span className="text-label-3">({c.ref})</span>
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Compact card used in the list. */
export function RoundCard({ r, verdict }) {
  const c = COUNTRIES[r.country];
  const pay = r.pay[0];
  return (
    <article className="card overflow-hidden" aria-labelledby={`round-${r.slug}`}>
      <div className="p-4 md:p-5 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-0.5 min-w-0">
            <p className="text-footnote font-bold text-label-2">
              <span aria-hidden="true">{c.flag}</span> {c.name} · ใบอนุญาต จต.2 {r.permit}
            </p>
            <h2 id={`round-${r.slug}`} className="text-headline font-bold text-label">
              {headline(r)}
            </h2>
            {r.positions.length > 2 && <p className="text-footnote text-label-2">{positionsLabel(r)}</p>}
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-lg bg-fill px-2.5 py-1 text-callout font-bold text-label tabular-nums">
            <Users size={16} aria-hidden="true" />
            {r.total.toLocaleString("th-TH")} คน
          </span>
        </div>

        {verdict && verdict.status !== "fit" && (
          <p
            className={`rounded-lg px-3 py-2 text-footnote font-bold ${
              verdict.status === "no" ? "bg-danger-tint text-danger-ink" : "bg-caution-tint text-caution-ink"
            }`}
          >
            {verdict.status === "no" ? "ไม่ตรงเงื่อนไข: " : "ต้องถามบริษัทก่อน: "}
            {verdict.reasons.join(" · ")}
          </p>
        )}
        {verdict && verdict.status === "fit" && (
          <p className="rounded-lg px-3 py-2 text-footnote font-bold bg-safe-tint text-safe-ink">ตรงเงื่อนไขที่ใบอนุญาตระบุ</p>
        )}

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-callout">
          <div className="flex gap-2">
            <dt className="text-label-2 shrink-0">เพศ</dt>
            <dd className="text-label font-medium">{sexText(r)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-label-2 shrink-0">อายุ</dt>
            <dd className="text-label font-medium">{ageText(r)}</dd>
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <dt className="text-label-2 shrink-0 inline-flex items-center gap-1">
              <Banknote size={16} aria-hidden="true" />
              ค่าจ้าง
            </dt>
            <dd className="text-label font-medium">
              {pay.main} <span className="text-label-2 font-normal">({pay.baht})</span>
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-1.5">
          <h3 className="text-footnote font-bold text-label-2">ใครจ่ายอะไร (ตามใบอนุญาต)</h3>
          <CostList r={r} />
        </div>

        <p className="text-footnote text-label-2">
          บริษัทจัดหางาน: <span className="text-label font-medium">{r.agency.name}</span> · {r.agency.license}
        </p>

        <WindowLine r={r} />
      </div>

      <Link
        href={`/rounds/${r.slug}`}
        className="w-full min-h-11 px-4 md:px-5 flex items-center justify-between border-t border-separator text-callout font-bold text-accent-ink hover:bg-fill transition-colors"
      >
        ดูรายละเอียด เบอร์บริษัท และใบอนุญาต
        <ChevronRight size={18} aria-hidden="true" />
      </Link>
    </article>
  );
}

export function FeeBanNotice({ text }) {
  return (
    <div className="rounded-2xl bg-danger-tint text-danger-ink p-4 flex gap-3">
      <ShieldAlert size={22} className="shrink-0 mt-0.5" aria-hidden="true" />
      <div className="flex flex-col gap-1">
        <p className="text-callout font-bold">ใบอนุญาตเขียนไว้ว่า “{text}”</p>
        <p className="text-footnote">
          ถ้ามีคนเรียกค่าสมัครหรือค่าบริการ อย่าเพิ่งโอน โทรเช็กก่อนที่สายด่วน{" "}
          <a href="tel:1506" className="font-bold underline underline-offset-2">1506 กด 2</a>
        </p>
      </div>
    </div>
  );
}

export function SourceLink({ r }) {
  return (
    <a
      href={r.source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-gray justify-start"
    >
      <FileText size={18} aria-hidden="true" />
      เปิดใบอนุญาตตัวจริง (กรมการจัดหางาน, หน้า {r.source.page})
    </a>
  );
}

export function AgencyBlock({ r }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-callout text-label">
        <span className="font-bold">{r.agency.name}</span> จำกัด
      </p>
      <p className="inline-flex items-center gap-1.5 text-footnote text-label-2">
        <BadgeCheck size={16} className="text-safe-ink" aria-hidden="true" />
        ใบอนุญาตจัดหางาน <span className="font-medium text-label tabular-nums">{r.agency.license}</span>
      </p>
      {r.agency.phones.length > 0 ? (
        <div className="flex flex-col gap-1.5">
          <p className="text-footnote text-label-2">เบอร์ที่พิมพ์อยู่ในใบอนุญาตฉบับนี้</p>
          <div className="flex flex-wrap gap-2">
            {r.agency.phones.map((p) => (
              <a key={p} href={`tel:${p.replace(/\D/g, "")}`} className="btn bg-safe-tint text-safe-ink tabular-nums">
                <Phone size={18} aria-hidden="true" />
                {p}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-footnote text-label-2">ใบอนุญาตฉบับนี้ไม่ได้พิมพ์เบอร์ของบริษัท ดูเบอร์ทางการได้ในรายชื่อบริษัทด้านล่าง</p>
      )}
      <Link href={`/agencies?q=${encodeURIComponent(r.agency.search)}`} className="btn btn-tinted justify-start">
        <BadgeCheck size={18} aria-hidden="true" />
        เช็กบริษัทนี้ในรายชื่อกรมการจัดหางาน
      </Link>
    </div>
  );
}
