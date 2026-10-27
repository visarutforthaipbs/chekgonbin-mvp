import Link from "next/link";
import Flag from "@/components/brand/Flag";
import { notFound } from "next/navigation";
import { ChevronLeft, Users, Banknote, Briefcase } from "lucide-react";
import { ROUNDS, COUNTRIES, getRound, thaiDate, headline, todayBangkok } from "@/data/rounds";
import { CostList, WindowLine, FeeBanNotice, SourceLink, AgencyBlock, sexText, ageText } from "@/components/rounds/RoundParts";

// Re-render daily so permits whose window has ended drop off without a deploy.
export const revalidate = 86400;

export function generateStaticParams() {
  return ROUNDS.map((r) => ({ permit: r.slug }));
}

export async function generateMetadata({ params }) {
  const { permit } = await params;
  const r = getRound(permit);
  if (!r) return {};
  const c = COUNTRIES[r.country];
  const title = `${c.name} ${headline(r)} ${r.total.toLocaleString("th-TH")} อัตรา (จต.2 ${r.permit}) | เช็คก่อนบิน`;
  const description = `${sexText(r)} · อายุ: ${ageText(r)} · ${r.pay[0].main} · บริษัท ${r.agency.name} (${r.agency.license}) · ใบอนุญาตให้รับสมัครได้ถึง ${thaiDate(r.windowEnd)} อาจปิดก่อนหากเต็ม`;
  return {
    title,
    description,
    alternates: { canonical: `/rounds/${r.slug}` },
    openGraph: { title, description, url: `https://checkgonbin.in.th/rounds/${r.slug}`, type: "article", images: ["/thumnail.png"] },
  };
}

function Section({ title, icon: Icon, children }) {
  return (
    <section className="card p-4 md:p-5 flex flex-col gap-3">
      <h2 className="inline-flex items-center gap-2 text-headline font-bold text-label">
        {Icon && <Icon size={20} aria-hidden="true" />}
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function RoundPage({ params }) {
  const { permit } = await params;
  const r = getRound(permit);
  if (!r) notFound();
  const c = COUNTRIES[r.country];
  const ended = r.windowEnd < todayBangkok();

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl px-4 md:px-6 pt-6 md:pt-12 pb-12 md:pb-20 flex flex-col gap-4 md:gap-5">
        <Link href="/rounds" className="btn btn-plain self-start -ml-2">
          <ChevronLeft size={18} aria-hidden="true" />
          งานมีใบอนุญาตทั้งหมด
        </Link>

        <header className="flex flex-col gap-2">
          <p className="text-footnote font-bold text-label-2">
            <Flag code={r.country} size={14} className="align-[-2px] mr-1" /> {c.name} · หนังสืออนุญาตให้รับสมัครคนหางาน จต.2 {r.permit}
          </p>
          <h1 className="text-title1 md:text-large font-bold text-label tracking-tight">
            {headline(r)} {r.total.toLocaleString("th-TH")} อัตรา
          </h1>
          <p className="text-body text-label-2">
            นายจ้าง {r.employer} ({r.employerPlace}){r.industry ? ` · ${r.industry}` : ""}
          </p>
          {ended ? (
            <p className="rounded-lg bg-danger-tint text-danger-ink px-3 py-2 text-callout font-bold">
              ช่วงที่ใบอนุญาตให้รับสมัครสิ้นสุดแล้วเมื่อ {thaiDate(r.windowEnd)}
            </p>
          ) : (
            <WindowLine r={r} className="text-callout" />
          )}
        </header>

        <FeeBanNotice text={r.feeBan} />

        <Section title="ตำแหน่งและจำนวน" icon={Users}>
          <ul className="inset-list">
            {r.positions.map((p) => (
              <li key={p.title} className="flex items-baseline justify-between gap-4 px-4 py-3">
                <span className="text-callout text-label">{p.title}</span>
                <span className="text-callout font-bold text-label tabular-nums">{p.count.toLocaleString("th-TH")} คน</span>
              </li>
            ))}
          </ul>
          <dl className="flex flex-col gap-1.5 text-callout">
            <div className="flex gap-2">
              <dt className="text-label-2 shrink-0 w-12">เพศ</dt>
              <dd className="text-label font-medium">
                {sexText(r)}
                {r.sexQuote && <span className="block text-footnote text-label-2 font-normal">ใบเขียนว่า “{r.sexQuote}”</span>}
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-label-2 shrink-0 w-12">อายุ</dt>
              <dd className="text-label font-medium">{ageText(r)}</dd>
            </div>
          </dl>
        </Section>

        <Section title="ค่าจ้าง" icon={Banknote}>
          <ul className="flex flex-col gap-3">
            {r.pay.map((p) => (
              <li key={p.label} className="flex flex-col gap-0.5">
                <span className="text-footnote font-bold text-label-2">{p.label}</span>
                <span className="text-callout font-bold text-label">{p.main}</span>
                <span className="text-footnote text-label-2">{p.baht}</span>
                {p.note && <span className="text-footnote text-label-2">{p.note}</span>}
              </li>
            ))}
          </ul>
          {r.payNote && <p className="text-footnote text-caution-ink bg-caution-tint rounded-lg px-3 py-2">{r.payNote}</p>}
        </Section>

        <Section title="ใครจ่ายอะไร">
          <p className="text-footnote text-label-2">ทุกรายการคัดจากใบอนุญาตตรงตัว รายการที่ใบไม่ได้เขียนไว้ ให้ถามบริษัทก่อนสมัคร</p>
          <CostList r={r} showQuote />
        </Section>

        <Section title="เงื่อนไขอื่นในใบอนุญาต" icon={Briefcase}>
          <ul className="flex flex-col gap-1.5 text-callout text-label">
            {r.terms.map((t) => (
              <li key={t}>• {t}</li>
            ))}
          </ul>
        </Section>

        <Section title="บริษัทจัดหางานที่ได้รับอนุญาต">
          <AgencyBlock r={r} />
          <p className="text-footnote text-label-2">
            ก่อนโอนเงินหรือส่งเอกสาร ให้เทียบชื่อบริษัทและเลขที่ใบอนุญาตกับใบอนุญาตตัวจริง ถ้ามีคนอ้างว่าเป็นตัวแทนแต่ชื่อไม่ตรง อย่าเพิ่งโอน
          </p>
        </Section>

        <section className="flex flex-col gap-2">
          <SourceLink r={r} />
          <p className="text-caption text-label-3 px-1">
            ที่มา: หนังสืออนุญาต จต.2 {r.permit} ลงวันที่ {thaiDate(r.issued)} · {r.verified}
          </p>
        </section>
      </div>
    </div>
  );
}
