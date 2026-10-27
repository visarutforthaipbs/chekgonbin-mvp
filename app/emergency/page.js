import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import { HotlineCard, FundCard, ShareRow } from "@/components/journey/Parts";

const title = "อยู่ต่างประเทศแล้ว มีปัญหา — โทรใคร | Thai Migrant Watch";
const description = "เบอร์ที่โทรได้ทันที สิทธิจากกองทุนเพื่อช่วยเหลือคนหางานฯ และหลักฐานที่ต้องเก็บ";

export const metadata = {
  title,
  description,
  alternates: { canonical: "/emergency" },
  openGraph: { title, description, type: "website" },
};

export default function EmergencyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 md:px-6 pt-8 md:pt-14 pb-12 flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-title1 md:text-large font-bold text-label tracking-tight">มีปัญหา โทรใคร</h1>
        <p className="text-body text-label-2">
          โทรก่อน ค่อยเล่า — ทุกเบอร์ด้านล่างกดโทรได้เลย ถ้าโทรจากต่างประเทศ ใส่ +66 แล้วตัด 0 ตัวแรก
        </p>
      </header>

      <HotlineCard title="โทรได้เลย" />

      <FundCard />

      <section aria-labelledby="by-country" className="flex flex-col gap-3">
        <h2 id="by-country" className="text-headline font-bold text-label">คุณอยู่ประเทศไหน</h2>
        <ul className="flex flex-wrap gap-2.5">
          {COUNTRIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/countries/${c.slug}#help`}
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

      <ShareRow title="อยู่ต่างประเทศแล้วมีปัญหา โทรเบอร์นี้ — Thai Migrant Watch" />
      <p className="text-footnote text-label-2">เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน</p>
    </div>
  );
}
