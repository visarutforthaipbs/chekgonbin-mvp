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
  Printer,
} from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/utils/analytics";

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

  const [checklist, setChecklist] = useState({
    doe: false,
    dbd: false,
    noPersonalTransfer: false,
    blacklist: false,
    receipt: false,
  });

  useEffect(() => {
    if (!result) {
      router.push("/");
    }
  }, [result, router]);

  useEffect(() => {
    if (!result) return;
    trackEvent("risk_result_view", {
      risk_level: result.riskLevel || "unknown",
      score: typeof result.score === "number" ? result.score : undefined,
    });
  }, [result]);

  if (!result) {
    return (
      <div role="status" className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
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
      strokeColor: "stroke-signal-green",
      glowClass: "border border-green-200/50",
    },
    medium: {
      color: "text-signal-orange",
      bg: "bg-orange-50/50",
      borderColor: "border-signal-orange/20",
      threatClass: "threat-medium",
      text: "ความเสี่ยงปานกลาง",
      description: "พบข้อควรระวังบางประการ ควรตรวจสอบข้อมูลเพิ่มเติมกับกรมการจัดหางาน",
      icon: AlertTriangle,
      strokeColor: "stroke-signal-orange",
      glowClass: "border border-orange-200/50",
    },
    high: {
      color: "text-signal-red",
      bg: "bg-red-50/50",
      borderColor: "border-signal-red/20",
      threatClass: "threat-high",
      text: "ความเสี่ยงสูง",
      description: "พบสัญญาณอันตราย! โปรดระมัดระวังอย่างยิ่งและหลีกเลี่ยงการโอนเงิน",
      icon: AlertCircle,
      strokeColor: "stroke-signal-red",
      glowClass: "border border-red-200/50",
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
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body, html {
            background: white !important;
            color: #000 !important;
          }
          header, footer, nav, button, a.no-print-link, .no-print {
            display: none !important;
          }
          .min-h-screen {
            min-height: 0 !important;
            background-color: white !important;
          }
          .container {
            padding: 0 !important;
            margin: 0 auto !important;
            max-width: 100% !important;
          }
          .bg-slate-50 {
            background-color: #f8fafc !important;
          }
          .bg-green-50\\/20 {
            background-color: #f0fdf4 !important;
          }
          section {
            page-break-inside: avoid;
          }
        }
      `}} />
      
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-20 flex flex-col items-center gap-8 md:gap-12 max-w-3xl">
        
        {/* Layer 1: Subconscious Hook - Threat Level */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center gap-4 md:gap-6"
        >
          {/* Circular SVG Gauge */}
          <div className="relative w-36 h-36 md:w-44 md:h-44 flex items-center justify-center bg-white rounded-full border border-slate-100 p-2">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="40%"
                className="stroke-slate-100 fill-none"
                strokeWidth="8"
              />
              <motion.circle
                cx="50%"
                cy="50%"
                r="40%"
                className={`fill-none ${config.strokeColor}`}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray="251.2"
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 - (251.2 * result.score) / 100 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <config.icon className={`${config.color} w-8.5 h-8.5 md:w-10 md:h-10 mb-1`} />
              <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">คะแนนความเสี่ยง</span>
              <span className={`text-2xl md:text-4xl font-black ${config.color} leading-none mt-1`}>{result.score}%</span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <h1 className={`text-3xl md:text-5xl font-extrabold ${config.color}`}>
              {config.text}
            </h1>
            <p className="text-slate-600 text-base md:text-xl max-w-sm md:max-w-md">
              {config.description}
            </p>
          </div>
        </motion.div>

        {/* Layer 2: Chunked Gateway - Assessment Details */}
        <section className={`w-full bg-white rounded-3xl md:rounded-5xl overflow-hidden transition-all duration-300 ${config.glowClass}`}>
          <div className="p-6 md:p-8 flex flex-col gap-4 md:gap-6">
            <h3 className="text-base md:text-lg font-extrabold text-slate-800 flex items-center gap-2">
              <Info className="text-slate-400 w-4.5 h-4.5 md:w-5 md:h-5" />
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
                    className={`p-3.5 md:p-4 rounded-xl border-l-4 ${config.borderColor} bg-slate-50 flex items-start gap-3`}
                  >
                    <AlertCircle className={`${config.color} mt-0.5 shrink-0`} size={18} />
                    <span className="text-slate-700 text-sm md:text-base">{reason}</span>
                  </motion.div>
                ))
              ) : (
                <div className="p-3.5 md:p-4 rounded-xl border-l-4 border-signal-green bg-green-50 flex items-start gap-3">
                  <CheckCircle2 className="text-signal-green mt-0.5 shrink-0" size={18} />
                  <span className="text-green-800 font-medium text-sm md:text-base">ไม่พบปัจจัยเสี่ยงในฐานข้อมูลเบื้องต้น</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Verification Checklist */}
        <section className="w-full bg-white border border-slate-200 rounded-3xl md:rounded-5xl overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-4 md:gap-6">
            <div>
              <h3 className="text-base md:text-lg font-extrabold text-slate-800 flex items-center gap-2 mb-1">
                <ClipboardList className="text-brand-primary w-4.5 h-4.5 md:w-5 md:h-5" />
                ขั้นตอนปฏิบัติเพื่อความปลอดภัย (Safety Checklist)
              </h3>
              <p className="text-xs text-slate-500">ตรวจสอบและทำเครื่องหมายเพื่อบันทึกประวัติการป้องกัน</p>
            </div>
            
            <div className="flex flex-col gap-3">
              {[
                { id: "doe", label: "ตรวจสอบรายชื่อผู้รับอนุญาตจัดหางานในระบบของกรมการจัดหางาน (DOE)" },
                { id: "dbd", label: "ค้นหาข้อมูลจดทะเบียนนิติบุคคลและงบการเงินกับกรมพัฒนาธุรกิจการค้า (DBD)" },
                { id: "noPersonalTransfer", label: "หลีกเลี่ยงการโอนเงินมัดจำหรือค่าธรรมเนียมเข้าบัญชีส่วนบุคคล (ต้องเป็นบัญชีบริษัทเท่านั้น)" },
                { id: "blacklist", label: "ตรวจสอบรายชื่อคนโกงในระบบรายงานและค้นหาประวัติการหลอกลวงทั่วไป" },
                { id: "receipt", label: "เรียกขอหนังสือสัญญาจ้างงานและหลักฐานการรับเงินที่ถูกต้องทุกครั้ง" },
              ].map((item) => (
                <motion.label
                  key={item.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border hover:border-brand-primary/30 hover:bg-slate-50/50 cursor-pointer transition-all duration-300 ${
                    checklist[item.id]
                      ? "bg-green-50/30 border-green-300"
                      : "bg-white border-slate-100"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checklist[item.id]}
                    onChange={(e) => setChecklist(prev => ({ ...prev, [item.id]: e.target.checked }))}
                    className="w-5 h-5 rounded-md border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer shrink-0 mt-0.5 transition-transform duration-200 hover:scale-105"
                  />
                  <span className={`text-sm leading-relaxed select-none transition-all duration-300 ${checklist[item.id] ? "text-slate-400 line-through font-normal" : "text-slate-700 font-medium"}`}>
                    {item.label}
                  </span>
                </motion.label>
              ))}
            </div>
          </div>
        </section>

        {/* Layer 3: Conscious Deep-Dive - Action Plan */}
        <section className="w-full flex flex-col gap-4 md:gap-6">
          <h3 className="text-lg md:text-xl font-extrabold text-slate-900 px-2 uppercase tracking-wide">
            แนวทางการดำเนินการ
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {actions.map((action, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1 }}
                className="p-5 md:p-6 bg-white border border-slate-100 rounded-3xl md:rounded-4xl flex items-start gap-4 group hover:border-brand-primary transition-all"
              >
                <div className="p-2.5 md:p-3 bg-slate-50 rounded-xl group-hover:bg-brand-primary/10 transition-colors">
                  <action.icon className="text-slate-600 group-hover:text-brand-primary w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm md:text-base">{action.title}</h4>
                  <p className="text-xs md:text-sm text-slate-500 leading-relaxed">{action.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Emergency Hotlines */}
        <section className={`w-full p-6 md:p-8 rounded-3xl md:rounded-5xl border border-slate-100 bg-white flex flex-col md:flex-row items-center md:justify-between gap-6 md:gap-8 ${config.threatClass}`}>
           <div className="flex flex-col gap-1 md:gap-2 text-center md:text-left">
             <h3 className="text-base md:text-lg font-extrabold text-slate-900">สายด่วนช่วยเหลือ</h3>
             <p className="text-xs md:text-sm text-slate-500">ติดต่อเจ้าหน้าที่ทันทีเมื่อพบสัญญาณอันตราย</p>
             <p className="text-xs md:text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-2 inline-flex items-center gap-2 w-fit mx-auto md:mx-0">
               <CheckCircle2 size={14} className="shrink-0" />
               ใช้เบอร์ทางการเท่านั้น หลีกเลี่ยงบัญชีหรือเบอร์ส่วนตัว
             </p>
           </div>
           
           <div className="flex gap-6 md:gap-8">
             <a href="tel:1694" className="flex flex-col items-center group/phone hover:opacity-85 transition-opacity">
               <span className="text-[9px] md:text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter group-hover/phone:text-brand-primary transition-colors">สายด่วนแรงงาน</span>
               <span className={`text-2xl md:text-3xl font-black ${config.color} group-hover/phone:underline flex items-center gap-1.5`}>
                 <Phone size={18} className="shrink-0" />
                 1694
               </span>
             </a>
             <div className="w-px h-10 bg-slate-100" />
             <a href="tel:1300" className="flex flex-col items-center group/phone hover:opacity-85 transition-opacity">
               <span className="text-[9px] md:text-[10px] font-extrabold text-slate-400 uppercase tracking-tighter group-hover/phone:text-brand-primary transition-colors">กรมการจัดหางาน</span>
               <span className={`text-2xl md:text-3xl font-black ${config.color} group-hover/phone:underline flex items-center gap-1.5`}>
                 <Phone size={18} className="shrink-0" />
                 1300
               </span>
             </a>
           </div>
        </section>

        <div className="flex flex-col items-center gap-6 md:gap-8 mt-4 w-full">
          <p className="text-center text-[10px] md:text-xs text-slate-400 max-w-sm md:max-w-md leading-relaxed px-4">
            *ผลลัพธ์นี้เป็นการประเมินเบื้องต้นจากข้อมูลที่คุณให้มาเท่านั้น ไม่สามารถรับรองความปลอดภัยได้ 100% โปรดตรวจสอบกับกรมการจัดหางานโดยตรงอีกครั้ง
          </p>

          {/* Share & Download actions */}
          <div className="flex flex-col items-center gap-3 w-full max-w-sm no-print">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Share2 size={12} /> แชร์ให้เพื่อน
            </p>
            <div className="flex flex-wrap gap-2 md:gap-3 w-full px-4 md:px-0">
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent("https://checkgonbin.in.th")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#06C755] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 min-w-25"
              >
                LINE
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://checkgonbin.in.th")}`}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-[#1877F2] text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 min-w-25"
              >
                Facebook
              </a>
              <button
                onClick={() => {
                  navigator.clipboard.writeText("https://checkgonbin.in.th");
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="w-full md:flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
              >
                {copied ? <><Check size={15} /> คัดลอกแล้ว</> : <><Copy size={15} /> คัดลอกลิงก์</>}
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full px-4 no-print">
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-slate-950 text-slate-950 rounded-2xl font-bold hover:bg-slate-50 transition-all active:scale-95"
            >
              <Printer className="w-4.5 h-4.5 md:w-5 md:h-5" />
              พิมพ์รายงาน / บันทึก PDF
            </button>

            <Link href="/" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95">
              <RotateCcw className="w-4.5 h-4.5 md:w-5 md:h-5" />
              ตรวจสอบใหม่
            </Link>
          </div>
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
        <div role="status" className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
          <p className="text-slate-500">กำลังโหลดผลลัพธ์...</p>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}
