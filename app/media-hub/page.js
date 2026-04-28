"use client";

import { motion } from "framer-motion";
import { 
  Play, 
  Download, 
  MapPin, 
  ArrowRight,
  Video,
  FileImage,
  Navigation,
  Info
} from "lucide-react";
import Link from "next/link";

const stories = [
  {
    id: 1,
    title: "บทเรียนจากการหลอกลวง",
    thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=400&auto=format&fit=crop",
    description: "เรื่องจริงจากผู้ประสบภัยคนแรก ที่เข้าใจสัญญาณเตือน",
  },
  {
    id: 2,
    title: "วิธีตรวจสอบความสัตย์",
    thumbnail: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=400&auto=format&fit=crop",
    description: "คำแนะนำเชิงปฏิบัติสำหรับการเลือกสรรทัวร์",
  },
  {
    id: 3,
    title: "ศักยภาพมาจากการแบ่งปัน",
    thumbnail: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=400&auto=format&fit=crop",
    description: "ชุมชนช่วยเหลือซึ่งกันและกัน",
  },
];

const infographics = [
  {
    id: 1,
    title: "15 สัญญาณอันตรายหลัก",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "ขั้นตอนการตรวจสอบ",
    image: "https://images.unsplash.com/photo-1454165833767-027ffea9e778?q=80&w=400&auto=format&fit=crop",
  },
];

const routes = [
  {
    id: 1,
    title: "เส้นทางปลอดภัยไปต่างประเทศ",
    steps: [
      "วิจัยบริษัทนายหน้าอย่างละเอียด",
      "ยืนยันหลักฐานการจ้างงานจริง",
      "ตรวจสอบสัญญากับที่ปรึกษากฎหมาย",
      "ติดต่อสถานทูตไทยในประเทศปลายทาง",
    ],
  },
  {
    id: 2,
    title: "ถ้าคุณตกเป็นเหยื่อ",
    steps: [
      "หยุดการติดต่อและโอนเงินทันที",
      "รวบรวมหลักฐานการสนทนาทั้งหมด",
      "แจ้งความดำเนินคดีและแจ้งกรมการจัดหางาน",
      "ติดต่อสายด่วน 1694 ทันที",
    ],
  },
];

export default function MediaHub() {
  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      
      {/* Layer 1: Subconscious Hook */}
      <header className="w-full bg-white border-b border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
            ศูนย์ความรู้ <span className="text-brand-primary">CHEK GON BIN</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed">
            เรียนรู้วิธีปกป้องตัวเองจากการหลอกลวง และร่วมเป็นส่วนหนึ่งในการทำให้ชุมชนของเราปลอดภัยขึ้น
          </p>
          <div className="mt-4 flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            <Info size={12} />
            <span>Attention Cost: 2.4 KB</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col gap-20 max-w-5xl">
        
        {/* Layer 2: Chunked Gateway - Video Stories */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 border-l-4 border-brand-primary pl-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Video className="text-brand-primary" size={28} />
              เรื่องเล่าจากประสบการณ์จริง
            </h2>
            <p className="text-slate-500">เรียนรู้จากบทเรียนของผู้ที่เคยเผชิญหน้ากับความเสี่ยง</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((story, idx) => (
              <motion.div
                key={story.id}
                whileHover={{ y: -4 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 group cursor-pointer"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img src={story.thumbnail} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Play className="text-brand-primary fill-brand-primary ml-1" size={20} />
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-slate-900 mb-2">{story.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{story.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Infographics */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 border-l-4 border-brand-primary pl-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <FileImage className="text-brand-primary" size={28} />
              เนื้อหาข้อมูลประกอบภาพ
            </h2>
            <p className="text-slate-500">สรุปข้อมูลสำคัญในรูปแบบที่เข้าใจง่ายและจดจำได้ทันที</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {infographics.map((item) => (
              <div key={item.id} className="relative rounded-3xl overflow-hidden group">
                <img src={item.image} alt={item.title} className="w-full aspect-[4/3] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    <button className="p-3 bg-white text-brand-primary rounded-xl hover:bg-brand-primary hover:text-white transition-all shadow-xl">
                      <Download size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Layer 3: Deep-Dive Routes */}
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-2 border-l-4 border-brand-primary pl-6">
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Navigation className="text-brand-primary" size={28} />
              เส้นทางปลอดภัย
            </h2>
            <p className="text-slate-500">ขั้นตอนการดำเนินงานที่ถูกต้องและปลอดภัย</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {routes.map((route) => (
              <div key={route.id} className="p-8 bg-white border border-slate-200 rounded-[2.5rem] shadow-sm flex flex-col gap-8">
                <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                   <div className="w-2 h-8 bg-brand-primary rounded-full" />
                   {route.title}
                </h3>
                <div className="flex flex-col gap-4">
                  {route.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 text-sm font-black text-slate-400">
                        {idx + 1}
                      </div>
                      <p className="text-slate-700 font-medium pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <motion.section 
          whileHover={{ scale: 1.01 }}
          className="bg-brand-primary rounded-[3rem] p-12 md:p-20 text-center flex flex-col items-center gap-8 shadow-2xl shadow-brand-primary/20"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white leading-tight max-w-2xl">
            พบเบาะแสใหม่? ร่วมเป็นหูเป็นตาให้สังคม
          </h2>
          <p className="text-white/80 text-lg max-w-md">
            ทุกข้อมูลของคุณมีค่าและช่วยป้องกันไม่ให้คนอื่นตกเป็นเหยื่อ
          </p>
          <Link href="/report-scam" className="px-10 py-5 bg-white text-brand-primary rounded-2xl font-black text-xl hover:shadow-2xl transition-all active:scale-95 flex items-center gap-3">
            ไปที่หน้ารายงาน
            <ArrowRight size={24} />
          </Link>
        </motion.section>

        <div className="h-20" />
      </div>
    </div>
  );
}
