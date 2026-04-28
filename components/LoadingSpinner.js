"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ text = "กำลังโหลด..." }) {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-white/95 backdrop-blur-sm z-[9999]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        className="flex flex-col items-center gap-6 p-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="text-brand-primary" size={48} />
          </motion.div>
          {/* Layer 1: Subconscious pulse */}
          <motion.div
            className="absolute inset-0 bg-brand-primary/10 rounded-full blur-xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
        
        {/* Layer 2: Micro-copy */}
        <p className="text-slate-700 text-lg font-medium text-center max-w-[300px]">
          {text}
        </p>
        
        {/* CRA Indicator (Minimalist) */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-[10px] text-slate-400 uppercase tracking-tighter">
            Cognitive Processing
          </span>
          <div className="w-24 h-0.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-brand-primary/30"
              animate={{ x: [-100, 100] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
