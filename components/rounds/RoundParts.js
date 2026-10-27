import Link from "next/link";
import Flag from "@/components/brand/Flag";
import { BadgeCheck, CalendarClock, FileText, Phone, ShieldAlert, Users, Banknote, ChevronRight } from "lucide-react";
import { COUNTRIES, COST_LABEL, thaiDate, positionsLabel, headline } from "@/data/rounds";

const TONE = {
  safe: "bg-safe-tint text-safe-ink",
  caution: "bg-caution-tint text-caution-ink",
  danger: "bg-danger-tint text-danger-ink",
};

export function sexText(r) {
  if (r.sex === "male") return "เฉพาะผู้ชาย";
  if (r.sex === "female") return "เฉพาะผู้หญิง";
  if (r.sex === "any") return "รับทั้งชายและหญิง";
  return "ใบอนุญาตไม่ได้ระบุเพศ";
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
        ใบอนุญาตให้รับสมัครได้ถึง <span className="font-bold text-label">{thaiDate(r.windowEnd)}</span>{" "}
        <span className="whitespace-nowrap">อาจปิดก่อนหากเต็ม</span>
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
            {showQuote && c.quote && (
              <p className="text-footnote text-label-2 pl-3 border-l-2 border-separator-strong">
                “{c.quote}” <span className="text-label-3">({c.ref})</span>
              </p>
            )}
            {showQuote && !c.quote && (
              <p className="text-footnote text-label-2 pl-3 border-l-2 border-separator-strong">ใบอนุญาตไม่ได้กล่าวถึงเรื่องนี้ ให้ถามบริษัทก่อนสมัคร</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/** Short chip versions for the job-board card ("ไม่ระบุ" is explained in the page's "อ่านอย่างไร" box). */
export function sexShort(r) {
  if (r.sex === "male") return "ชายเท่านั้น";
  if (r.sex === "female") return "หญิงเท่านั้น";
  if (r.sex === "any") return "ชายและหญิง";
  return "ไม่ระบุเพศ";
}

export function ageShort(r) {
  if (r.ageMin != null && r.ageMax != null) return `อายุ ${r.ageMin}–${r.ageMax} ปี`;
  if (r.ageMin != null) return `อายุ ${r.ageMin} ปีขึ้นไป`;
  if (r.ageMax != null) return `อายุไม่เกิน ${r.ageMax} ปี`;
  return "ไม่ระบุอายุ";
}

/** "ประมาณ 29,226.48 บาท/เดือน (ตามที่ใบนี้แปลงไว้)" -> ["ประมาณ 29,226.48 บาท/เดือน", "(ตามที่ใบนี้แปลงไว้)"] */
function splitBaht(baht = "") {
  const i = baht.indexOf("บาท/เดือน");
  if (i < 0) return [baht, ""];
  const cut = i + "บาท/เดือน".length;
  return [baht.slice(0, cut).trim(), baht.slice(cut).trim()];
}

function Chip({ icon: Icon, children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-fill px-2.5 py-1 text-footnote font-medium text-label whitespace-nowrap">
      {Icon && <Icon size={14} className="text-label-2" aria-hidden="true" />}
      {children}
    </span>
  );
}

/** Job-board card used in the /rounds grid and on country pages. */
export function RoundCard({ r, verdict }) {
  const c = COUNTRIES[r.country];
  const pay = r.pay[0];
  const [bahtMain, bahtNote] = splitBaht(pay.baht);
  return (
    <article
      className="card h-full flex flex-col overflow-hidden transition-[border-color,box-shadow] hover:border-separator-strong hover:shadow-sm"
      aria-labelledby={`round-${r.slug}`}
    >
      <div className="p-4 md:p-5 flex flex-col gap-4 flex-1">
        <div className="flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-footnote font-bold text-label min-w-0">
            <Flag code={r.country} size={20} className="shrink-0 rounded-[3px]" />
            <span className="truncate">{c.name}</span>
          </p>
          <span className="shrink-0 text-caption font-medium text-label-3 tabular-nums">จต.2 {r.permit}</span>
        </div>

        <div className="flex flex-col gap-1">
          <h2 id={`round-${r.slug}`} className="text-headline font-bold text-label line-clamp-2">
            {headline(r)}
          </h2>
          {r.positions.length > 2 && <p className="text-footnote text-label-2 line-clamp-2">{positionsLabel(r)}</p>}
          <p className="text-footnote text-label-2 truncate">
            {r.agency.name} · <span className="tabular-nums">{r.agency.license}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <Chip icon={Users}>
            <span className="tabular-nums">{r.total.toLocaleString("th-TH")}</span> คน
          </Chip>
          <Chip>{sexShort(r)}</Chip>
          <Chip>{ageShort(r)}</Chip>
        </div>

        <div className="rounded-xl bg-surface-2 px-3.5 py-3 flex flex-col gap-0.5">
          <p className="inline-flex items-center gap-1.5 text-caption font-bold text-label-2">
            <Banknote size={14} aria-hidden="true" />
            ค่าจ้างตามใบอนุญาต
          </p>
          <p className="text-title3 font-bold text-label tabular-nums">{bahtMain}</p>
          <p className="text-footnote text-label-2 tabular-nums">
            {pay.main}
            {bahtNote && <span className="text-label-3"> {bahtNote}</span>}
          </p>
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

        <div className="flex flex-col gap-2">
          <h3 className="text-caption font-bold text-label-2">ใครจ่ายอะไร (ตามใบอนุญาต)</h3>
          <ul className="flex flex-col gap-1.5">
            {r.costs.map((cost) => {
              const label = COST_LABEL[cost.who];
              return (
                <li key={cost.item} className="flex items-start justify-between gap-3 text-footnote">
                  <span className="text-label">{cost.item}</span>
                  <span className={`shrink-0 max-w-[60%] text-right rounded-md px-2 py-0.5 font-bold ${TONE[label.tone]}`}>
                    {label.text}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        <WindowLine r={r} className="mt-auto pt-1" />
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
