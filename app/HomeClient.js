"use client";

import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import { trackEvent } from "@/utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, 
  Phone, 
  Banknote, 
  UserRound, 
  ArrowRight, 
  ShieldAlert, 
  PenSquare, 
  CheckCircle2, 
  HelpCircle,
  ChevronDown,
  RefreshCw,
  AlertTriangle,
  X
} from "lucide-react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    agencyName: "",
    contactInfo: "",
    hasUpfrontFee: false,
    isSocialContact: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showAdvancedSignals, setShowAdvancedSignals] = useState(false);
  const [showScamWarningModal, setShowScamWarningModal] = useState(true);
  const [experimentVariant, setExperimentVariant] = useState("B");
  const hasTrackedExperimentView = useRef(false);
  const hasStartedSearchEventRef = useRef(false);

  // Autocomplete states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [recoverySuggestions, setRecoverySuggestions] = useState([]);

  const isPaidTraffic = useMemo(() => {
    const utmSource = searchParams?.get("utm_source")?.toLowerCase() || "";
    const utmMedium = searchParams?.get("utm_medium")?.toLowerCase() || "";
    const fbclid = searchParams?.get("fbclid");
    return (
      utmMedium.includes("paid") ||
      utmSource.includes("fb") ||
      utmSource.includes("facebook") ||
      utmSource.includes("ig") ||
      !!fbclid
    );
  }, [searchParams]);

  useEffect(() => {
    fetch("/api/agencies?q=&page=1")
      .then((r) => r.json())
      .then((json) => { if (json.last_updated) setLastUpdated(json.last_updated); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const forcedVariant = (searchParams?.get("exp_home") || "").toUpperCase();
    const storedVariant = window.localStorage.getItem("cgb_home_variant");
    const fallbackVariant = Math.random() < 0.5 ? "A" : "B";

    const variant = ["A", "B"].includes(forcedVariant)
      ? forcedVariant
      : ["A", "B"].includes(storedVariant)
      ? storedVariant
      : fallbackVariant;

    window.localStorage.setItem("cgb_home_variant", variant);
    queueMicrotask(() => {
      setExperimentVariant(variant);
      setShowAdvancedSignals(variant === "A");
    });

    if (!hasTrackedExperimentView.current) {
      trackEvent("home_experiment_view", {
        variant,
        paid_traffic: isPaidTraffic ? "yes" : "no",
      });
      hasTrackedExperimentView.current = true;
    }
  }, [searchParams, isPaidTraffic]);

  // Debounced search for Whitelist Autocomplete
  useEffect(() => {
    const query = formData.agencyName.trim();
    if (query.length < 2) {
      const clearTimer = setTimeout(() => {
        setSuggestions([]);
        setShowSuggestions(false);
      }, 0);
      return () => clearTimeout(clearTimer);
    }

    if (selectedAgency && selectedAgency.name_th === query) {
      return;
    }

    const initTimer = setTimeout(() => {
      setIsSearchingSuggestions(true);
    }, 0);

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/agencies?q=${encodeURIComponent(query)}&page=1`);
        if (response.ok) {
          const res = await response.json();
          setSuggestions(res.data || []);
          setShowSuggestions(true);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 300);

    return () => {
      clearTimeout(initTimer);
      clearTimeout(timer);
    };
  }, [formData.agencyName, selectedAgency]);

  useEffect(() => {
    const query = formData.agencyName.trim();
    if (query.length >= 2 && !hasStartedSearchEventRef.current) {
      trackEvent("home_search_start", {
        variant: experimentVariant,
        paid_traffic: isPaidTraffic ? "yes" : "no",
      });
      hasStartedSearchEventRef.current = true;
    }
    if (query.length < 2 && hasStartedSearchEventRef.current) {
      hasStartedSearchEventRef.current = false;
    }
  }, [formData.agencyName, experimentVariant, isPaidTraffic]);

  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === "agencyName") {
      setSelectedAgency(null);
    }
  }, []);

  const handleSelectSuggestion = useCallback((agency) => {
    setFormData((prev) => ({ ...prev, agencyName: agency.name_th }));
    setSelectedAgency(agency);
    setSuggestions([]);
    setShowSuggestions(false);
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    trackEvent("home_submit_primary", {
      variant: experimentVariant,
      paid_traffic: isPaidTraffic ? "yes" : "no",
      selected_agency: selectedAgency ? "yes" : "no",
      has_advanced: showAdvancedSignals ? "yes" : "no",
      has_contact: formData.contactInfo?.trim() ? "yes" : "no",
    });

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

  const agencyQuery = formData.agencyName.trim();
  const shouldShowPrecheck = agencyQuery.length >= 2;
  const noWhitelistMatchYet =
    shouldShowPrecheck &&
    !isSearchingSuggestions &&
    !selectedAgency &&
    suggestions.length === 0;

  useEffect(() => {
    const query = agencyQuery;
    if (!noWhitelistMatchYet || query.length < 4) {
      queueMicrotask(() => {
        setRecoverySuggestions([]);
      });
      return;
    }

    const reducedQuery = query
      .toLowerCase()
      .replace(/บริษัทจัดหางาน/g, "")
      .replace(/บริษัท/g, "")
      .replace(/จำกัด/g, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!reducedQuery || reducedQuery === query.toLowerCase()) {
      queueMicrotask(() => {
        setRecoverySuggestions([]);
      });
      return;
    }

    let mounted = true;
    fetch(`/api/agencies?q=${encodeURIComponent(reducedQuery)}&page=1`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((json) => {
        if (!mounted) return;
        setRecoverySuggestions((json.data || []).slice(0, 3));
      })
      .catch(() => {
        if (mounted) setRecoverySuggestions([]);
      });

    return () => {
      mounted = false;
    };
  }, [noWhitelistMatchYet, agencyQuery]);

  let precheckTone = "text-slate-500";
  let precheckText = "พิมพ์ชื่อเพื่อเช็คเบื้องต้นกับ Whitelist";

  if (selectedAgency) {
    precheckTone = "text-green-700";
    precheckText = "พบใน Whitelist เบื้องต้นแล้ว (จากรายการที่เลือก)";
  } else if (shouldShowPrecheck && isSearchingSuggestions) {
    precheckTone = "text-blue-700";
    precheckText = "กำลังตรวจสอบรายชื่อใน Whitelist...";
  } else if (shouldShowPrecheck && suggestions.length > 0) {
    precheckTone = "text-amber-700";
    precheckText = "พบชื่อใกล้เคียง โปรดเลือกจากรายการเพื่อยืนยัน";
  } else if (noWhitelistMatchYet) {
    precheckTone = "text-red-700";
    precheckText = "ยังไม่พบใน Whitelist เบื้องต้น";
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {isLoading && <LoadingSpinner text="กำลังวิเคราะห์ความเสี่ยง..." />}

      <AnimatePresence>
        {showScamWarningModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="คำเตือนภัยมิจฉาชีพ"
          >
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-white border border-amber-200 rounded-2xl p-5 md:p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-amber-100">
                    <AlertTriangle className="text-amber-600 w-5 h-5" aria-hidden="true" />
                  </div>
                  <p className="text-base md:text-lg font-extrabold text-amber-900">
                    รู้ทันกลโกง: มิจฉาชีพขโมยตัวตนบริษัทจริง
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowScamWarningModal(false)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="ปิดหน้าต่างคำเตือน"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-3 text-sm md:text-base text-slate-700 leading-relaxed">
                <p>
                  มิจฉาชีพมักนำ <strong>ชื่อบริษัท และชื่อผู้มีอำนาจลงนามนิติบุคคล</strong> ของบริษัทที่จดทะเบียนถูกกฎหมาย
                  ไปสร้างเว็บไซต์ปลอมหรือเพจ Facebook ปลอม แล้วใส่เบอร์โทรและช่องทางติดต่อของตัวเองแทน
                </p>
                <p className="font-bold text-amber-900">
                  ✅ ให้ยึด <span className="underline underline-offset-2">เบอร์โทรทางการที่จดทะเบียนไว้</span> ด้านล่างเป็นหลัก
                  อย่าโทรหรือโอนเงินผ่านช่องทางอื่นที่ไม่ตรงกับข้อมูลในหน้านี้
                </p>
              </div>

              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowScamWarningModal(false)}
                  className="px-4 py-2 bg-brand-primary text-white font-bold rounded-lg hover:bg-brand-primary/90 transition-colors"
                >
                  รับทราบ
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 flex flex-col gap-8 md:gap-12 max-w-4xl">
        
        {/* Layer 3: Conscious Deep-Dive - The Action Tool */}
        <section id="risk-assessment">
          <div className="bg-white border-2 border-brand-primary/25 rounded-4xl md:rounded-5xl overflow-hidden">

            <div className="p-6 md:p-12">
              <div className="flex flex-col gap-3 mb-6 md:mb-8">
                <div className="flex items-center gap-3 md:gap-4">
                  <div className="p-2.5 md:p-3 bg-brand-primary/10 rounded-xl">
                    <PenSquare className="text-brand-primary w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 mb-1">ประเมินความเสี่ยง</h3>
                    <p className="text-slate-500 text-xs md:text-sm">
                      {isPaidTraffic
                        ? "เช็กชื่อบริษัทก่อนโอนเงินใน 10 วินาที"
                        : "กรอกข้อมูลเท่าที่มีเพื่อเริ่มการวิเคราะห์"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-slate-600">
                  <CheckCircle2 className="text-signal-green w-3.5 h-3.5" />
                  <span>ข้อมูลจากกรมการจัดหางาน</span>
                  {lastUpdated && (
                    <>
                      <span aria-hidden="true">•</span>
                      <span className="inline-flex items-center gap-1.5">
                        <RefreshCw className="text-blue-500 w-3.5 h-3.5" />
                        อัปเดตล่าสุด {new Date(lastUpdated).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" })}
                      </span>
                    </>
                  )}
                </div>
              </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-6 md:gap-8 max-w-full">
              {error && (
                <div role="alert" className="px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm flex items-center gap-2">
                  <ShieldAlert size={16} />
                  {error}
                </div>
              )}

              <div className="flex flex-col gap-2 relative">
                <label htmlFor="agencyName" className="text-[12px] md:text-sm font-bold text-slate-700 uppercase tracking-wide">
                  1. ชื่อบริษัทจัดหางาน
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                  <input
                    id="agencyName"
                    type="text"
                    placeholder="เช่น บริษัทจัดหางานบางกอกวินนิ่ง"
                    className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none text-base"
                    value={formData.agencyName}
                    onChange={(e) => handleInputChange("agencyName", e.target.value)}
                    onFocus={() => {
                      if (formData.agencyName.trim().length >= 2) {
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => setShowSuggestions(false)}
                    autoComplete="off"
                  />
                </div>
                <p className={`text-xs md:text-sm font-medium ${precheckTone}`}>{precheckText}</p>

                {selectedAgency && (
                  <div className="p-3 md:p-4 rounded-xl border border-green-200 bg-green-50/70 flex flex-col gap-2">
                    <p className="text-xs md:text-sm font-bold text-green-800">เบอร์ทางการของบริษัทที่เลือก</p>
                    {selectedAgency.phone ? (
                      <a
                        href={`tel:${String(selectedAgency.phone).replace(/\s/g, "")}`}
                        onClick={() => {
                          trackEvent("home_official_phone_click", {
                            agency_name: selectedAgency.name_th || "",
                            license_no: selectedAgency.license_no || "",
                          });
                        }}
                        className="w-fit inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-green-300 text-green-800 font-extrabold text-sm hover:bg-green-100 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        {selectedAgency.phone}
                        <span className="text-[10px] font-black uppercase tracking-wide px-1.5 py-0.5 rounded bg-green-100 border border-green-200">เบอร์ทางการ</span>
                      </a>
                    ) : (
                      <p className="text-xs md:text-sm text-amber-800 font-bold">ยังไม่พบเบอร์ทางการในรายการนี้ โปรดยืนยันผ่านหน้ารายชื่อบริษัทที่ได้รับอนุญาต</p>
                    )}
                    <p className="text-xs md:text-sm font-bold text-red-700">
                      เน้นย้ำ: โทรเฉพาะเบอร์ทางการนี้เท่านั้น อย่าใช้เบอร์หรือบัญชีที่ส่งมาในแชตส่วนตัว แม้ชื่อบริษัทจะดูตรงกัน
                    </p>
                  </div>
                )}

                {/* Autocomplete Dropdown */}
                <AnimatePresence>
                  {showSuggestions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute z-50 left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl max-h-48 md:max-h-60 overflow-y-auto"
                    >
                      {isSearchingSuggestions && (
                        <div className="p-4 text-sm text-slate-500 text-center flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin"></span>
                          กำลังค้นหา...
                        </div>
                      )}
                      {!isSearchingSuggestions && suggestions.length === 0 ? (
                        <div className="p-4 text-xs md:text-sm text-slate-500 text-center">
                          ไม่พบรายชื่อบริษัทจัดหางานในระบบ Whitelist
                        </div>
                      ) : (
                        suggestions.map((agency) => (
                          <motion.button
                            key={agency.juristic_id}
                            type="button"
                            whileHover={{ x: 4 }}
                            className="w-full text-left px-4 py-3 hover:bg-brand-primary/5 border-b border-slate-100 last:border-0 transition-all flex flex-col gap-1 focus:outline-none focus:bg-brand-primary/5"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectSuggestion(agency);
                            }}
                          >
                            <span className="font-bold text-slate-800 text-xs md:text-sm block">{agency.name_th}</span>
                            <div className="flex items-center gap-2 text-[10px] md:text-xs text-slate-500">
                              {agency.license_no && <span>ใบอนุญาตเลขที่: {agency.license_no}</span>}
                              {agency.province && <span>• {agency.province}</span>}
                            </div>
                            <div className="mt-1 text-[10px] md:text-xs text-green-700 font-bold flex items-center gap-1.5">
                              <Phone className="w-3 h-3" />
                              {agency.phone ? (
                                <>
                                  <span>เบอร์ทางการ: {agency.phone}</span>
                                  <span className="text-[9px] font-black uppercase tracking-wide px-1 py-0.5 rounded bg-green-100 border border-green-200">โทรเบอร์นี้เท่านั้น</span>
                                </>
                              ) : (
                                <span className="text-amber-700">ยังไม่พบเบอร์ทางการ</span>
                              )}
                            </div>
                          </motion.button>
                        ))
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {noWhitelistMatchYet && (
                  <div className="flex flex-col gap-2">
                    {recoverySuggestions.length > 0 && (
                      <div className="p-3 rounded-xl border border-slate-200 bg-white">
                        <p className="text-xs md:text-sm font-bold text-slate-700 mb-2">ชื่อใกล้เคียงที่อาจตรงกับที่คุณค้นหา</p>
                        <div className="flex flex-col gap-2">
                          {recoverySuggestions.map((agency) => (
                            <button
                              key={`recovery-${agency.juristic_id || agency.license_no || agency.name_th}`}
                              type="button"
                              onClick={() => handleSelectSuggestion(agency)}
                              className="text-left px-3 py-2 rounded-lg border border-slate-200 hover:border-brand-primary hover:bg-brand-primary/5 transition-colors"
                            >
                              <span className="block text-xs md:text-sm font-bold text-slate-800">{agency.name_th}</span>
                              {agency.license_no && <span className="block text-[11px] text-slate-500">ใบอนุญาต: {agency.license_no}</span>}
                              {agency.phone && <span className="block text-[11px] text-green-700 font-bold">เบอร์ทางการ: {agency.phone}</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href="/agencies"
                        className="text-xs md:text-sm font-bold text-brand-primary bg-brand-primary/5 border border-brand-primary/20 rounded-lg px-3 py-1.5 hover:bg-brand-primary/10 transition-colors"
                      >
                        ลองค้นหาในหน้าบริษัทที่ได้รับอนุญาต
                      </Link>
                      <Link
                        href="/report-scam"
                        className="text-xs md:text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5 hover:bg-red-100 transition-colors"
                      >
                        แจ้งเบาะแสเพื่อช่วยผู้อื่น
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 md:py-6 bg-brand-primary text-white rounded-2xl font-bold text-lg md:text-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:pointer-events-none"
              >
                {isLoading ? "กำลังประมวลผล..." : "เช็คเลย"}
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAdvancedSignals((prev) => {
                      const next = !prev;
                      trackEvent("home_expand_advanced", {
                        expanded: next ? "yes" : "no",
                        variant: experimentVariant,
                        paid_traffic: isPaidTraffic ? "yes" : "no",
                      });
                      return next;
                    });
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  {showAdvancedSignals ? "ซ่อนข้อมูลเสริมความแม่นยำ" : "เพิ่มข้อมูลเสริมเพื่อความแม่นยำ (ไม่บังคับ)"}
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedSignals ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence initial={false}>
                  {showAdvancedSignals && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-6 md:gap-8 pt-2">
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
                              className="w-full pl-11 pr-4 py-3.5 md:py-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10 transition-all outline-none text-base"
                              value={formData.contactInfo}
                              onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-3 md:gap-4">
                          <motion.div
                            whileHover={{ y: -1 }}
                            className={`flex items-start gap-3 md:gap-4 p-4 md:p-6 border rounded-2xl transition-all duration-300 group relative ${
                              formData.hasUpfrontFee
                                ? "border-brand-primary/30 bg-brand-primary/5"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="hasUpfrontFee"
                              className="w-5 h-5 md:w-6 md:h-6 mt-1 md:mt-0 rounded-md border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer transition-transform duration-200 hover:scale-105"
                              checked={formData.hasUpfrontFee}
                              onChange={(e) => handleInputChange("hasUpfrontFee", e.target.checked)}
                            />
                            <label htmlFor="hasUpfrontFee" className="flex items-center gap-3 md:gap-4 flex-1 cursor-pointer">
                              <div className={`p-2 rounded-lg transition-colors shrink-0 ${formData.hasUpfrontFee ? 'bg-brand-primary/10' : 'bg-slate-100'}`}>
                                <Banknote className={`${formData.hasUpfrontFee ? 'text-brand-primary' : 'text-slate-400'} w-4.5 h-4.5 md:w-5 md:h-5`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="block font-bold text-slate-800 text-sm md:text-base">มีการเรียกเก็บเงินล่วงหน้า</span>
                                  <div className="relative group/tooltip inline-block">
                                    <button
                                      type="button"
                                      className="text-slate-400 hover:text-brand-primary transition-colors focus:outline-none p-0.5"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                    >
                                      <HelpCircle size={14} className="md:w-4 md:h-4 w-3.5 h-3.5" />
                                    </button>
                                    <div className="pointer-events-none opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-[80vw] p-3 bg-slate-900 text-white text-xs rounded-lg z-50 leading-relaxed">
                                      <span className="font-bold block mb-1">สิ่งที่เป็นเงินล่วงหน้า:</span>
                                      เรียกเก็บค่าธรรมเนียมจัดหางานล่วงหน้า, ค่ามัดจำเอกสาร, ค่าตั๋วเครื่องบิน หรือค่าตรวจสุขภาพล่วงหน้าโดยไม่ได้ผ่านกรมการจัดหางานอย่างถูกต้อง
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                                    </div>
                                  </div>
                                </div>
                                <span className="text-xs md:text-sm text-slate-500">เช่น ค่าหัว, ค่าดำเนินการที่ต้องจ่ายทันที</span>
                              </div>
                            </label>
                          </motion.div>

                          <motion.div
                            whileHover={{ y: -1 }}
                            className={`flex items-start gap-3 md:gap-4 p-4 md:p-6 border rounded-2xl transition-all duration-300 group relative ${
                              formData.isSocialContact
                                ? "border-brand-primary/30 bg-brand-primary/5"
                                : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50 bg-white"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id="isSocialContact"
                              className="w-5 h-5 md:w-6 md:h-6 mt-1 md:mt-0 rounded-md border-slate-300 text-brand-primary focus:ring-brand-primary cursor-pointer transition-transform duration-200 hover:scale-105"
                              checked={formData.isSocialContact}
                              onChange={(e) => handleInputChange("isSocialContact", e.target.checked)}
                            />
                            <label htmlFor="isSocialContact" className="flex items-center gap-3 md:gap-4 flex-1 cursor-pointer">
                              <div className={`p-2 rounded-lg transition-colors shrink-0 ${formData.isSocialContact ? 'bg-brand-primary/10' : 'bg-slate-100'}`}>
                                <UserRound className={`${formData.isSocialContact ? 'text-brand-primary' : 'text-slate-400'} w-4.5 h-4.5 md:w-5 md:h-5`} />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="block font-bold text-slate-800 text-sm md:text-base">ติดต่อผ่านโซเชียลมีเดียส่วนตัว</span>
                                  <div className="relative group/tooltip inline-block">
                                    <button
                                      type="button"
                                      className="text-slate-400 hover:text-brand-primary transition-colors focus:outline-none p-0.5"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                      }}
                                    >
                                      <HelpCircle size={14} className="md:w-4 md:h-4 w-3.5 h-3.5" />
                                    </button>
                                    <div className="pointer-events-none opacity-0 group-hover/tooltip:opacity-100 group-focus-within/tooltip:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 max-w-[80vw] p-3 bg-slate-900 text-white text-xs rounded-lg z-50 leading-relaxed">
                                      <span className="font-bold block mb-1">พฤติกรรมที่มีความเสี่ยง:</span>
                                      การพูดคุย ชักชวน หรือส่งต่อเอกสารทางข้อความส่วนตัว (เช่น Facebook ส่วนตัว, LINE ส่วนตัว, TikTok DM) ของบุคคลที่ไม่สามารถตรวจสอบสถานะนิติบุคคลของบริษัทได้
                                      <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
                                    </div>
                                  </div>
                                </div>
                                <span className="text-xs md:text-sm text-slate-500">Facebook ส่วนตัว, กลุ่มลับ, หรือโปรไฟล์นิรนาม</span>
                              </div>
                            </label>
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </div>
        </div>
        </section>

        <div className="h-12" />
      </div>
    </div>
  );
}
