import Link from "next/link";
import { ChevronRight, LifeBuoy } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import Flag from "@/components/brand/Flag";


// Home hero — server component. One question, one emergency action, three checks.
// HIG: one prominent (filled accent) action per view = the country pills' selected
// state; the red button is red by ROLE (danger), not a second accent.
export default function HomeHero() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 md:px-6 pt-10 md:pt-20 flex flex-col gap-8 md:gap-10">
      <header className="flex flex-col gap-3 md:items-center md:text-center">
        <h1 className="text-display md:text-[64px] md:leading-[1.05] font-bold text-label tracking-[-0.022em] text-balance">
          อยากไปทำงาน
          <br />
          ประเทศไหน?
        </h1>
        <p className="text-body text-label-2 md:max-w-md text-balance">
          เลือกประเทศ แล้วดูทั้งเส้นทาง ตั้งแต่สมัครจนกลับบ้าน
        </p>
      </header>

      <nav aria-label="เลือกประเทศ">
        <ul className="flex flex-wrap gap-2.5 md:justify-center">
          {COUNTRIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/countries/${c.slug}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-full border border-separator bg-surface px-4 text-callout font-medium text-label transition-colors hover:border-accent hover:bg-accent-tint hover:text-accent-ink active:bg-accent active:text-on-accent"
              >
                <Flag code={c.code} size={16} />
                {c.short || c.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/agencies"
              className="inline-flex min-h-11 items-center gap-1 rounded-full px-3 text-callout font-medium text-accent-ink hover:bg-fill"
            >
              ประเทศอื่น ๆ
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </nav>

      {/* The emergency path — the only red fill on the site */}
      <Link
        href="/emergency"
        className="btn btn-lg w-full bg-danger-fill text-white hover:opacity-90 focus-visible:outline-danger-fill"
      >
        <LifeBuoy size={24} aria-hidden="true" />
        ฉันอยู่ต่างประเทศแล้ว มีปัญหา
      </Link>

      <section aria-labelledby="three-checks" className="inset-list">
        <h2 id="three-checks" className="px-5 pt-4 pb-1 text-headline font-bold text-label !border-0">
          ก่อนโอนเงินให้ใคร เช็ก 3 อย่างนี้ก่อน
        </h2>
        {[
          { n: "①", text: "บริษัทมีใบอนุญาตไหม", cta: "ค้นหาชื่อบริษัท", href: "#check" },
          { n: "②", text: "รอบนี้เปิดจริงไหม", cta: "ดูรอบเปิดรับ", href: "/rounds" },
          { n: "③", text: "โฆษณาแบบนี้ = หลอก", cta: "ดูสัญญาณเตือน", href: "#scam-signals" },
        ].map((row) => (
          <Link
            key={row.n}
            href={row.href}
            className="flex min-h-14 items-center gap-3 px-5 text-body text-label hover:bg-fill"
          >
            <span className="text-accent-ink font-bold tabular-nums" aria-hidden="true">
              {row.n}
            </span>
            <span className="flex-1">{row.text}</span>
            <span className="inline-flex items-center gap-0.5 text-callout font-medium text-accent-ink whitespace-nowrap">
              {row.cta}
              <ChevronRight size={18} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </section>

      <Link href="/women" className="flex min-h-14 items-center justify-between gap-3 rounded-[16px] bg-surface-2 px-5 text-body text-label hover:bg-fill">
        <span>ผู้หญิงไปทำงานต่างประเทศ — 4 สัญญาณก่อนโอน</span>
        <ChevronRight size={20} className="text-accent-ink shrink-0" aria-hidden="true" />
      </Link>

      <p className="text-footnote text-label-2 md:text-center">
        เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน · ข้อมูลจากใบอนุญาตและประกาศของกรมการจัดหางาน
      </p>
    </div>
  );
}
