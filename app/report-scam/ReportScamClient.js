"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  CheckCircle2,
  ArrowRight,
  Building2,
  UserRound,
  Phone,
  FileText,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function ReportScamClient() {
  const [formData, setFormData] = useState({
    agencyName: "",
    contactPerson: "",
    contactInfo: "",
    evidence: "",
    description: "",
    reporterName: "",
    reporterPhone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await fetch("/api/report-scam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการส่งรายงาน");
      }

      setStatus({
        type: "success",
        message: "ขอบคุณสำหรับการรายงาน เราจะตรวจสอบและอัปเดตฐานข้อมูล",
      });

      setFormData({
        agencyName: "",
        contactPerson: "",
        contactInfo: "",
        evidence: "",
        description: "",
        reporterName: "",
        reporterPhone: "",
      });
    } catch (error) {
      setStatus({
        type: "error",
        message: "เกิดข้อผิดพลาดในการประมวลผล กรุณาลองใหม่อีกครั้ง",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">

      <header className="w-full bg-white border-b border-slate-100 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-brand-primary/10 rounded-[2rem]"
          >
            <Bell className="text-brand-primary" size={48} aria-hidden="true" />
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            รายงานข้อมูลเบาะแสใหม่
          </h1>

          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            ช่วยเราสร้างฐานข้อมูลที่ปลอดภัยยิ่งขึ้น โดยแบ่งปันข้อมูลเกี่ยวกับบริษัทหรือนายหน้าที่น่าสงสัย
          </p>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-12 flex flex-col gap-12 max-w-3xl">

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 bg-brand-primary/5 border border-brand-primary/10 rounded-[2rem] flex items-start gap-4"
        >
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <ShieldCheck className="text-brand-primary" size={24} aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900">ข้อมูลจะถูกเก็บเป็นความลับ</h2>
            <p className="text-sm text-slate-600">เราเคารพความเป็นส่วนตัวของคุณและจะไม่เปิดเผยข้อมูลส่วนบุคคลต่อสาธารณะ</p>
          </div>
        </motion.section>

        <section className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-xl">
          <div className="h-2 bg-brand-primary w-full" />
          <div className="p-8 md:p-12 flex flex-col gap-10">

            <form onSubmit={handleSubmit} className="flex flex-col gap-10">

              {status.message && (
                <div
                  role="alert"
                  className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
                    status.type === "success" ? "bg-green-50 border-green-100 text-green-700" : "bg-red-50 border-red-100 text-red-700"
                  }`}
                >
                  {status.type === "success" ? <CheckCircle2 size={18} aria-hidden="true" /> : <AlertCircle size={18} aria-hidden="true" />}
                  {status.message}
                </div>
              )}

              <fieldset className="flex flex-col gap-6 border-0 p-0 m-0">
                <legend className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 w-full">
                  ข้อมูลบริษัท/นายหน้า
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="report-agencyName" className="text-sm font-extrabold text-slate-700">
                      ชื่อบริษัท/นายหน้า <span className="text-red-500" aria-label="จำเป็น">*</span>
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                      <input
                        id="report-agencyName"
                        required
                        type="text"
                        placeholder="เช่น บจก. จัดหางาน ABC"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition-all"
                        value={formData.agencyName}
                        onChange={(e) => handleInputChange("agencyName", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="report-contactPerson" className="text-sm font-extrabold text-slate-700">
                      ชื่อผู้ติดต่อ (ถ้ามี)
                    </label>
                    <div className="relative">
                      <UserRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                      <input
                        id="report-contactPerson"
                        type="text"
                        placeholder="เช่น นายสมชาย"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition-all"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange("contactPerson", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="report-contactInfo" className="text-sm font-extrabold text-slate-700">
                    เบอร์โทรศัพท์/Email/LINE ID
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                    <input
                      id="report-contactInfo"
                      type="text"
                      placeholder="081-xxx-xxxx หรือ @lineid"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition-all"
                      value={formData.contactInfo}
                      onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-6 border-0 p-0 m-0">
                <legend className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 w-full">
                  หลักฐานและรายละเอียด
                </legend>

                <div className="flex flex-col gap-2">
                  <label htmlFor="report-evidence" className="text-sm font-extrabold text-slate-700">
                    รูปแบบหลักฐาน <span className="text-red-500" aria-label="จำเป็น">*</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                    <input
                      id="report-evidence"
                      required
                      type="text"
                      placeholder="เช่น ภาพสกรีนแชต, ข้อความ SMS, บันทึกการโอนเงิน"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition-all"
                      value={formData.evidence}
                      onChange={(e) => handleInputChange("evidence", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="report-description" className="text-sm font-extrabold text-slate-700">
                    รายละเอียดการหลอกลวง <span className="text-red-500" aria-label="จำเป็น">*</span>
                  </label>
                  <textarea
                    id="report-description"
                    required
                    placeholder="อธิบายพฤติกรรมที่น่าสงสัย เช่น เรียกเก็บเงินก่อน, ไม่ยอมให้ดูใบอนุญาต, ให้ไปทำงานที่ไม่มีจริง"
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition-all min-h-[120px] resize-none"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
                </div>
              </fieldset>

              <fieldset className="flex flex-col gap-6 border-0 p-0 m-0">
                <legend className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-50 pb-2 w-full">
                  ข้อมูลผู้รายงาน (เก็บเป็นความลับ)
                </legend>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="report-reporterName" className="text-sm font-extrabold text-slate-700">
                      ชื่อของคุณ (ไม่บังคับ)
                    </label>
                    <input
                      id="report-reporterName"
                      type="text"
                      placeholder="ชื่อ-นามสกุล"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition-all"
                      value={formData.reporterName}
                      onChange={(e) => handleInputChange("reporterName", e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="report-reporterPhone" className="text-sm font-extrabold text-slate-700">
                      เบอร์โทรศัพท์ (ไม่บังคับ)
                    </label>
                    <input
                      id="report-reporterPhone"
                      type="text"
                      placeholder="08x-xxx-xxxx"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:border-brand-primary outline-none transition-all"
                      value={formData.reporterPhone}
                      onChange={(e) => handleInputChange("reporterPhone", e.target.value)}
                    />
                  </div>
                </div>
              </fieldset>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-brand-primary text-white rounded-[2rem] font-extrabold text-lg shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                aria-busy={isLoading}
              >
                {isLoading ? "กำลังส่งข้อมูล..." : "ส่งรายงานเบาะแส"}
                <ArrowRight size={20} aria-hidden="true" />
              </button>
            </form>
          </div>
        </section>

        <div className="h-16" />
      </div>
    </div>
  );
}
