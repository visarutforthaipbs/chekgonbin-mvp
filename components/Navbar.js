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
    <nav
      className={`sticky top-0 z-[1000] transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm py-3"
          : "bg-brand-primary py-4"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex justify-between items-center min-h-[40px]">
          {/* Logo - Layer 1: Subconscious Hook */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-white rounded-full p-1.5 shadow-sm transition-transform group-hover:scale-105">
              <ShieldCheck 
                className={scrolled ? "text-brand-primary" : "text-brand-primary"} 
                size={24} 
              />
            </div>
            <span
              className={`text-lg md:text-xl font-extrabold transition-colors hidden sm:block ${
                scrolled ? "text-brand-secondary" : "text-white"
              }`}
            >
              เช็คก่อนบิน
            </span>
          </Link>

          {/* Desktop Navigation - Layer 2: Chunked Gateway */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-extrabold transition-all ${
                  scrolled
                    ? "text-slate-600 hover:bg-slate-100 hover:text-brand-primary"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className={`p-2 rounded-xl md:hidden transition-colors ${
              scrolled
                ? "text-slate-600 hover:bg-slate-100"
                : "text-white hover:bg-white/20"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-64 mt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div
            className={`flex flex-col gap-1 pb-4 pt-2 border-t ${
              scrolled ? "border-slate-100" : "border-white/20"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-3 rounded-xl text-base font-extrabold transition-colors ${
                  scrolled
                    ? "text-brand-secondary hover:bg-brand-primary/5 hover:text-brand-primary"
                    : "text-white hover:bg-white/20"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
