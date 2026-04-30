"use client";

import { motion } from "framer-motion";
import { Shield, ArrowRight, CheckCircle2, AlertCircle, ShieldCheck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-white py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* LEFT CONTENT */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full w-fit border border-slate-200 shadow-sm">
              <Shield size={16} className="text-brand-secondary" />
              <span className="text-xs font-bold text-brand-secondary uppercase tracking-wider">
                เครื่องมือตรวจสอบความเสี่ยงทางการเงิน
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold text-brand-secondary leading-[1.1] tracking-tight">
              เช็คก่อนบิน<br />
              เช็คให้ชัวร์<br />
              <span className="text-brand-primary">ก่อนโอนเงิน</span>
            </h1>

            {/* Subheadline */}
            <div className="flex flex-col gap-2">
              <p className="text-xl md:text-2xl font-medium text-brand-secondary/80">
                ตรวจสอบความเสี่ยงเบื้องต้น ก่อนตัดสินใจไปทำงานต่างประเทศ
              </p>
              <p className="text-lg text-slate-500">
                หางานเกาหลี ญี่ปุ่น หรือไต้หวัน เช็คให้ชัวร์ก่อนโอนเงิน
              </p>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-signal-green" />
                <span className="text-sm font-bold text-brand-secondary">เช็คความน่าเชื่อถือ</span>
              </div>
              <div className="flex items-center gap-2">
                <AlertCircle size={18} className="text-signal-orange" />
                <span className="text-sm font-bold text-brand-secondary">ประเมินความเสี่ยง</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-blue-500" />
                <span className="text-sm font-bold text-brand-secondary">ปลอดภัย เป็นส่วนตัว</span>
              </div>
            </div>

            {/* CTA Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 flex items-center justify-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full text-xl font-bold shadow-lg shadow-brand-primary/20 hover:shadow-xl transition-all w-fit group"
              onClick={() => document.getElementById('risk-assessment')?.scrollIntoView({ behavior: 'smooth' })}
            >
              เริ่มตรวจสอบเลย
              <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </motion.div>

          {/* RIGHT VISUAL AREA */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Main Image Container */}
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white">
              <img
                src="/two-attractive-asian-businessman-businesswoman-hand-gesture-wave-greeting-goodbye-social-distancing-departure-airport-terminal.jpeg"
                alt="แรงงานไทยที่สนามบิน - ตรวจสอบก่อนไปทำงานต่างประเทศ"
                className="w-full aspect-[4/5] object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
            </div>

            {/* Overlay UI Elements */}
            
            {/* Risk Assessment Mockup */}
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -right-4 top-1/4 w-48 bg-white/95 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-slate-100 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Risk Report</span>
                <div className="w-2 h-2 rounded-full bg-signal-green animate-pulse" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-800">ผลการประเมินความเสี่ยง</span>
                <span className="text-2xl font-black text-signal-green">ต่ำ (Low)</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="w-1/4 h-full bg-signal-green" />
              </div>
            </motion.div>

            {/* Floating Shield Icon */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="absolute -left-6 bottom-1/4 p-4 bg-brand-secondary text-white rounded-2xl shadow-2xl"
            >
              <ShieldCheck size={32} />
            </motion.div>

            {/* Subtle Security Element */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -bottom-10 -right-6 w-32 h-32 border-4 border-brand-primary/20 rounded-full border-dashed animate-spin-slow"
            />
          </motion.div>

        </div>
      </div>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Hero;
