"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Database,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Users,
} from "lucide-react";

export default function AboutClient() {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">

      <header className="w-full bg-white border-b border-slate-100 py-12 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-4 md:gap-6">
          <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            เกี่ยวกับ <span className="text-brand-primary">เช็คก่อนบิน</span>
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
            โครงการเพื่อสังคมที่มุ่งหวังจะปกป้องแรงงานไทยจากการถูกหลอกลวงไปทำงานต่างประเทศ
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-8 md:gap-12 max-w-3xl">

        <section className="bg-white border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-sm flex flex-col gap-6 md:gap-8">
          <div className="flex flex-col gap-4 md:gap-6 text-base md:text-lg text-slate-700 leading-relaxed">
            <p>
              <strong>เช็คก่อนบินเกิดจากความโกรธ</strong> — โกรธที่คนไทยต้องเสียเงินก้อนสุดท้ายให้กับมิจฉาชีพ ก่อนที่จะรู้ว่าตัวเองถูกหลอก เราเชื่อว่าข้อมูลที่ถูกต้องควรเข้าถึงได้ก่อนการตัดสินใจ ไม่ใช่หลังจากที่สายเกินไปแล้ว
            </p>
            <p>
              <span className="font-extrabold text-brand-primary">เช็คก่อนบิน</span> เป็นเครื่องมือช่วยตรวจสอบความเสี่ยงเบื้องต้น สำหรับผู้ที่กำลังพิจารณาไปทำงานต่างประเทศ เพื่อลดโอกาสในการตกเป็นเหยื่อของการหลอกลวงจากนายหน้าหรือบริษัทจัดหางานที่ไม่สุจริต
            </p>
          </div>

          <div className="p-5 md:p-6 bg-orange-50 border-l-4 border-signal-orange rounded-r-xl md:rounded-r-2xl flex gap-3 md:gap-4">
            <AlertTriangle className="text-signal-orange shrink-0 mt-1 w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
            <p className="text-orange-800 text-xs md:text-sm leading-relaxed">
              <strong>หมายเหตุ:</strong> แอปพลิเคชันนี้เป็นเพียง <strong>MVP</strong> ที่ใช้ในการทดสอบแนวคิด ซึ่งใช้ฐานข้อมูลจำกัดและกฎการตรวจสอบเบื้องต้น ผลลัพธ์ที่ได้เป็นเพียงการประเมินเบื้องต้นเท่านั้น
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-8 md:gap-10">
          <div className="flex flex-col gap-5 md:gap-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">วิธีการทำงาน</h2>
            <p className="text-sm md:text-base text-slate-600">ระบบจะตรวจสอบข้อมูลที่คุณกรอกโดยเปรียบเทียบกับ 3 แหล่งข้อมูลหลัก:</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {[
                { icon: CheckCircle2, color: "text-signal-green", label: "Whitelist", desc: "บริษัทถูกกฎหมาย" },
                { icon: Database, color: "text-signal-red", label: "Blacklist", desc: "มิจฉาชีพที่เคยถูกรายงาน" },
                { icon: ShieldCheck, color: "text-brand-primary", label: "Risk Patterns", desc: "พฤติกรรมที่น่าสงสัย" },
              ].map((item, idx) => (
                <div key={idx} className="p-5 md:p-6 bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] shadow-sm flex flex-col gap-3">
                  <item.icon className={`${item.color} w-5 h-5 md:w-6 md:h-6`} aria-hidden="true" />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm md:text-base">{item.label}</h3>
                    <p className="text-[10px] md:text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">นโยบายความเป็นส่วนตัว (PDPA)</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 flex flex-col gap-5 md:gap-6">
              <div className="flex flex-col gap-1 md:gap-2">
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base">การเก็บรักษาข้อมูล</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">เราไม่เก็บันทึกข้อมูลส่วนบุคคลของผู้ใช้งานโดยไม่จำเป็น ข้อมูลที่คุณกรอกเพื่อตรวจสอบจะถูกประมวลผลทันที</p>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base">การใช้ข้อมูล</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">ข้อมูลจะถูกใช้เพื่อการประเมินความเสี่ยงเท่านั้น และเราจะไม่มีการแบ่งปันข้อมูลให้กับบุคคลที่สามเพื่อผลประโยชน์ทางการค้า</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">ช่องทางติดต่อ</h2>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <a href="mailto:thaimigrantwatchs@gmail.com" className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-xl md:rounded-[2rem] hover:border-brand-primary transition-all group">
                <Mail className="text-slate-400 group-hover:text-brand-primary shrink-0" size={20} aria-hidden="true" />
                <span className="text-slate-700 font-medium text-sm md:text-base">Email ติดต่อโครงการ</span>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61570127262236" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-xl md:rounded-[2rem] hover:border-brand-primary transition-all group">
                <Users className="text-slate-400 group-hover:text-brand-primary shrink-0" size={20} aria-hidden="true" />
                <span className="text-slate-700 font-medium text-sm md:text-base">Facebook Page</span>
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-4 p-6 md:p-8 bg-brand-primary/5 border border-brand-primary/10 rounded-[1.5rem] md:rounded-[2rem] text-center">
          <p className="text-brand-primary font-extrabold text-[10px] md:text-sm uppercase tracking-widest leading-relaxed">
            โครงการเพื่อสังคม • ไม่มีวัตถุประสงค์ในเชิงพาณิชย์
          </p>
        </footer>

        <div className="h-20" />
      </div>
    </div>
  );
}
