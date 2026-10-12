"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShieldCheck, Search, Building2, Megaphone, Info } from "lucide-react";

// Top-level sections. Same list drives the desktop bar and the mobile tab bar,
// so navigation is never hidden behind a hamburger (HIG: tab bars stay visible).
const SECTIONS = [
  { href: "/", label: "ตรวจสอบ", icon: Search },
  { href: "/agencies", label: "รายชื่อบริษัท", icon: Building2 },
  { href: "/report-scam", label: "แจ้งเบาะแส", icon: Megaphone },
  { href: "/about", label: "เกี่ยวกับ", icon: Info },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/result");
  return pathname.startsWith(href);
}

export default function Navbar() {
  const pathname = usePathname() || "/";

  return (
    <>
      {/* Top bar — glass, functional layer */}
      <nav
        aria-label="เมนูหลัก"
        className="glass sticky top-0 z-40 border-b border-[var(--glass-edge)] no-print"
      >
        <div className="mx-auto flex h-14 md:h-16 max-w-5xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2.5 min-h-11 rounded-xl" aria-label="เช็คก่อนบิน หน้าแรก">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-primary text-white">
              <ShieldCheck size={20} strokeWidth={2.25} aria-hidden="true" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-title3 font-bold text-label leading-none">เช็คก่อนบิน</span>
              <span className="hidden md:block text-caption text-label-2 mt-1">ตรวจสอบก่อนไปทำงานต่างประเทศ</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {SECTIONS.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex min-h-11 items-center rounded-xl px-3.5 text-callout font-medium transition-colors ${
                      active ? "bg-fill text-label font-bold" : "text-label-2 hover:text-label hover:bg-fill"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile tab bar — 4 labeled tabs, always visible, safe-area aware */}
      <nav
        aria-label="เมนูหลัก (มือถือ)"
        className="glass md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[var(--glass-edge)] no-print"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-4">
          {SECTIONS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-[60px] flex-col items-center justify-center gap-0.5 transition-colors ${
                    active ? "text-accent-ink" : "text-label-2"
                  }`}
                >
                  <Icon size={22} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
                  <span className={`text-caption leading-tight ${active ? "font-bold" : "font-medium"}`}>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
