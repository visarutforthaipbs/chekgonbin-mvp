import Link from "next/link";
import Logo from "@/components/brand/Logo";
import { Phone } from "lucide-react";

// Server component — no client JS needed.
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-separator bg-surface no-print">
      <div className="mx-auto max-w-5xl px-4 md:px-6 py-8 md:py-10 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex flex-col gap-1">
            <Logo kind="wordmark" animate="inview" className="h-14 w-auto" />
            <p className="text-callout font-medium text-label mt-1">คนไทยต้องไม่ไปตายดาบหน้า</p>
            <p className="text-footnote text-label-2">
              เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน ·{" "}
              <a
                href="https://www.facebook.com/profile.php?id=61570127262236"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-ink underline underline-offset-2"
              >
                Facebook
              </a>
            </p>
          </div>

          {/* Emergency numbers are always one tap away, on every page. */}
          <div className="flex flex-col gap-2">
            <p className="text-footnote font-bold text-label-2">ถูกหลอกหรือไม่แน่ใจ? โทรได้เลย</p>
            <div className="flex flex-wrap gap-2">
              <a href="tel:1506" className="btn btn-gray">
                <Phone size={16} aria-hidden="true" /> 1506 กด 2 กระทรวงแรงงาน
              </a>
              <a href="tel:1694" className="btn btn-gray">
                <Phone size={16} aria-hidden="true" /> 1694 กรมการจัดหางาน
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 border-t border-separator pt-4">
          <ul className="flex flex-wrap gap-x-1 -ml-2">
            {[
              { href: "/about", label: "เกี่ยวกับโครงการ" },
              { href: "/privacy-policy", label: "นโยบายความเป็นส่วนตัว" },
              { href: "/report-scam", label: "แจ้งเบาะแส" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center px-2 text-footnote text-label-2 hover:text-label rounded-lg">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-caption text-label-2">© {year} Thai Migrant Watch</p>
        </div>
      </div>
    </footer>
  );
}
