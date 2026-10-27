import Link from "next/link";
import { ChevronRight, ExternalLink } from "lucide-react";
import { WOMEN, COUNTRIES } from "@/data/countries";
import { HotlineCard, ShareRow } from "@/components/journey/Parts";

const title = "ผู้หญิงไปทำงานต่างประเทศ — เช็ก 4 สัญญาณก่อนโอน | Thai Migrant Watch";
const description = WOMEN.headline;

export const metadata = {
  title,
  description,
  alternates: { canonical: "/women" },
  openGraph: { title, description, type: "website" },
};

export default function WomenPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 md:px-6 pt-8 md:pt-14 pb-12 flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-title1 md:text-large font-bold text-label tracking-tight text-balance">{WOMEN.headline}</h1>
        <p className="text-body text-label-2">
          งานนวด สปา ร้านอาหาร และงานบริการ เป็นงานที่คนชวนไปทางแชตมากที่สุด — และเป็นงานที่คนกลับมาขอความช่วยเหลือมากที่สุด
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        {WOMEN.stats.map((s) => (
          <div key={s.value} className="card p-5 flex flex-col gap-1">
            <p className="text-large font-bold text-label tabular-nums leading-none">{s.value}</p>
            <p className="text-footnote text-label-2">{s.label}</p>
            <a
              href={s.source}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-1 text-footnote font-medium text-accent-ink"
            >
              ที่มา <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        ))}
      </div>

      <section aria-labelledby="signals" className="inset-list">
        <h2 id="signals" className="px-5 pt-4 pb-1 text-headline font-bold text-label">
          4 สัญญาณ — ถ้าเจอข้อใดข้อหนึ่ง ยังไม่ต้องโอน
        </h2>
        {WOMEN.signals.map((t, i) => (
          <p key={t} className="flex min-h-12 items-start gap-3 px-5 py-3 text-body text-label">
            <span className="text-danger-ink font-bold tabular-nums" aria-hidden="true">{i + 1}</span>
            <span>{t}</span>
          </p>
        ))}
        <p className="px-5 py-4 text-callout font-medium text-danger-ink">{WOMEN.note}</p>
      </section>

      <HotlineCard title="โทรถามก่อนโอน" />

      <section aria-labelledby="where" className="flex flex-col gap-3">
        <h2 id="where" className="text-headline font-bold text-label">ดูเส้นทางถูกกฎหมายรายประเทศ</h2>
        <ul className="flex flex-wrap gap-2.5">
          {COUNTRIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/countries/${c.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-separator bg-surface px-4 text-callout font-medium text-label hover:border-accent hover:bg-accent-tint hover:text-accent-ink"
              >
                <span aria-hidden="true">{c.flag}</span>
                {c.short || c.name}
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ShareRow title="ผู้หญิงไปทำงานต่างประเทศ เช็ก 4 สัญญาณก่อนโอน — Thai Migrant Watch" />
      <p className="text-footnote text-label-2">เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน</p>
    </div>
  );
}
