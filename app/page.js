"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import { motion } from "framer-motion";
import { 
  Building2, 
  Phone, 
  Banknote, 
  UserRound, 
  ArrowRight, 
  ShieldAlert, 
  PenSquare, 
  CheckCircle2, 
  BarChart3,
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    agencyName: "",
    contactInfo: "",
    hasUpfrontFee: false,
    isSocialContact: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/check-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการประมวลผล");
      }

      const result = await response.json();
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (error) {
      setError("กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "เช็คก่อนบิน (ChekGonBin)",
    "operatingSystem": "All",
    "applicationCategory": "SafetyApplication",
    "description": "เครื่องมือตรวจสอบความเสี่ยงเบื้องต้นสำหรับผู้ที่กำลังหางานต่างประเทศ เพื่อป้องกันการโดนหลอกและมิจฉาชีพ",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "THB"
    },
    "featureList": [
      "ตรวจสอบชื่อบริษัทจัดหางาน",
      "ตรวจสอบบัญชีดำมิจฉาชีพ",
      "ประเมินความเสี่ยงเบื้องต้น",
      "รายงานเบาะแสมิจฉาชีพ"
    ]
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {isLoading && <LoadingSpinner text="กำลังวิเคราะห์ความเสี่ยง..." />}

      {/* Layer 1: Subconscious Hook - Clear Branding & Mission */}
      <header className="w-full bg-white border-b border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-brand-primary/10 rounded-2xl"
          >
            <ShieldAlert className="text-brand-primary" size={48} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight"
          >
            เช็คก่อนบิน ตรวจสอบบริษัทจัดหางาน <br className="hidden md:block" />
            <span className="text-brand-primary">ป้องกันมิจฉาชีพ</span> งานต่างประเทศ
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed"
          >
            ตรวจสอบความเสี่ยงเบื้องต้นก่อนตัดสินใจไปทำงานต่างประเทศ 
            <span className="block font-medium text-slate-900 mt-2">หางานเกาหลี ญี่ปุ่น หรือไต้หวัน เช็คให้ชัวร์ก่อนโอนเงิน</span>
          </motion.p>
          
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col gap-12 max-w-4xl">
        
        {/* Layer 2: Chunked Gateway - Contextual Problem */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            whileHover={{ y: -2 }}
            className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4"
          >
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BarChart3 className="text-brand-primary" size={20} />
              ความเป็นจริงของปัญหา
            </h2>
            <p className="text-slate-600 leading-relaxed">
              ในปี 2567 แรงงานไทยกว่า 1,000 คน ตกเป็นเหยื่อการหลอกลวง 
              เสียหายรวมกว่า <span className="font-bold text-brand-primary text-lg">44.2 ล้านบาท</span>
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -2 }}
            className="p-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex flex-col gap-4"
          >
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="text-brand-primary" size={20} />
              วิธีการป้องกัน
            </h2>
            <p className="text-slate-600 leading-relaxed">
              การตรวจสอบอย่างรอบคอบก่อนตัดสินใจเป็นวิธีที่ดีที่สุดในการปกป้องตัวเองจากมิจฉาชีพ
            </p>
          </motion.div>
        </section>

        {/* Layer 3: Conscious Deep-Dive - The Action Tool */}
        <section className="relative">
          {/* Glow halo behind the card */}
          <div className="absolute -inset-3 bg-brand-primary/10 rounded-[2.5rem] blur-2xl pointer-events-none" />

          <div className="relative bg-white border-2 border-brand-primary/25 rounded-3xl overflow-hidden shadow-2xl shadow-brand-primary/10">
            {/* Thick gradient top bar */}
            <div className="h-2 bg-linear-to-r from-brand-primary via-orange-400 to-brand-primary w-full" />

            <div className="p-8 md:p-12">
              <div className="flex items-start justify-between gap-4 mb-10 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-primary/10 rounded-xl">
                    <PenSquare className="text-brand-primary" size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-2xl font-bold text-slate-900">ประเมินความเสี่ยง</h3>
                      <span className="px-2.5 py-0.5 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                        บริการหลัก
                      </span>
                    </div>
                    <p className="text-slate-500 text-sm">กรอกข้อมูลเท่าที่มีเพื่อเริ่มการวิเคราะห์</p>
                  </div>
                </div>
                {/* DOE data badge */}
                <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full shrink-0">
                  <CheckCircle2 className="text-signal-green" size={13} />
                  <span className="text-[11px] font-bold text-green-700">ข้อมูลจากกรมการจัดหางาน</span>
                </div>
              </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-8 max-w-full">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <ShieldAlert size={16} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                    1. ชื่อบริษัทจัดหางาน
                    <span className="text-[10px] font-normal normal-case tracking-normal text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      เทียบกับ DOE whitelist
                    </span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="เช่น บจก. จัดหางาน..."
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                      value={formData.agencyName}
                      onChange={(e) => handleInputChange("agencyName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">
                    2. ช่องทางติดต่อ (เบอร์/LINE/Email)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="เช่น 081-xxx-xxxx"
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none"
                      value={formData.contactInfo}
                      onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-4 p-4 md:p-6 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors group">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded-md border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                    checked={formData.hasUpfrontFee}
                    onChange={(e) => handleInputChange("hasUpfrontFee", e.target.checked)}
                  />
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg transition-colors ${formData.hasUpfrontFee ? 'bg-brand-primary/10' : 'bg-slate-100'}`}>
                      <Banknote className={formData.hasUpfrontFee ? 'text-brand-primary' : 'text-slate-400'} size={20} />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800">มีการเรียกเก็บเงินล่วงหน้า</span>
                      <span className="text-sm text-slate-500">เช่น ค่าหัว, ค่าดำเนินการที่ต้องจ่ายทันที</span>
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-4 p-4 md:p-6 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors group">
                  <input
                    type="checkbox"
                    className="w-6 h-6 rounded-md border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                    checked={formData.isSocialContact}
                    onChange={(e) => handleInputChange("isSocialContact", e.target.checked)}
                  />
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`p-2 rounded-lg transition-colors ${formData.isSocialContact ? 'bg-brand-primary/10' : 'bg-slate-100'}`}>
                      <UserRound className={formData.isSocialContact ? 'text-brand-primary' : 'text-slate-400'} size={20} />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800">ติดต่อผ่านโซเชียลมีเดียส่วนตัว</span>
                      <span className="text-sm text-slate-500">Facebook ส่วนตัว, กลุ่มลับ, หรือโปรไฟล์ที่ไม่มีตัวตนชัดเจน</span>
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-6 bg-brand-primary text-white rounded-2xl font-bold text-xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? "กำลังประมวลผล..." : "วิเคราะห์ความเสี่ยง"}
                <ArrowRight size={24} />
              </button>
            </form>
          </div>
        </div>
        </section>

        {/* Cognitive Breather - Whitespace at the bottom */}
        <div className="h-12" />
      </div>
    </div>
  );
}
