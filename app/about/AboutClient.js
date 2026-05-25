"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Database,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Users,
  HelpCircle,
  ChevronDown,
  BarChart3,
} from "lucide-react";

export default function AboutClient() {
  const [openFaq, setOpenFaq] = useState(null);

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

        <section className="bg-white border border-slate-200 rounded-3xl md:rounded-5xl p-6 md:p-12 flex flex-col gap-6 md:gap-8">
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
                <div key={idx} className="p-5 md:p-6 bg-white border border-slate-100 rounded-3xl md:rounded-4xl flex flex-col gap-3">
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
            <div className="bg-slate-50 border border-slate-200 rounded-3xl md:rounded-5xl p-6 md:p-8 flex flex-col gap-5 md:gap-6">
              <div className="flex flex-col gap-1 md:gap-2">
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base">ข้อมูลที่เราเก็บจริงในระบบ</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  เมื่อคุณใช้งานแบบประเมินความเสี่ยง ระบบจะบันทึกข้อมูลที่กรอก (เช่น ชื่อบริษัท ช่องทางติดต่อ สัญญาณความเสี่ยงที่เลือก)
                  พร้อมผลการประเมินและ IP Address เพื่อป้องกันการใช้งานผิดปกติและปรับปรุงความแม่นยำของระบบ
                </p>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base">ข้อมูลจากการรายงานเบาะแส</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  หากคุณส่งรายงานมิจฉาชีพ เราจะเก็บข้อมูลที่คุณส่งเข้ามา เช่น รายละเอียดเหตุการณ์ หลักฐาน ชื่อ-เบอร์ผู้แจ้ง (ถ้ามี)
                  และ IP Address เพื่อใช้ในการตรวจสอบข้อเท็จจริง คัดกรองสแปม และส่งต่อหน่วยงานที่เกี่ยวข้องเมื่อจำเป็น
                </p>
              </div>
              <div className="flex flex-col gap-1 md:gap-2">
                <h3 className="font-extrabold text-slate-800 text-sm md:text-base">การวัดผลการใช้งานเว็บไซต์</h3>
                <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                  เว็บไซต์ใช้เครื่องมือวิเคราะห์การใช้งาน (เช่น Google Analytics) เพื่อดูภาพรวมการใช้งาน เช่น หน้าที่ถูกเปิด ปุ่มที่ถูกกด
                  และแหล่งที่มาของการเข้าใช้งาน โดยเราใช้ข้อมูลนี้เพื่อปรับปรุงประสบการณ์ใช้งาน ไม่ได้นำไปขายหรือใช้เพื่อการโฆษณาเชิงพาณิชย์
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">ภาคีร่วมโครงการ</h2>
            <div className="bg-white border border-slate-200 rounded-3xl md:rounded-5xl p-6 md:p-10 flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-16">
              <div className="flex items-center justify-center h-16 md:h-20 w-48 md:w-56 relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/partners/prachatham.png"
                  alt="สำนักข่าวประชาธรรม"
                  className="max-h-12 md:max-h-14 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105"
                />
              </div>
              <div className="w-px h-12 bg-slate-200 hidden sm:block" />
              <div className="flex items-center justify-center h-16 md:h-20 w-48 md:w-56 relative group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/partners/thai-migrant-watch.png"
                  alt="Thai Migrant Watch"
                  className="max-h-16 md:max-h-20 max-w-full object-contain grayscale hover:grayscale-0 transition-all duration-300 transform group-hover:scale-105"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">ข้อมูลเพิ่มเติม</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 md:p-8 bg-white border border-slate-100 rounded-3xl md:rounded-4xl flex flex-col gap-3 md:gap-4"
              >
                <h3 className="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <BarChart3 className="text-brand-primary w-4.5 h-4.5 md:w-5 md:h-5" />
                  ความเป็นจริงของปัญหา
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  ทุก 9 ชั่วโมง มีคนไทยคนหนึ่งโดนหลอกไปทำงานต่างประเทศ
                  ปี 2567 เสียหายรวมกว่า <span className="font-extrabold text-brand-primary text-lg">44 ล้านบาท</span>
                </p>
              </motion.div>

              <motion.div
                whileHover={{ y: -2 }}
                className="p-6 md:p-8 bg-white border border-slate-100 rounded-3xl md:rounded-4xl flex flex-col gap-3 md:gap-4"
              >
                <h3 className="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="text-brand-primary w-4.5 h-4.5 md:w-5 md:h-5" />
                  วิธีการป้องกัน
                </h3>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed">
                  การตรวจสอบอย่างรอบคอบก่อนตัดสินใจเป็นวิธีที่ดีที่สุดในการปกป้องตัวเองจากมิจฉาชีพ
                </p>
              </motion.div>
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
              <HelpCircle className="text-brand-primary w-6 h-6" />
              คำถามที่พบบ่อย (FAQ)
            </h2>
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              {[
                {
                  q: "จะรู้ได้อย่างไรว่าบริษัทจัดหางานถูกกฎหมายหรือไม่?",
                  a: "คุณสามารถตรวจสอบได้จากเลขที่ใบอนุญาตจัดหางาน และค้นหาในรายชื่อบริษัทที่ได้รับอนุญาตจากกรมการจัดหางาน (DOE) ซึ่งเครื่องมือเช็คก่อนบินของเราได้รวบรวมข้อมูลเหล่านี้ไว้ให้แล้ว",
                },
                {
                  q: "สัญญาณเตือนว่ากำลังจะโดนหลอกไปทำงานต่างประเทศมีอะไรบ้าง?",
                  a: "สัญญาณที่พบบ่อยที่สุดคือ 1. มีการเรียกเก็บเงินล่วงหน้าเป็นค่าดำเนินการ 2. ติดต่อผ่านช่องทางส่วนตัวที่ไม่สามารถยืนยันตัวตนได้ 3. สัญญาจ้างไม่ชัดเจนหรือไม่มีการทำสัญญาผ่านกรมการจัดหางาน",
                },
                {
                  q: "ทำไมต้องใช้เครื่องมือเช็คก่อนบิน?",
                  a: "เราช่วยคุณวิเคราะห์ข้อมูลเบื้องต้นจากฐานข้อมูล Blacklist และ Whitelist ของกรมการจัดหางานแบบเรียลไทม์ เพื่อลดความเสี่ยงก่อนที่คุณจะเสียเงินหรือเสียโอกาส",
                },
              ].map((faq, index) => (
                <div key={index} className="bg-white border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden">
                  <button
                    type="button"
                    className="w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    aria-expanded={openFaq === index}
                    aria-controls={`about-faq-answer-${index}`}
                  >
                    <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">{faq.q}</h3>
                    <ChevronDown
                      className={`text-slate-400 shrink-0 transition-transform duration-200 w-4.5 h-4.5 md:w-5 md:h-5 ${openFaq === index ? "rotate-180" : ""}`}
                      aria-hidden="true"
                    />
                  </button>
                  {openFaq === index && (
                    <div id={`about-faq-answer-${index}`} className="px-5 md:px-6 pb-5 md:pb-6">
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed">{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 md:gap-6">
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900">ช่องทางติดต่อ</h2>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <a href="mailto:thaimigrantwatchs@gmail.com" className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-xl md:rounded-4xl hover:border-brand-primary transition-all group">
                <Mail className="text-slate-400 group-hover:text-brand-primary shrink-0" size={20} aria-hidden="true" />
                <span className="text-slate-700 font-medium text-sm md:text-base">Email ติดต่อโครงการ</span>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61570127262236" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-xl md:rounded-4xl hover:border-brand-primary transition-all group">
                <Users className="text-slate-400 group-hover:text-brand-primary shrink-0" size={20} aria-hidden="true" />
                <span className="text-slate-700 font-medium text-sm md:text-base">Facebook Page</span>
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-4 p-6 md:p-8 bg-brand-primary/5 border border-brand-primary/10 rounded-3xl md:rounded-4xl text-center">
          <p className="text-brand-primary font-extrabold text-[10px] md:text-sm uppercase tracking-widest leading-relaxed">
            โครงการเพื่อสังคม • ไม่มีวัตถุประสงค์ในเชิงพาณิชย์
          </p>
        </footer>

        <div className="h-20" />
      </div>
    </div>
  );
}
