"use client";

import Link from "next/link";
import { Users } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-6 mt-auto border-t border-slate-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          {/* Branding & Mission - Layer 2 */}
          <div className="flex flex-col gap-1">
            <a
              href="https://www.facebook.com/profile.php?id=61570127262236"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center md:justify-start gap-2 text-white hover:text-brand-primary transition-colors"
            >
              <Users size={18} />
              <span className="font-bold text-lg">Thai Migrant Watch</span>
            </a>
            <p className="text-xs text-slate-500 italic">
              เพื่อให้คนไทยต้องไม่ไปตายดาบหน้า
            </p>
          </div>

          {/* Pathfinding & Status - Combined Layer 1/2 */}
          <div className="flex flex-col items-center md:items-end gap-3">
            <div className="flex flex-wrap justify-center md:justify-end gap-x-6 gap-y-2">
              {[
                { href: "/report-scam", label: "รายงาน" },
                { href: "/about", label: "เกี่ยวกับ" },
                { href: "/privacy-policy", label: "ความเป็นส่วนตัว" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs font-medium hover:text-white transition-colors uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <p className="text-[10px] text-slate-600 uppercase tracking-tighter">
              © 2025 เช็คก่อนบิน - ตรวจสอบความเสี่ยงงานต่างประเทศ
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
