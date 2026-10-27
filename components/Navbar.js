"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/brand/Logo";
import { Globe, Search, LifeBuoy, CalendarClock, Info } from "lucide-react";

// Top-level sections. Same list drives the desktop bar and the mobile tab bar,
// so navigation is never hidden behind a hamburger (HIG: tab bars stay visible).
const SECTIONS = [
  { href: "/", label: "ประเทศ", icon: Globe },
  { href: "/agencies", label: "เช็กบริษัท", icon: Search },
  { href: "/rounds", label: "รอบเปิดรับ", icon: CalendarClock },
  { href: "/emergency", label: "ฉุกเฉิน", icon: LifeBuoy },
  { href: "/about", label: "เกี่ยวกับ", icon: Info },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/" || pathname.startsWith("/result") || pathname.startsWith("/countries");
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
          <Link href="/" className="flex items-center min-h-11 rounded-xl" aria-label="Thai Migrant Watch หน้าแรก">
            <Logo kind="lockup" animate="load" className="h-4 md:h-[18px] w-auto" />
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

      {/* Mobile tab bar — 5 labeled tabs, always visible, safe-area aware */}
      <nav
        aria-label="เมนูหลัก (มือถือ)"
        className="glass md:hidden fixed inset-x-0 bottom-0 z-40 border-t border-[var(--glass-edge)] no-print"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-5">
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
