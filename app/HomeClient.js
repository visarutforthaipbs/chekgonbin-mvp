"use client";

import { useState, useCallback, useEffect, useMemo, useRef, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { trackEvent } from "@/utils/analytics";
import { motion, AnimatePresence } from "framer-motion";
import ScamNotice from "@/components/ScamNotice";
import { parsePhones } from "@/utils/phone";
import {
  Building2,
  Phone,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  AlertCircle,
  Loader2,
  SearchX,
  Copy,
  Check,
  HelpCircle,
  Database,
} from "lucide-react";

const RISK_SIGNALS = [
  {
    id: "hasUpfrontFee",
    title: "มีคนเรียกค่าสมัครหรือค่าบริการก่อนเดินทาง",
    hint: "เช่น ค่าหัว ค่าดำเนินการ ค่ามัดจำเอกสาร ที่ต้องจ่ายทันที",
    detail:
      "บริษัทที่ถูกกฎหมายเก็บค่าบริการได้ตามที่กรมการจัดหางานกำหนด และต้องออกใบเสร็จในนามบริษัท การจ่ายค่าหัว ค่ามัดจำ ค่าตั๋ว หรือค่าตรวจสุขภาพล่วงหน้าเข้าบัญชีบุคคล คือสัญญาณอันตราย",
  },
  {
    id: "isSocialContact",
    title: "ติดต่อผ่านโซเชียลส่วนตัว",
    hint: "เช่น Facebook ส่วนตัว กลุ่มลับ LINE ส่วนตัว หรือโปรไฟล์นิรนาม",
    detail:
      "การชักชวนหรือส่งเอกสารผ่านข้อความส่วนตัว (Facebook, LINE, TikTok DM) จากบุคคลที่ตรวจสอบตัวตนกับบริษัทไม่ได้ เป็นช่องทางที่มิจฉาชีพใช้บ่อยที่สุด",
  },
];

function formatThaiDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "Asia/Bangkok",
    });
  } catch {
    return "";
  }
}

function OfficialPhone({ agency }) {
  const [copied, setCopied] = useState(false);
  const phone = parsePhones(agency.phone)[0];
  if (!phone) {
    return (
      <p className="text-callout text-caution-ink font-medium">
        ยังไม่มีเบอร์ทางการของบริษัทนี้ในระบบ ตรวจสอบเพิ่มเติมได้ที่{" "}
        <Link href={`/agencies?q=${encodeURIComponent(agency.name_th || "")}`} className="underline underline-offset-2">
          หน้ารายชื่อบริษัท
        </Link>
      </p>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <a
        href={`tel:${phone.tel}`}
        onClick={() =>
          trackEvent("home_official_phone_click", {
            agency_name: agency.name_th || "",
            license_no: agency.license_no || "",
          })
        }
        className="btn flex-1 justify-start bg-safe-tint text-safe-ink hover:opacity-90"
      >
        <Phone size={18} aria-hidden="true" />
        <span className="tabular-nums">{phone.display}</span>
        <span className="ml-auto text-footnote font-medium">โทร</span>
      </a>
      <button
        type="button"
        className="icon-btn bg-fill"
        aria-label={copied ? "คัดลอกเบอร์แล้ว" : "คัดลอกเบอร์โทร"}
        onClick={() => {
          navigator.clipboard?.writeText(phone.display);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check size={18} className="text-safe-ink" aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
      </button>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listboxId = useId();
  const [formData, setFormData] = useState({
    agencyName: "",
    contactInfo: "",
    hasUpfrontFee: false,
    isSocialContact: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [agencyTotal, setAgencyTotal] = useState(null);
  const [showAdvancedSignals, setShowAdvancedSignals] = useState(false);
  const [openDetail, setOpenDetail] = useState(null);
  const [experimentVariant, setExperimentVariant] = useState("B");
  const hasTrackedExperimentView = useRef(false);
  const hasStartedSearchEventRef = useRef(false);

  // Autocomplete states
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
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
      .then((json) => {
        if (json.last_updated) setLastUpdated(json.last_updated);
        if (typeof json.total === "number") setAgencyTotal(json.total);
      })
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
          setSuggestions((res.data || []).slice(0, 6));
          setActiveIndex(-1);
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
    setActiveIndex(-1);
  }, []);

  const handleComboKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelectSuggestion(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    const hasAnyInput =
      formData.agencyName.trim() || formData.contactInfo.trim() || formData.hasUpfrontFee || formData.isSocialContact;
    if (!hasAnyInput) {
      setError("พิมพ์ชื่อบริษัทจัดหางานก่อน แล้วกด “เช็คเลย”");
      document.getElementById("agencyName")?.focus();
      return;
    }

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

      if (response.status === 429) {
        setError("ตรวจสอบบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่");
        setIsLoading(false);
        return;
      }
      if (!response.ok) {
        throw new Error("เกิดข้อผิดพลาดในการประมวลผล");
      }

      const result = await response.json();
      if (selectedAgency) {
        result.agency = {
          name_th: selectedAgency.name_th,
          license_no: selectedAgency.license_no,
          phone: parsePhones(selectedAgency.phone)[0]?.display || null,
        };
      } else if (formData.agencyName.trim()) {
        result.agency = { name_th: formData.agencyName.trim() };
      }
      router.push(`/result?data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (error) {
      setError("เชื่อมต่อไม่สำเร็จ ตรวจสอบอินเทอร์เน็ตแล้วกด “เช็คเลย” อีกครั้ง");
      setIsLoading(false);
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Thai Migrant Watch",
    operatingSystem: "All",
    applicationCategory: "SafetyApplication",
    description:
      "เครื่องมือตรวจสอบความเสี่ยงเบื้องต้นสำหรับผู้ที่กำลังหางานต่างประเทศ เพื่อป้องกันการโดนหลอกและมิจฉาชีพ",
    offers: { "@type": "Offer", price: "0", priceCurrency: "THB" },
    featureList: [
      "ตรวจสอบชื่อบริษัทจัดหางาน",
      "ตรวจสอบบัญชีดำมิจฉาชีพ",
      "ประเมินความเสี่ยงเบื้องต้น",
      "รายงานเบาะแสมิจฉาชีพ",
    ],
  };

  const agencyQuery = formData.agencyName.trim();
  const shouldShowPrecheck = agencyQuery.length >= 2;
  const noWhitelistMatchYet =
    shouldShowPrecheck && !isSearchingSuggestions && !selectedAgency && suggestions.length === 0;

  useEffect(() => {
    const query = agencyQuery;
    if (!noWhitelistMatchYet || query.length < 4) {
      queueMicrotask(() => setRecoverySuggestions([]));
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
      queueMicrotask(() => setRecoverySuggestions([]));
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

  // Pre-check status: icon + text + color (never color alone).
  let precheck = { tone: "text-label-2", Icon: null, text: "พิมพ์อย่างน้อย 2 ตัวอักษรเพื่อค้นในรายชื่อบริษัทที่ได้รับอนุญาต" };
  if (selectedAgency) {
    precheck = { tone: "text-safe-ink", Icon: CheckCircle2, text: "พบในรายชื่อบริษัทที่ได้รับอนุญาตจากกรมการจัดหางาน" };
  } else if (shouldShowPrecheck && isSearchingSuggestions) {
    precheck = { tone: "text-label-2", Icon: Loader2, text: "กำลังค้นหาในรายชื่อบริษัทที่ได้รับอนุญาต…", spin: true };
  } else if (shouldShowPrecheck && suggestions.length > 0) {
    precheck = { tone: "text-label-2", Icon: HelpCircle, text: "พบชื่อใกล้เคียง เลือกจากรายการเพื่อยืนยัน" };
  } else if (noWhitelistMatchYet) {
    precheck = { tone: "text-danger-ink", Icon: SearchX, text: "ไม่พบชื่อนี้ในรายชื่อบริษัทที่ได้รับอนุญาต" };
  }

  const comboOpen = showSuggestions && (isSearchingSuggestions || suggestions.length > 0);

  return (
    <div className="w-full flex flex-col items-center">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="w-full max-w-2xl px-4 md:px-6 pt-12 md:pt-20 pb-12 md:pb-20 flex flex-col gap-6 md:gap-8">
        {/* Header — states the ONE task of this screen */}
        <header className="flex flex-col gap-3 md:items-center md:text-center">
          <h2 className="text-title2 md:text-title1 font-bold text-label tracking-tight">
            <span className="text-accent-ink mr-2" aria-hidden="true">①</span>
            บริษัทมีใบอนุญาตไหม
          </h2>
          <p className="text-body text-label-2 md:max-w-lg">
            {isPaidTraffic
              ? "รู้ผลใน 10 วินาที ว่าบริษัทได้รับอนุญาตจริงหรือไม่"
              : "พิมพ์ชื่อบริษัทที่ชวนคุณไปทำงานต่างประเทศ เราจะเทียบกับรายชื่อของกรมการจัดหางานและรายงานมิจฉาชีพ"}
          </p>
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-footnote text-label-2 md:justify-center">
            <Database size={15} aria-hidden="true" />
            <span>
              ข้อมูลกรมการจัดหางาน{agencyTotal ? ` ${agencyTotal.toLocaleString("th-TH")} บริษัท` : ""}
            </span>
            {lastUpdated && (
              <>
                <span aria-hidden="true">·</span>
                <span>อัปเดต {formatThaiDate(lastUpdated)}</span>
              </>
            )}
          </p>
        </header>

        {/* The tool */}
        <section aria-labelledby="check-title" className="card p-5 md:p-8" style={{ boxShadow: "var(--shadow-raised)" }}>
          <h2 id="check-title" className="sr-only">
            แบบตรวจสอบความเสี่ยง
          </h2>
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="agencyName" className="text-headline font-bold text-label">
                ชื่อบริษัทจัดหางาน
              </label>

              <div className="relative">
                <Building2
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-label-3"
                  size={20}
                  aria-hidden="true"
                />
                <input
                  id="agencyName"
                  type="text"
                  role="combobox"
                  aria-expanded={comboOpen}
                  aria-controls={listboxId}
                  aria-autocomplete="list"
                  aria-activedescendant={activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined}
                  aria-describedby="agencyName-status"
                  aria-invalid={error && !agencyQuery ? "true" : undefined}
                  placeholder="เช่น จัดหางานบางกอกวินนิ่ง"
                  className="field pl-12"
                  value={formData.agencyName}
                  onChange={(e) => {
                    handleInputChange("agencyName", e.target.value);
                    if (error) setError("");
                  }}
                  onKeyDown={handleComboKeyDown}
                  onFocus={() => {
                    if (formData.agencyName.trim().length >= 2 && !selectedAgency) setShowSuggestions(true);
                  }}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                  autoComplete="off"
                  enterKeyHint="search"
                />

                {/* Suggestions — a real listbox, keyboard + touch */}
                <AnimatePresence>
                  {comboOpen && (
                    <motion.ul
                      id={listboxId}
                      role="listbox"
                      aria-label="บริษัทที่ได้รับอนุญาตที่ตรงกับคำค้น"
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-30 left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto rounded-2xl border border-separator bg-surface py-1"
                      style={{ boxShadow: "0 12px 40px rgba(0,0,0,.14)" }}
                    >
                      {isSearchingSuggestions && suggestions.length === 0 ? (
                        <li className="flex items-center gap-2 px-4 py-3 text-callout text-label-2">
                          <Loader2 size={18} className="animate-spin" aria-hidden="true" /> กำลังค้นหา…
                        </li>
                      ) : (
                        suggestions.map((agency, i) => (
                          <li
                            key={agency.juristic_id || `${agency.license_no}-${i}`}
                            id={`${listboxId}-opt-${i}`}
                            role="option"
                            aria-selected={i === activeIndex}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              handleSelectSuggestion(agency);
                            }}
                            onMouseEnter={() => setActiveIndex(i)}
                            className={`cursor-pointer px-4 py-3 min-h-11 flex flex-col gap-0.5 ${
                              i === activeIndex ? "bg-fill" : ""
                            }`}
                          >
                            <span className="text-callout font-bold text-label">{agency.name_th}</span>
                            <span className="text-footnote text-label-2">
                              {[agency.license_no && `ใบอนุญาต ${agency.license_no}`, agency.province]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          </li>
                        ))
                      )}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>

              <p id="agencyName-status" aria-live="polite" className={`flex items-start gap-1.5 text-footnote ${precheck.tone}`}>
                {precheck.Icon && (
                  <precheck.Icon size={16} className={`shrink-0 mt-0.5 ${precheck.spin ? "animate-spin" : ""}`} aria-hidden="true" />
                )}
                <span>{precheck.text}</span>
              </p>

              {/* Selected → the official phone is THE answer people need */}
              {selectedAgency && (
                <div className="mt-1 flex flex-col gap-2 rounded-2xl bg-surface-2 p-4">
                  <p className="text-footnote font-bold text-label-2">เบอร์ทางการที่จดทะเบียนกับกรมการจัดหางาน</p>
                  <OfficialPhone agency={selectedAgency} />
                  <p className="text-footnote text-label-2">
                    โทรเบอร์นี้เท่านั้น แม้ชื่อบริษัทในแชตจะตรงกัน — มิจฉาชีพมักแอบอ้างชื่อบริษัทจริง
                  </p>
                </div>
              )}

              {/* Not found → recovery, not a dead end */}
              {noWhitelistMatchYet && (
                <div className="mt-1 flex flex-col gap-3">
                  {recoverySuggestions.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <p className="text-footnote font-bold text-label-2">หรือหมายถึง</p>
                      <div className="inset-list">
                        {recoverySuggestions.map((agency) => (
                          <button
                            key={`recovery-${agency.juristic_id || agency.license_no || agency.name_th}`}
                            type="button"
                            onClick={() => handleSelectSuggestion(agency)}
                            className="w-full text-left px-4 py-3 min-h-11 hover:bg-fill transition-colors flex flex-col"
                          >
                            <span className="text-callout font-bold text-label">{agency.name_th}</span>
                            {agency.license_no && (
                              <span className="text-footnote text-label-2">ใบอนุญาต {agency.license_no}</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-footnote text-label-2">
                    ชื่อที่ไม่อยู่ในรายชื่อไม่ได้แปลว่าเป็นมิจฉาชีพเสมอไป ลองสะกดใหม่ หรือ{" "}
                    <Link href={`/agencies?q=${encodeURIComponent(agencyQuery)}`} className="text-accent-ink font-medium underline underline-offset-2">
                      ค้นในรายชื่อทั้งหมด
                    </Link>
                  </p>
                </div>
              )}
            </div>

            {/* Optional risk signals — progressive disclosure */}
            <div className="flex flex-col">
              <button
                type="button"
                aria-expanded={showAdvancedSignals}
                aria-controls="advanced-signals"
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
                className="flex min-h-11 items-center justify-between gap-3 rounded-xl text-left"
              >
                <span className="flex flex-col">
                  <span className="text-callout font-bold text-label">เพิ่มสิ่งที่เจอมา</span>
                  <span className="text-footnote text-label-2">ไม่บังคับ · ช่วยให้ผลแม่นขึ้น</span>
                </span>
                <ChevronDown
                  size={22}
                  className={`text-label-2 shrink-0 transition-transform duration-200 ${showAdvancedSignals ? "rotate-180" : ""}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence initial={false}>
                {showAdvancedSignals && (
                  <motion.div
                    id="advanced-signals"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-4 pt-3">
                      <fieldset className="inset-list">
                        <legend className="sr-only">สัญญาณความเสี่ยงที่พบ</legend>
                        {RISK_SIGNALS.map((s) => (
                          <div key={s.id} className="px-4 py-3">
                            <div className="flex items-start gap-3">
                              <input
                                type="checkbox"
                                id={s.id}
                                className="check mt-1"
                                checked={formData[s.id]}
                                onChange={(e) => handleInputChange(s.id, e.target.checked)}
                              />
                              <label htmlFor={s.id} className="flex-1 cursor-pointer min-h-11 -my-1 py-1">
                                <span className="block text-callout font-bold text-label">{s.title}</span>
                                <span className="block text-footnote text-label-2">{s.hint}</span>
                              </label>
                              <button
                                type="button"
                                className="icon-btn -mr-2 -my-1.5"
                                aria-expanded={openDetail === s.id}
                                aria-controls={`${s.id}-detail`}
                                aria-label={`ทำไม “${s.title}” จึงเสี่ยง`}
                                onClick={() => setOpenDetail(openDetail === s.id ? null : s.id)}
                              >
                                <HelpCircle size={20} aria-hidden="true" />
                              </button>
                            </div>
                            {openDetail === s.id && (
                              <p id={`${s.id}-detail`} className="mt-2 ml-[34px] text-footnote text-label-2">
                                {s.detail}
                              </p>
                            )}
                          </div>
                        ))}
                      </fieldset>

                      <div className="flex flex-col gap-2">
                        <label htmlFor="contactInfo" className="text-callout font-bold text-label">
                          เบอร์ / LINE / อีเมล ที่ติดต่อคุณมา
                        </label>
                        <div className="relative">
                          <Phone
                            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-label-3"
                            size={20}
                            aria-hidden="true"
                          />
                          <input
                            id="contactInfo"
                            type="text"
                            inputMode="text"
                            placeholder="เช่น 081-234-5678 หรือ @lineid"
                            className="field pl-12"
                            value={formData.contactInfo}
                            onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                            autoComplete="off"
                          />
                        </div>
                        <p className="text-footnote text-label-2">เราจะเทียบกับเบอร์ที่เคยถูกรายงานว่าเป็นมิจฉาชีพ</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-tint px-4 py-3 text-callout text-danger-ink">
                <AlertCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
                {error}
              </p>
            )}

            {/* The one prominent action on this screen */}
            <button type="submit" aria-busy={isLoading} disabled={isLoading} className="btn btn-prominent btn-lg w-full">
              {isLoading ? (
                <>
                  <Loader2 size={22} className="animate-spin" aria-hidden="true" />
                  กำลังตรวจสอบ…
                </>
              ) : (
                <>
                  เช็คเลย
                  <ArrowRight size={22} aria-hidden="true" />
                </>
              )}
            </button>
            <p className="-mt-2 text-center text-caption text-label-2">
              ผลเป็นการประเมินเบื้องต้น ·{" "}
              <Link href="/privacy-policy" className="underline underline-offset-2">
                ข้อมูลที่เราเก็บ
              </Link>
            </p>
          </form>
        </section>

        <div id="scam-signals" className="scroll-mt-24"><ScamNotice /></div>
      </div>
    </div>
  );
}
