"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Database, 
  ShieldCheck, 
  AlertTriangle,
  Mail,
  Users,
  Info
} from "lucide-react";

export default function About() {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      
      {/* Layer 1: Subconscious Hook */}
      <header className="w-full bg-white border-b border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            เกี่ยวกับ <span className="text-brand-primary">เช็คก่อนบิน</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            โครงการเพื่อสังคมที่มุ่งหวังจะปกป้องแรงงานไทยจากการถูกหลอกลวงไปทำงานต่างประเทศ
          </p>
          <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Info size={12} />
            <span>Attention Cost: 1.5 KB</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col gap-12 max-w-3xl">
        
        {/* Layer 2: Chunked Gateway - Core Value */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm flex flex-col gap-8">
          <div className="flex flex-col gap-6 text-lg text-slate-700 leading-relaxed">
            <p>
              <span className="font-bold text-brand-primary">เช็คก่อนบิน</span> เป็นเครื่องมือช่วยตรวจสอบความเสี่ยงเบื้องต้น สำหรับผู้ที่กำลังพิจารณาไปทำงานต่างประเทศ เพื่อลดโอกาสในการตกเป็นเหยื่อของการหลอกลวงจากนายหน้าหรือบริษัทจัดหางานที่ไม่สุจริต
            </p>
            <p>
              เราเชื่อว่าการมีข้อมูลที่ถูกต้องก่อนการตัดสินใจ คือเกราะป้องกันที่ดีที่สุดเพื่อให้คนไทยไม่ต้องไป "ตายดาบหน้า"
            </p>
          </div>

          <div className="p-6 bg-orange-50 border-l-4 border-orange-400 rounded-r-2xl flex gap-4">
            <AlertTriangle className="text-orange-500 shrink-0 mt-1" size={24} />
            <p className="text-orange-800 text-sm leading-relaxed">
              <strong>หมายเหตุ:</strong> แอปพลิเคชันนี้เป็นเพียง <strong>MVP (Minimum Viable Product)</strong> ที่ใช้ในการทดสอบแนวคิด ซึ่งใช้ฐานข้อมูลจำกัดและกฎการตรวจสอบเบื้องต้น ผลลัพธ์ที่ได้เป็นเพียงการประเมินเบื้องต้นเท่านั้น
            </p>
          </div>
        </section>

        {/* Layer 3: Deep-Dive Details */}
        <section className="flex flex-col gap-10">
          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-slate-900">วิธีการทำงาน</h2>
            <p className="text-slate-600">ระบบจะตรวจสอบข้อมูลที่คุณกรอกโดยเปรียบเทียบกับ 3 แหล่งข้อมูลหลัก:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: CheckCircle2, color: "text-green-500", label: "Whitelist", desc: "บริษัทจัดหางานถูกกฎหมาย" },
                { icon: Database, color: "text-red-500", label: "Blacklist", desc: "มิจฉาชีพที่เคยถูกรายงาน" },
                { icon: ShieldCheck, color: "text-brand-primary", label: "Risk Patterns", desc: "พฤติกรรมที่น่าสงสัย" },
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-3">
                  <item.icon className={item.color} size={24} />
                  <div>
                    <h4 className="font-bold text-slate-900">{item.label}</h4>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-slate-900">นโยบายความเป็นส่วนตัว (PDPA)</h2>
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-slate-800">การเก็บรักษาข้อมูล</h4>
                <p className="text-sm text-slate-600">เราไม่เก็บบันทึกข้อมูลส่วนบุคคลของผู้ใช้งานโดยไม่จำเป็น ข้อมูลที่คุณกรอกเพื่อตรวจสอบจะถูกประมวลผลทันที</p>
              </div>
              <div className="flex flex-col gap-2">
                <h4 className="font-bold text-slate-800">การใช้ข้อมูล</h4>
                <p className="text-sm text-slate-600">ข้อมูลจะถูกใช้เพื่อการประเมินความเสี่ยงเท่านั้น และเราจะไม่มีการแบ่งปันข้อมูลให้กับบุคคลที่สามเพื่อผลประโยชน์ทางการค้า</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-slate-900">ช่องทางติดต่อ</h2>
            <div className="flex flex-wrap gap-4">
              <a href="mailto:thaimigrantwatchs@gmail.com" className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:border-brand-primary transition-all group">
                <Mail className="text-slate-400 group-hover:text-brand-primary" size={20} />
                <span className="text-slate-700 font-medium">Email ติดต่อโครงการ</span>
              </a>
              <a href="https://www.facebook.com/profile.php?id=61570127262236" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 rounded-2xl hover:border-brand-primary transition-all group">
                <Users className="text-slate-400 group-hover:text-brand-primary" size={20} />
                <span className="text-slate-700 font-medium">Facebook Page</span>
              </a>
            </div>
          </div>
        </section>

        <footer className="mt-8 p-8 bg-brand-primary/5 border border-brand-primary/10 rounded-3xl text-center">
          <p className="text-brand-primary font-bold text-sm uppercase tracking-widest">
            โครงการเพื่อสังคม • ไม่มีวัตถุประสงค์ในเชิงพาณิชย์
          </p>
        </footer>

        <div className="h-20" />
      </div>
    </div>
  );
}
