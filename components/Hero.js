"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full bg-white py-6 md:py-10 border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-3 md:gap-4 max-w-3xl">

        <div className="inline-flex items-center gap-1.5 md:gap-2 px-2.5 py-1 bg-slate-100 rounded-full w-fit border border-slate-200 shadow-sm">
          <Shield size={14} className="text-brand-secondary shrink-0" />
          <span className="text-[10px] md:text-xs font-bold text-brand-secondary uppercase tracking-wider">
            ฟรี • 2 นาที • ไม่เก็บข้อมูล
          </span>
        </div>

        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-brand-secondary leading-[1.15] md:leading-[1.1] tracking-tight"
        >
          ก่อนโอน ลองเช็คก่อน<br />
          <span className="text-brand-primary">เช็คก่อนบิน</span>
        </motion.h1>

        <p className="text-base md:text-xl text-slate-500 max-w-lg md:max-w-none">
          บริษัทนี้ถูกกฎหมายไหม? เรียกเก็บเงินล่วงหน้าแบบนี้ปกติไหม?
        </p>

      </div>
    </section>
  );
};

export default Hero;
