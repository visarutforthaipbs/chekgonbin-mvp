"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/Hero";
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
  HelpCircle,
  ChevronDown
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
  const [openFaq, setOpenFaq] = useState(null);

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

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "จะรู้ได้อย่างไรว่าบริษัทจัดหางานถูกกฎหมายหรือไม่?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "คุณสามารถตรวจสอบได้จากเลขที่ใบอนุญาตจัดหางาน และค้นหาในรายชื่อบริษัทที่ได้รับอนุญาตจากกรมการจัดหางาน (DOE) ซึ่งเครื่องมือเช็คก่อนบินของเราได้รวบรวมข้อมูลเหล่านี้ไว้ให้แล้ว"
        }
      },
      {
        "@type": "Question",
        "name": "สัญญาณเตือนว่ากำลังจะโดนหลอกไปทำงานต่างประเทศมีอะไรบ้าง?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "1. มีการเรียกเก็บเงินล่วงหน้าเป็นค่าดำเนินการ 2. ติดต่อผ่านช่องทางส่วนตัวที่ไม่สามารถยืนยันตัวตนได้ 3. สัญญาจ้างไม่ชัดเจนหรือไม่มีการทำสัญญาผ่านกรมการจัดหางาน"
        }
      }
    ]
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {isLoading && <LoadingSpinner text="กำลังวิเคราะห์ความเสี่ยง..." />}

      <Hero />

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-8 md:gap-12 max-w-4xl">
        
        {/* Layer 3: Conscious Deep-Dive - The Action Tool */}
        <section className="relative" id="risk-assessment">
          <div className="absolute -inset-2 md:-inset-3 bg-brand-primary/10 rounded-[2rem] md:rounded-[2.5rem] blur-2xl pointer-events-none" />

          <div className="relative bg-white border-2 border-brand-primary/25 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl shadow-brand-primary/10">
            <div className="h-1.5 md:h-2 bg-linear-to-r from-brand-primary via-orange-400 to-brand-primary w-full" />

            <div className="p-6 md:p-12">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8 md:mb-10 border-b border-slate-100 pb-6">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2.5 md:p-3 bg-brand-primary/10 rounded-xl">
                    <PenSquare className="text-brand-primary w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-xl md:text-2xl font-extrabold text-slate-900">ประเมินความเสี่ยง</h3>
                      <span className="px-2 py-0.5 bg-brand-primary text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest rounded-full">
                        บริการหลัก
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs md:text-sm">กรอกข้อมูลเท่าที่มีเพื่อเริ่มการวิเคราะห์</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full w-fit">
                  <CheckCircle2 className="text-signal-green w-3 h-3 md:w-[13px] md:h-[13px]" />
                  <span className="text-[10px] md:text-[11px] font-extrabold text-green-700">ข้อมูลจากกรมการจัดหางาน</span>
                </div>
              </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8 max-w-full">
              {error && (
                <div role="alert" className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm flex items-center gap-2">
                  <ShieldAlert size={16} />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <div className="flex flex-col gap-2">
                  <label htmlFor="agencyName" className="text-[12px] md:text-sm font-bold text-slate-700 uppercase tracking-wide flex flex-wrap items-center gap-2">
                    1. ชื่อบริษัทจัดหางาน
                    <span className="text-[10px] font-normal normal-case tracking-normal text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={11} />
                      เทียบ Whitelist
                    </span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                    <input
                      id="agencyName"
                      type="text"
                      placeholder="เช่น บจก. จัดหางาน..."
                      className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none text-base"
                      value={formData.agencyName}
                      onChange={(e) => handleInputChange("agencyName", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="contactInfo" className="text-[12px] md:text-sm font-bold text-slate-700 uppercase tracking-wide">
                    2. ช่องทางติดต่อ (เบอร์/LINE/Email)
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                    <input
                      id="contactInfo"
                      type="text"
                      placeholder="เช่น 081-xxx-xxxx"
                      className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all outline-none text-base"
                      value={formData.contactInfo}
                      onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:gap-4">
                <label className="flex items-start gap-3 md:gap-4 p-4 md:p-6 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 md:w-6 md:h-6 mt-1 md:mt-0 rounded-md border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                    checked={formData.hasUpfrontFee}
                    onChange={(e) => handleInputChange("hasUpfrontFee", e.target.checked)}
                  />
                  <div className="flex items-center gap-3 md:gap-4 flex-1">
                    <div className={`p-2 rounded-lg transition-colors shrink-0 ${formData.hasUpfrontFee ? 'bg-brand-primary/10' : 'bg-slate-100'}`}>
                      <Banknote className={`${formData.hasUpfrontFee ? 'text-brand-primary' : 'text-slate-400'} w-[18px] h-[18px] md:w-5 md:h-5`} />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800 text-sm md:text-base">มีการเรียกเก็บเงินล่วงหน้า</span>
                      <span className="text-xs md:text-sm text-slate-500">เช่น ค่าหัว, ค่าดำเนินการที่ต้องจ่ายทันที</span>
                    </div>
                  </div>
                </label>

                <label className="flex items-start gap-3 md:gap-4 p-4 md:p-6 border border-slate-200 rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors group">
                  <input
                    type="checkbox"
                    className="w-5 h-5 md:w-6 md:h-6 mt-1 md:mt-0 rounded-md border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                    checked={formData.isSocialContact}
                    onChange={(e) => handleInputChange("isSocialContact", e.target.checked)}
                  />
                  <div className="flex items-center gap-3 md:gap-4 flex-1">
                    <div className={`p-2 rounded-lg transition-colors shrink-0 ${formData.isSocialContact ? 'bg-brand-primary/10' : 'bg-slate-100'}`}>
                      <UserRound className={`${formData.isSocialContact ? 'text-brand-primary' : 'text-slate-400'} w-[18px] h-[18px] md:w-5 md:h-5`} />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800 text-sm md:text-base">ติดต่อผ่านโซเชียลมีเดียส่วนตัว</span>
                      <span className="text-xs md:text-sm text-slate-500">Facebook ส่วนตัว, กลุ่มลับ, หรือโปรไฟล์นิรนาม</span>
                    </div>
                  </div>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 md:py-6 bg-brand-primary text-white rounded-2xl font-bold text-lg md:text-xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? "กำลังประมวลผล..." : "เช็คเลย — ฟรี"}
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </form>
          </div>
        </div>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <motion.div
            whileHover={{ y: -2 }}
            className="p-6 md:p-8 bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] shadow-sm flex flex-col gap-3 md:gap-4"
          >
            <h2 className="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <BarChart3 className="text-brand-primary w-[18px] h-[18px] md:w-5 md:h-5" />
              ความเป็นจริงของปัญหา
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              ทุก 9 ชั่วโมง มีคนไทยคนหนึ่งโดนหลอกไปทำงานต่างประเทศ
              ปี 2567 เสียหายรวมกว่า <span className="font-extrabold text-brand-primary text-lg">44 ล้านบาท</span>
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="p-6 md:p-8 bg-white border border-slate-100 rounded-[1.5rem] md:rounded-[2rem] shadow-sm flex flex-col gap-3 md:gap-4"
          >
            <h2 className="text-lg md:text-xl font-extrabold text-slate-800 flex items-center gap-2">
              <CheckCircle2 className="text-brand-primary w-[18px] h-[18px] md:w-5 md:h-5" />
              วิธีการป้องกัน
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              การตรวจสอบอย่างรอบคอบก่อนตัดสินใจเป็นวิธีที่ดีที่สุดในการปกป้องตัวเองจากมิจฉาชีพ
            </p>
          </motion.div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="flex flex-col gap-6 md:gap-8 py-8 md:py-12 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <HelpCircle className="text-brand-primary w-6 h-6 md:w-7 md:h-7" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">คำถามที่พบบ่อย (FAQ)</h2>
          </div>

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
              <div key={index} className="bg-white border border-slate-200 rounded-xl md:rounded-2xl shadow-sm overflow-hidden">
                <button
                  type="button"
                  className="w-full text-left px-5 md:px-6 py-4 md:py-5 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="text-base md:text-lg font-bold text-slate-900 leading-tight">{faq.q}</h3>
                  <ChevronDown
                    className={`text-slate-400 shrink-0 transition-transform duration-200 w-[18px] h-[18px] md:w-5 md:h-5 ${openFaq === index ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {openFaq === index && (
                  <div id={`faq-answer-${index}`} className="px-5 md:px-6 pb-5 md:pb-6">
                    <p className="text-slate-600 text-sm md:text-base leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="h-12" />
      </div>
    </div>
  );
}
