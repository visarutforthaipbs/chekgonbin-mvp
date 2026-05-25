"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/agencies",     label: "บริษัทที่อนุญาต" },
    { href: "/report-scam",  label: "รายงาน" },
    { href: "/about",        label: "เกี่ยวกับ" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-1000 transition-all duration-300 border-b ${
          scrolled
            ? "bg-white/85 backdrop-blur-md border-slate-200/70 py-2 md:py-3"
            : "bg-slate-50/50 backdrop-blur-md border-slate-200/20 py-3.5 md:py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex justify-between items-center min-h-11">
            {/* Logo - Layer 1: Subconscious Hook */}
            <Link href="/" className="flex items-center gap-2 md:gap-3 group">
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary/15 text-brand-primary transition-colors group-hover:bg-brand-primary/20">
                <ShieldCheck 
                  className="text-brand-primary" 
                  size={18}
                />
              </div>
              <span className="flex flex-col leading-tight">
                <span className="text-lg md:text-xl font-bold text-brand-secondary transition-colors group-hover:text-brand-primary">เช็คก่อนบิน</span>
                <span className="hidden md:block text-xs text-slate-500">ตรวจสอบความเสี่ยงก่อนเดินทาง</span>
              </span>
            </Link>

            {/* Desktop Navigation - Layer 2: Chunked Gateway */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:border-brand-primary hover:text-brand-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="p-2.5 rounded-xl border border-slate-300 md:hidden text-slate-700 hover:border-brand-primary hover:text-brand-primary focus:ring-2 focus:ring-brand-primary/20 transition-colors outline-none"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "ปิดเมนู" : "เปิดเมนู"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isOpen ? "max-h-80 mt-4 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col gap-1 pb-4 pt-2 border-t border-slate-200/50">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-3 rounded-xl border border-slate-200 text-base font-bold text-slate-800 hover:border-brand-primary hover:text-brand-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-999 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
