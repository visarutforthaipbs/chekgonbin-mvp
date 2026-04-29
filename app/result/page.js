"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  RotateCcw,
  Phone,
  Globe,
  ClipboardList,
  Info,
  ArrowLeft,
  Share2,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState(() => {
    const data = searchParams.get("data");
    if (data) {
      try {
        return JSON.parse(data);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (!result) {
      router.push("/");
    }
  }, [result, router]);

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500">กำลังโหลดผลลัพธ์...</p>
      </div>
    );
  }

  const riskConfig = {
    low: {
      color: "text-signal-green",
      bg: "bg-green-50/50",
      borderColor: "border-signal-green/20",
      threatClass: "threat-low",
      text: "ความเสี่ยงต่ำ",
      description: "ไม่พบสัญญาณอันตรายที่ชัดเจน แต่ควรตรวจสอบอย่างละเอียดอีกครั้ง",
      icon: CheckCircle2,
    },
    medium: {
      color: "text-signal-orange",
      bg: "bg-orange-50/50",
      borderColor: "border-signal-orange/20",
      threatClass: "threat-medium",
      text: "ความเสี่ยงปานกลาง",
      description: "พบข้อควรระวังบางประการ ควรตรวจสอบข้อมูลเพิ่มเติมกับกรมการจัดหางาน",
      icon: AlertTriangle,
    },
    high: {
      color: "text-signal-red",
      bg: "bg-red-50/50",
      borderColor: "border-signal-red/20",
      threatClass: "threat-high",
      text: "ความเสี่ยงสูง",
      description: "พบสัญญาณอันตราย! โปรดระมัดระวังอย่างยิ่งและหลีกเลี่ยงการโอนเงิน",
      icon: AlertCircle,
    },
  };

  const config = riskConfig[result.riskLevel] || riskConfig.medium;

  const actionPlans = {
    low: [
      { icon: Globe, title: "ตรวจสอบใบอนุญาต", desc: "ยืนยันว่าบริษัทได้รับอนุญาตจากกรมการจัดหางาน" },
      { icon: ClipboardList, title: "ตรวจสอบเอกสาร", desc: "ขอเอกสารสัญญาอย่างครบถ้วนและอ่านอย่างละเอียด" },
    ],
    medium: [
      { icon: Phone, title: "ติดต่อกรมการจัดหางาน", desc: "โทร 1300 เพื่อยืนยันข้อมูลบริษัท" },
      { icon: ClipboardList, title: "ล็อคเงินไว้ก่อน", desc: "อย่าโอนเงินจนกว่าจะยืนยันทุกประการ" },
    ],
    high: [
      { icon: Phone, title: "เรียกสายด่วนแรงงาน", desc: "โทร 1694 (สายด่วนแรงงานไทย)" },
      { icon: Globe, title: "ติดต่อสถานทูต", desc: "ขอข้อมูลติดต่อสถานทูตไทยในประเทศปลายทาง" },
    ],
  };

  const actions = actionPlans[result.riskLevel] || actionPlans.medium;

  return (
    <div className={`w-full min-h-screen ${config.bg} transition-colors duration-500 flex flex-col items-center`}>
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20 flex flex-col items-center gap-12 max-w-3xl">
        
        {/* Layer 1: Subconscious Hook - Threat Level */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center gap-6"
        >
          <div className={`p-6 bg-white rounded-[2.5rem] shadow-xl ${config.threatClass}`}>
            <config.icon className={`${config.color}`} size={80} />
          </div>
          
          <div className="flex flex-col gap-2">
            <h1 className={`text-4xl md:text-5xl font-extrabold ${config.color}`}>
              {config.text}
            </h1>
            <p className="text-slate-600 text-lg md:text-xl max-w-md">
              {config.description}
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Risk Score</span>
            <span className={`text-xl font-black ${config.color}`}>{result.score}</span>
          </div>
        </motion.div>

        {/* Layer 2: Chunked Gateway - Assessment Details */}
        <section className="w-full bg-white border border-slate-200 rounded-[2.5rem] shadow-lg overflow-hidden">
          <div className="p-8 flex flex-col gap-6">
            <h3 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Info className="text-slate-400" size={20} />
              รายละเอียดการประเมิน
            </h3>
            
            <div className="flex flex-col gap-3">
              {result.reasons.length > 0 ? (
                result.reasons.map((reason, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`p-4 rounded-xl border-l-4 ${config.borderColor} bg-slate-50 flex items-start gap-3`}
                  >
                    <AlertCircle className={`${config.color} mt-0.5 shrink-0`} size={18} />
                    <span className="text-slate-700">{reason}</span>
                  </motion.div>
                ))
              ) : (
                <div className="p-4 rounded-xl border-l-4 border-signal-green bg-green-50 flex items-start gap-3">
                  <CheckCircle2 className="text-signal-green mt-0.5 shrink-0" size={18} />
                  <span className="text-green-800 font-medium">ไม่พบปัจจัยเสี่ยงในฐานข้อมูลเบื้องต้น</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Layer 3: Conscious Deep-Dive - Action Plan */}
        <section className="w-full flex flex-col gap-6">
          <h3 className="text-xl font-extrabold text-slate-900 px-2 uppercase tracking-wide">
            แนวทางการดำเนินการ
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {actions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex items-start gap-4 group hover:border-brand-primary transition-all"
              >
                <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-brand-primary/10 transition-colors">
                  <action.icon className="text-slate-600 group-hover:text-brand-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900">{action.title}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed">{action.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Emergency Hotlines */}
        <section className={`w-full p-8 rounded-[2.5rem] border border-slate-100 bg-white shadow-md flex flex-col md:flex-row items-center justify-between gap-8 ${config.threatClass}`}>
           <div className="flex flex-col gap-2">
             <h3 className="text-lg font-extrabold text-slate-900">สายด่วนช่วยเหลือ</h3>
             <p className="text-sm text-slate-500">ติดต่อเจ้าหน้าที่ทันทีเมื่อพบสัญญาณอันตราย</p>
           </div>
           
           <div className="flex gap-4">
             <div className="flex flex-col items-center">
               <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">สายด่วนแรงงาน</span>
               <span className={`text-3xl font-black ${config.color}`}>1694</span>
             </div>
             <div className="w-px h-10 bg-slate-100" />
             <div className="flex flex-col items-center">
               <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter">กรมการจัดหางาน</span>
               <span className={`text-3xl font-black ${config.color}`}>1300</span>
             </div>
           </div>
        </section>

        <div className="flex flex-col items-center gap-6 mt-4">
          <p className="text-center text-xs text-slate-400 max-w-md leading-relaxed">
            *ผลลัพธ์นี้เป็นการประเมินเบื้องต้นจากข้อมูลที่คุณให้มาเท่านั้น ไม่สามารถรับรองความปลอดภัยได้ 100% โปรดตรวจสอบกับกรมการจัดหางานโดยตรงอีกครั้ง
          </p>

          {/* Share buttons */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Share2 size={12} /> แชร์ให้เพื่อน
            </p>
            <div className="flex gap-3 w-full">
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://chekgonbin.vercel.app")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#06C755] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95"
              >
                LINE
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://chekgonbin.vercel.app")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1877F2] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95"
              >
                Facebook
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://chekgonbin.vercel.app");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
              >
                {copied ? <><Check size={15} /> คัดลอกแล้ว</> : <><Copy size={15} /> คัดลอก</>}
              </button>
            </div>
          </div>

          <Link href="/" className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-lg active:scale-95">
            <RotateCcw size={20} />
            ตรวจสอบใหม่
          </Link>
        </div>

        {/* Cognitive Breather */}
        <div className="h-20" />
      </div>
    </div>
  );
}

export default function Result() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500">กำลังโหลดผลลัพธ์...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
