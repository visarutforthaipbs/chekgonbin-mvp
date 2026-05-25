"use client";

import Link from "next/link";
import { ShieldCheck, Users } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-brand-primary/25 bg-brand-secondary text-slate-200">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col gap-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8 md:gap-12">
            <a
              href="https://www.facebook.com/profile.php?id=61570127262236"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-white hover:text-brand-primary transition-colors"
              aria-label="Thai Migrant Watch"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary">
                <ShieldCheck size={18} />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-xl font-bold">เช็คก่อนบิน</span>
                <span className="text-sm text-slate-300">โครงการจาก Thai Migrant Watch</span>
              </span>
            </a>

            <div className="flex flex-col gap-3 md:items-end">
              <p className="text-sm text-slate-300">เมนูลัด</p>
              <div className="flex flex-wrap gap-2 md:justify-end">
              {[
                { href: "/report-scam", label: "รายงาน" },
                { href: "/about", label: "เกี่ยวกับ" },
                { href: "/privacy-policy", label: "ความเป็นส่วนตัว" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-slate-600/70 px-4 py-2 text-sm font-bold text-slate-100 hover:border-brand-primary hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-slate-700/70 pt-4">
            <p className="text-sm text-slate-300 flex items-center gap-2">
              <Users size={16} className="text-brand-primary" />
              เพื่อให้คนไทยต้องไม่ไปตายดาบหน้า
            </p>
            <p className="text-sm text-slate-400">© {year} เช็คก่อนบิน | ป้องกันมิจฉาชีพก่อนตัดสินใจเดินทาง</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
