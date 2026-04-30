"use client";

import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Eye,
  CheckCircle2,
  ChevronRight
} from "lucide-react";

const sections = [
  {
    id: 1,
    title: "1. ข้อมูลที่เราเก็บรวบรวม",
    content: [
      "ชื่อและข้อมูลติดต่อเบื้องต้น",
      "ข้อมูลบริษัทที่ท่านนำมาตรวจสอบ",
      "รายละเอียดเหตุการณ์ที่ท่านรายงานเบาะแส",
      "ข้อมูลทางเทคนิคพื้นฐาน (IP Address, Browser Type)",
    ],
  },
  {
    id: 2,
    title: "2. วัตถุประสงค์ในการใช้ข้อมูล",
    content: [
      "เพื่อให้บริการตรวจสอบและวิเคราะห์ความเสี่ยง",
      "เพื่อปรับปรุงฐานข้อมูลให้ทันสมัยและแม่นยำ",
      "เพื่อการตรวจสอบข้อมูลเบาะแสที่ท่านรายงาน",
      "เพื่อพัฒนาประสิทธิภาพการใช้งานเว็บไซต์",
    ],
  },
  {
    id: 3,
    title: "3. มาตรการรักษาความปลอดภัย",
    content: [
      "ใช้การเข้ารหัสข้อมูล (Encryption) ในการถ่ายโอน",
      "จำกัดการเข้าถึงข้อมูลเฉพาะเจ้าหน้าที่ที่เกี่ยวข้อง",
      "ไม่มีการนำข้อมูลส่วนบุคคลไปขายให้กับบุคคลที่สาม",
    ],
  },
  {
    id: 4,
    title: "4. สิทธิตามกฎหมาย PDPA",
    content: [
      "สิทธิในการขอเข้าถึงและรับสำเนาข้อมูล",
      "สิทธิในการขอให้แก้ไขข้อมูลให้ถูกต้อง",
      "สิทธิในการขอให้ลบหรือระงับการใช้ข้อมูล",
      "สิทธิในการถอนความยินยอม",
    ],
  },
];

export default function PrivacyPolicyClient() {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">

      <header className="w-full bg-white border-b border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-brand-primary/10 rounded-2xl"
          >
            <Shield className="text-brand-primary" size={48} aria-hidden="true" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            นโยบายความเป็นส่วนตัว
          </h1>

          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            เรามุ่งมั่นที่จะปกป้องข้อมูลของท่านและปฏิบัติตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล (PDPA) อย่างเคร่งครัด
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col gap-10 max-w-3xl">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Lock, title: "ปลอดภัย", desc: "ข้อมูลถูกเข้ารหัส" },
            { icon: Eye, title: "โปร่งใส", desc: "ระบุการใช้ชัดเจน" },
            { icon: CheckCircle2, title: "สิทธิของท่าน", desc: "ควบคุมข้อมูลได้" },
          ].map((item, idx) => (
            <div key={idx} className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col items-center text-center gap-2">
              <item.icon className="text-brand-primary" size={24} aria-hidden="true" />
              <h2 className="font-extrabold text-slate-900">{item.title}</h2>
              <p className="text-xs text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>

        <section className="flex flex-col gap-6">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
              className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col gap-6 shadow-sm"
            >
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-3">
                <ChevronRight className="text-brand-primary" size={20} aria-hidden="true" />
                {section.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {section.content.map((item, i) => (
                  <li key={i} className="flex gap-3 text-slate-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-2.5 shrink-0" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>

        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-center flex flex-col items-center gap-4">
          <h2 className="text-white font-bold text-lg">มีคำถามเกี่ยวกับความเป็นส่วนตัว?</h2>
          <p className="text-slate-400 text-sm mb-2">ติดต่อทีมงานดูแลข้อมูลส่วนบุคคลของเราได้ที่</p>
          <a href="mailto:privacy@chekgonbin.com" className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all font-medium">
            privacy@chekgonbin.com
          </a>
        </div>

        <p className="text-center text-[10px] text-slate-400 uppercase tracking-widest pb-12">
          อัปเดตล่าสุด: เมษายน 2569
        </p>
      </div>
    </div>
  );
}
