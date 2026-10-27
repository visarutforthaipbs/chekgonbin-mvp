"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, OctagonAlert, ScanSearch, Mail, ChevronDown, ArrowRight } from "lucide-react";

const SOURCES = [
  { Icon: CheckCircle2, tone: "text-safe-ink", title: "รายชื่อที่ได้รับอนุญาต", desc: "บริษัทจัดหางานที่มีใบอนุญาตจากกรมการจัดหางาน อัปเดตทุกวัน" },
  { Icon: OctagonAlert, tone: "text-danger-ink", title: "รายชื่อเฝ้าระวัง", desc: "ชื่อและช่องทางติดต่อที่เคยถูกรายงานว่าหลอกลวง" },
  { Icon: ScanSearch, tone: "text-label-2", title: "รูปแบบที่น่าสงสัย", desc: "พฤติกรรมเสี่ยง เช่น เก็บเงินล่วงหน้า ติดต่อผ่านบัญชีส่วนตัว" },
];

const FAQS = [
  {
    q: "จะรู้ได้อย่างไรว่าบริษัทจัดหางานถูกกฎหมาย?",
    a: "ตรวจเลขที่ใบอนุญาตจัดหางาน และค้นชื่อในรายชื่อบริษัทที่ได้รับอนุญาตจากกรมการจัดหางาน ซึ่ง Thai Migrant Watch รวบรวมไว้ให้แล้วในหน้า “รายชื่อบริษัท”",
  },
  {
    q: "สัญญาณเตือนว่ากำลังจะถูกหลอกมีอะไรบ้าง?",
    a: "ที่พบบ่อยที่สุดคือ 1) มีคนเรียกค่าสมัครหรือค่าบริการล่วงหน้า 2) ติดต่อผ่านช่องทางส่วนตัวที่ยืนยันตัวตนไม่ได้ 3) สัญญาจ้างไม่ชัดเจน หรือไม่ได้ทำผ่านกรมการจัดหางาน",
  },
  {
    q: "ผลจาก Thai Migrant Watch เชื่อได้แค่ไหน?",
    a: "เป็นการประเมินเบื้องต้นจากฐานข้อมูลที่เรามี ช่วยให้คุณรู้ว่าควรระวังตรงไหน แต่ไม่ใช่การรับรอง ก่อนจ่ายเงินควรยืนยันกับกรมการจัดหางาน (1694) ทุกครั้ง",
  },
];

export default function AboutClient() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl px-4 md:px-6 pt-8 md:pt-14 pb-12 md:pb-20 flex flex-col gap-8 md:gap-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-title1 md:text-large font-bold text-label tracking-tight">เกี่ยวกับ Thai Migrant Watch</h1>
          <p className="text-body text-label-2">
            โครงการเพื่อสังคม ที่ช่วยให้คนไทยตรวจสอบก่อนไปทำงานต่างประเทศ — ก่อนจะสายเกินไป
          </p>
        </header>

        <section className="flex flex-col gap-4 text-body text-label">
          <p>
            <strong>Thai Migrant Watch เกิดจากความโกรธ</strong> — โกรธที่คนไทยต้องเสียเงินก้อนสุดท้ายให้มิจฉาชีพ ก่อนจะรู้ตัวว่าถูกหลอก
            เราเชื่อว่าข้อมูลที่ถูกต้องควรเข้าถึงได้ <em className="not-italic font-bold">ก่อน</em> การตัดสินใจ ไม่ใช่หลังจากนั้น
          </p>
          <p className="text-label-2">
            ทุก 9 ชั่วโมง มีคนไทยหนึ่งคนถูกหลอกไปทำงานต่างประเทศ ปี 2567 ความเสียหายรวมกว่า{" "}
            <strong className="text-label">44 ล้านบาท</strong>
          </p>
        </section>

        <section aria-labelledby="how" className="flex flex-col gap-3">
          <h2 id="how" className="text-title3 font-bold text-label px-1">
            เราตรวจอะไรให้คุณ
          </h2>
          <ul className="inset-list">
            {SOURCES.map(({ Icon, tone, title, desc }) => (
              <li key={title} className="flex items-start gap-3 px-4 py-3.5">
                <Icon size={22} className={`${tone} shrink-0 mt-0.5`} aria-hidden="true" />
                <span className="flex flex-col">
                  <span className="text-callout font-bold text-label">{title}</span>
                  <span className="text-footnote text-label-2">{desc}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="text-footnote text-label-2 px-1">
            Thai Migrant Watch ยังอยู่ในระยะทดลอง (MVP) ฐานข้อมูลและกฎการตรวจยังจำกัด ผลลัพธ์จึงเป็นการประเมินเบื้องต้นเท่านั้น
          </p>
          <Link href="/" className="btn btn-prominent self-start mt-1">
            ลองตรวจสอบบริษัท <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </section>

        <section aria-labelledby="faq" className="flex flex-col gap-3">
          <h2 id="faq" className="text-title3 font-bold text-label px-1">
            คำถามที่พบบ่อย
          </h2>
          <div className="inset-list">
            {FAQS.map((faq, index) => {
              const open = openFaq === index;
              return (
                <div key={index}>
                  <h3>
                    <button
                      type="button"
                      className="w-full min-h-11 text-left px-4 py-3.5 flex items-center justify-between gap-4 hover:bg-fill transition-colors"
                      onClick={() => setOpenFaq(open ? null : index)}
                      aria-expanded={open}
                      aria-controls={`about-faq-${index}`}
                    >
                      <span className="text-callout font-bold text-label">{faq.q}</span>
                      <ChevronDown
                        size={20}
                        className={`text-label-2 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        aria-hidden="true"
                      />
                    </button>
                  </h3>
                  {open && (
                    <p id={`about-faq-${index}`} className="px-4 pb-4 -mt-1 text-callout text-label-2">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="partners" className="flex flex-col gap-3">
          <h2 id="partners" className="text-title3 font-bold text-label px-1">
            ภาคีร่วมงาน
          </h2>
          {/* Logos sit on a fixed light plate so they stay legible in Dark Mode */}
          <div className="rounded-2xl bg-white border border-separator p-6 flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-14">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/partners/prachatham.png" alt="สำนักข่าวประชาธรรม" className="max-h-12 max-w-[200px] object-contain" />
          </div>
        </section>

        <section aria-labelledby="contact" className="flex flex-col gap-3">
          <h2 id="contact" className="text-title3 font-bold text-label px-1">
            ติดต่อโครงการ
          </h2>
          <div className="flex flex-col sm:flex-row gap-2">
            <a href="mailto:thaimigrantwatchs@gmail.com" className="btn btn-gray flex-1">
              <Mail size={18} aria-hidden="true" /> อีเมล
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61570127262236"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-gray flex-1"
            >
              เพจ Facebook
            </a>
          </div>
          <p className="text-footnote text-label-2 px-1">
            โครงการเพื่อสังคม ไม่มีวัตถุประสงค์เชิงพาณิชย์ · อ่าน{" "}
            <Link href="/privacy-policy" className="underline underline-offset-2">
              นโยบายความเป็นส่วนตัว
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
