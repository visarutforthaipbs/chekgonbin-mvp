import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ExternalLink } from "lucide-react";
import { COUNTRIES, STAGES, getCountry, COUNTRIES_UPDATED } from "@/data/countries";
import { ROUNDS, activeRounds, thaiDate } from "@/data/rounds";
import { RoundCard } from "@/components/rounds/RoundParts";
import { HotlineCard, FundCard, ShareRow, EmptyTab } from "@/components/journey/Parts";

export const revalidate = 86400;

export function generateStaticParams() {
  return COUNTRIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = getCountry(slug);
  if (!c) return {};
  const title = `ไปทำงาน${c.name} — ทั้งเส้นทาง ก่อนไป อยู่ที่นั่น กลับบ้าน | Thai Migrant Watch`;
  const description = `${c.name}: ไปทางไหนได้บ้าง รอบที่เปิดจริง เช็กบริษัทก่อนจ่าย สิทธิจากกองทุนฯ และโทรใครเมื่อมีปัญหา — เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน`;
  return {
    title,
    description,
    alternates: { canonical: `/countries/${c.slug}` },
    openGraph: { title, description, type: "website" },
  };
}

function Source({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-11 items-center gap-1 text-footnote font-medium text-accent-ink"
    >
      ที่มา
      <ExternalLink size={14} aria-hidden="true" />
    </a>
  );
}

function Stat({ stat }) {
  return (
    <div className="card p-5 flex flex-col gap-1">
      <p className="text-large font-bold text-label tracking-tight tabular-nums leading-none">{stat.value}</p>
      <p className="text-callout text-label-2">{stat.label}</p>
      <Source href={stat.source} />
    </div>
  );
}

export default async function CountryPage({ params }) {
  const { slug } = await params;
  const c = getCountry(slug);
  if (!c) notFound();
  const rounds = activeRounds().filter((r) => r.country === c.code);
  const shareTitle = `ไปทำงาน${c.name} ดูทั้งเส้นทางก่อนโอนเงิน — Thai Migrant Watch`;

  return (
    <div className="w-full">
      {/* Title band */}
      <header className="mx-auto max-w-5xl px-4 md:px-6 pt-8 md:pt-14 flex flex-col gap-2">
        <p className="text-footnote text-label-2">
          <Link href="/" className="text-accent-ink">ประเทศ</Link> › {c.name}
        </p>
        <h1 className="text-title1 md:text-large font-bold text-label tracking-tight">
          <span aria-hidden="true" className="mr-2">{c.flag}</span>
          ไปทำงาน{c.name}
        </h1>
        <p className="text-body text-label-2">{c.jobs}</p>
      </header>

      {/* Journey tabs — compact: horizontal segmented control; regular: left rail in 3 phases */}
      <nav
        aria-label="ขั้นตอนการเดินทาง"
        className="glass sticky top-14 md:top-16 z-30 border-b border-[var(--glass-edge)] mt-5"
      >
        <ul className="mx-auto max-w-5xl flex gap-1 overflow-x-auto px-4 md:px-6 py-2 [scrollbar-width:none]">
          {STAGES.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                className="inline-flex min-h-11 items-center rounded-[10px] px-3.5 text-callout font-medium text-label-2 hover:bg-fill hover:text-label whitespace-nowrap"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <main className="mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-12 grid gap-12 md:grid-cols-[1fr_minmax(0,672px)_1fr]">
        <div className="hidden md:block" aria-hidden="true" />
        <div className="flex flex-col gap-12">
          {/* 1 ไปแล้วได้อะไร */}
          <section id="worth" aria-labelledby="worth-h" className="scroll-mt-32 flex flex-col gap-4">
            <h2 id="worth-h" className="text-title2 font-bold text-label tracking-tight">ไปแล้วได้อะไร</h2>
            {c.stat ? <Stat stat={c.stat} /> : null}
            {c.risk ? (
              <div className="rounded-[16px] bg-danger-tint p-5 flex flex-col gap-1">
                <p className="text-body font-medium text-danger-ink">{c.risk.text}</p>
                <Source href={c.risk.source} />
              </div>
            ) : null}
            {!c.stat && !c.risk ? <EmptyTab what="ค่าจ้างและความเสี่ยง" /> : null}
          </section>

          {/* 2 ไปทางไหนได้บ้าง */}
          <section id="routes" aria-labelledby="routes-h" className="scroll-mt-32 flex flex-col gap-4">
            <h2 id="routes-h" className="text-title2 font-bold text-label tracking-tight">ไปทางไหนได้บ้าง</h2>
            <ul className="inset-list">
              {c.routes.map((r) => (
                <li key={r} className="flex min-h-12 items-center px-5 text-body text-label">{r}</li>
              ))}
            </ul>
            {rounds.length > 0 ? (
              <>
                <h3 className="text-headline font-bold text-label">รอบที่เปิดรับตอนนี้ ({rounds.length})</h3>
                <ul className="flex flex-col gap-4">
                  {rounds.map((r) => (
                    <li key={r.slug}>
                      <RoundCard r={r} />
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-callout text-label-2">
                ตอนนี้ไม่มีใบอนุญาตรับสมัครไป{c.name}ในรายการของเรา —{" "}
                <Link href="/rounds" className="text-accent-ink underline underline-offset-2">ดูรอบทั้งหมด</Link>
              </p>
            )}
          </section>

          {/* 3 เช็กก่อนจ่าย */}
          <section id="pay" aria-labelledby="pay-h" className="scroll-mt-32 flex flex-col gap-4">
            <h2 id="pay-h" className="text-title2 font-bold text-label tracking-tight">เช็กก่อนจ่าย</h2>
            <blockquote className="rounded-[16px] bg-surface-2 p-5 text-body text-label">
              ใบอนุญาตจัดหางานทุกฉบับพิมพ์ไว้ว่า “ห้ามเรียกหรือรับค่าบริการ ค่าใช้จ่าย หรือผลประโยชน์ใด ๆ จากคนหางาน”
              <span className="block mt-1 text-footnote text-label-2">ค่าเดินทางที่คนงานออกเอง (เช่น ตั๋วเครื่องบิน) เป็นคนละเรื่องกัน — ดูในใบอนุญาตแต่ละฉบับ</span>
            </blockquote>
            <div className="inset-list">
              <p className="px-5 pt-4 pb-1 text-headline font-bold text-label">ถ้ามีคนเรียกค่าสมัครหรือค่าบริการ — เก็บหลักฐานก่อน</p>
              {["สลิปโอนเงิน / หลักฐานการจ่าย", "แชตทั้งหมด (LINE, Messenger) — แคปหน้าจอ", "ชื่อเพจ / ลิงก์ / เบอร์ที่ติดต่อมา", "สัญญาหรือเอกสารที่ให้เซ็น", "สำเนาบัตรประชาชน/พาสปอร์ตที่ส่งให้เขา"].map((t) => (
                <p key={t} className="flex min-h-12 items-center px-5 text-body text-label">{t}</p>
              ))}
            </div>
            <Link href="/#check" className="btn btn-prominent w-full">
              เช็กชื่อบริษัทกับทะเบียนกรมการจัดหางาน
              <ChevronRight size={20} aria-hidden="true" />
            </Link>
          </section>

          {/* 4 เตรียมตัว */}
          <section id="prepare" aria-labelledby="prepare-h" className="scroll-mt-32 flex flex-col gap-4">
            <h2 id="prepare-h" className="text-title2 font-bold text-label tracking-tight">เตรียมตัว</h2>
            <FundCard />
          </section>

          {/* 5 ถึงแล้วต้องรู้ */}
          <section id="arrived" aria-labelledby="arrived-h" className="scroll-mt-32 flex flex-col gap-4">
            <h2 id="arrived-h" className="text-title2 font-bold text-label tracking-tight">ถึงแล้วต้องรู้</h2>
            <EmptyTab what="การทำงานและสิทธิที่นั่น" />
          </section>

          {/* 6 มีปัญหาโทรใคร */}
          <section id="help" aria-labelledby="help-h" className="scroll-mt-32 flex flex-col gap-4">
            <h2 id="help-h" className="text-title2 font-bold text-label tracking-tight">มีปัญหาโทรใคร</h2>
            <HotlineCard />
            <p className="text-callout text-label-2">
              เบอร์สถานทูตและสำนักงานแรงงานไทยใน{c.name}: ยังไม่ได้ตรวจสอบจากเอกสารต้นทาง จึงยังไม่แสดง
            </p>
          </section>

          {/* 7 กลับบ้าน */}
          <section id="return" aria-labelledby="return-h" className="scroll-mt-32 flex flex-col gap-4">
            <h2 id="return-h" className="text-title2 font-bold text-label tracking-tight">กลับบ้าน</h2>
            <EmptyTab what="การกลับบ้านและการเบิกกองทุนฯ" />
          </section>

          <ShareRow title={shareTitle} />
          <p className="text-footnote text-label-2">
            เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน · ข้อมูล ณ {thaiDate(COUNTRIES_UPDATED)}
          </p>
        </div>
        <div className="hidden md:block" aria-hidden="true" />
      </main>
    </div>
  );
}
