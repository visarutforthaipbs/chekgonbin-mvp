import Link from "next/link";
import Image from "next/image";
import { Phone, ChevronRight } from "lucide-react";
import { THAI_HOTLINES, FUND } from "@/data/countries";

// Hotline card — shared by /emergency and every country page's "มีปัญหาโทรใคร" tab.
// Every number is a dialable tel: link ≥ 44 px. Numbers are cited in data/countries.js.
export function HotlineCard({ title = "โทรได้เลย (ในประเทศไทย)", extra = [] }) {
  const lines = [...extra, ...THAI_HOTLINES];
  return (
    <section aria-label={title} className="inset-list">
      <h2 className="px-5 pt-4 pb-1 text-headline font-bold text-label">{title}</h2>
      {lines.map((h) => (
        <a
          key={h.tel + h.label}
          href={`tel:${h.tel}`}
          className="flex min-h-16 items-center gap-4 px-5 py-2 hover:bg-fill"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent-tint text-accent-ink">
            <Phone size={20} aria-hidden="true" />
          </span>
          <span className="flex flex-1 flex-col">
            <span className="text-title3 font-bold text-label tabular-nums leading-tight">
              {h.number}
              {h.suffix ? <span className="text-callout font-medium text-label-2"> {h.suffix}</span> : null}
            </span>
            <span className="text-footnote text-label-2">
              {h.label}
              {h.note ? ` · ${h.note}` : ""}
            </span>
          </span>
          <ChevronRight size={20} className="text-label-3" aria-hidden="true" />
        </a>
      ))}
    </section>
  );
}

export function FundCard() {
  return (
    <section aria-labelledby="fund-title" className="rounded-[16px] bg-accent-tint p-5 flex flex-col gap-3">
      <h2 id="fund-title" className="text-headline font-bold text-accent-ink">
        สิทธิที่คุณจ่ายไว้แล้ว — กองทุนเพื่อช่วยเหลือคนหางานไปทำงานในต่างประเทศ
      </h2>
      <p className="text-callout text-label">{FUND.fee}</p>
      <dl className="flex flex-col gap-2">
        {FUND.benefits.map((b) => (
          <div key={b.what} className="flex items-baseline justify-between gap-3 text-callout">
            <dt className="text-label">{b.what}</dt>
            <dd className="font-bold text-label tabular-nums whitespace-nowrap">{b.amount}</dd>
          </div>
        ))}
      </dl>
      <a
        href={FUND.source}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-1 text-footnote font-medium text-accent-ink"
      >
        ที่มา: รายงานประจำปีกองทุนฯ 2567 (PDF)
        <ChevronRight size={16} aria-hidden="true" />
      </a>
    </section>
  );
}

export function ShareRow({ title }) {
  const text = encodeURIComponent(title);
  return (
    <div className="flex items-center justify-between gap-3 rounded-[16px] border border-separator bg-surface px-5 min-h-14">
      <span className="text-callout text-label">แชร์หน้านี้ให้คนที่บ้าน</span>
      <a
        href={`https://line.me/R/share?text=${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-tinted min-h-11"
      >
        LINE
        <ChevronRight size={18} aria-hidden="true" />
      </a>
    </div>
  );
}

export function EmptyTab({ what }) {
  return (
    <div className="rounded-[16px] border border-dashed border-separator-strong p-5 flex flex-col gap-2">
      <p className="text-body text-label">ยังไม่มีข้อมูล{what ? `เรื่อง${what}` : ""}สำหรับประเทศนี้</p>
      <p className="text-callout text-label-2">
        ถ้าคุณเคยไป หรือมีเอกสารจริง ส่งมาให้เราได้ที่{" "}
        <a href="mailto:thaimigrantwatchs@gmail.com" className="text-accent-ink underline underline-offset-2">
          thaimigrantwatchs@gmail.com
        </a>
      </p>
      <Link href="/report-scam" className="inline-flex min-h-11 items-center gap-1 text-callout font-medium text-accent-ink">
        หรือแจ้งเบาะแส
        <ChevronRight size={18} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function Brand({ className = "" }) {
  return (
    <Image
      src="/brand/thmw-lockup.svg"
      alt="Thai Migrant Watch"
      width={352}
      height={22}
      priority
      className={className}
    />
  );
}
