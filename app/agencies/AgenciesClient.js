"use client";

import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  Building2, 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  AlertTriangle, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingUp,
  Banknote,
  Scale,
  Calendar,
  Activity,
  Copy,
  Check
} from "lucide-react";

const PAGE_SIZE = 20;

const normalizeSearchText = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .replace(/^บริษัทจัดหางาน\s*/i, "")
    .replace(/^บริษัท\s*/i, "")
    .replace(/\s+/g, " ")
    .trim();

const formatCurrency = (val) => {
  if (val === null || val === undefined) return "ไม่พบข้อมูล";
  return new Intl.NumberFormat("th-TH", {
    style: "decimal",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(val);
};

const formatMillions = (val) => {
  if (val === null || val === undefined) return "ไม่พบข้อมูล";
  const millions = val / 1_000_000;
  return new Intl.NumberFormat("th-TH", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 2,
  }).format(millions) + " ล้านบาท";
};

const getFlagEmoji = (countryCode) => {
  if (!countryCode || countryCode.length !== 2) return countryCode;
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

function AgencySkeletonCard() {
  return (
    <div className="bg-white border border-slate-100 rounded-xl md:rounded-2xl overflow-hidden shadow-sm p-4 md:p-5 flex flex-col gap-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div className="flex-1 flex flex-col gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            {/* Title shimmer */}
            <div className="h-5 w-48 md:w-64 rounded-md animate-shimmer" />
            {/* Badges shimmers */}
            <div className="h-4 w-12 rounded-full animate-shimmer" />
            <div className="h-4 w-16 rounded-full animate-shimmer" />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {/* Subtitle shimmer */}
            <div className="h-4 w-32 rounded-md animate-shimmer" />
            {/* Cap amount shimmer */}
            <div className="h-4 w-24 rounded-md animate-shimmer" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-x-4 gap-y-2 md:items-end lg:items-center border-t md:border-t-0 pt-3 md:pt-0 border-slate-50">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full animate-shimmer" />
            <div className="h-4 w-20 rounded-md animate-shimmer" />
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full animate-shimmer" />
            <div className="h-4 w-16 rounded-md animate-shimmer" />
          </div>
          <div className="h-8 w-28 rounded-lg animate-shimmer md:ml-auto" />
        </div>
      </div>
      
      {/* Bottom accordion button shimmer */}
      <div className="h-8 w-full bg-slate-50/50 rounded-lg animate-shimmer border-t border-slate-50" />
    </div>
  );
}

function AgencyCard({ agency, index }) {
  const [expanded, setExpanded] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);

  const getBusinessSizeLabel = (code) => {
    switch (code) {
      case "S": return { label: "ธุรกิจขนาดเล็ก (S)", color: "bg-blue-50 text-blue-700 border-blue-100" };
      case "M": return { label: "ธุรกิจขนาดกลาง (M)", color: "bg-indigo-50 text-indigo-700 border-indigo-100" };
      case "L": return { label: "ธุรกิจขนาดใหญ่ (L)", color: "bg-purple-50 text-purple-700 border-purple-100" };
      default: return null;
    }
  };

  const bSize = getBusinessSizeLabel(agency.business_size_code);

  // Derive human-friendly stability indicators
  const getStabilityInfo = () => {
    const indicators = [];
    if (agency.company_age) {
      indicators.push({
        label: `เปิดมาแล้ว ${agency.company_age} ปี`,
        icon: <Calendar size={12} />,
        color: "text-blue-700 bg-blue-50 border-blue-100"
      });
    }
    
    if (agency.net_profit > 0) {
      indicators.push({
        label: "ผลประกอบการมีกำไร",
        icon: <TrendingUp size={12} />,
        color: "text-green-700 bg-green-50 border-green-100"
      });
    } else if (agency.net_profit < 0) {
      indicators.push({
        label: "ผลประกอบการขาดทุน",
        icon: <Activity size={12} />,
        color: "text-red-700 bg-red-50 border-red-100"
      });
    }

    if (agency.current_ratio > 1.2) {
      indicators.push({
        label: "สภาพคล่องทางการเงินสูง",
        icon: <ShieldCheck size={12} />,
        color: "text-indigo-700 bg-indigo-50 border-indigo-100"
      });
    }

    return indicators;
  };

  const stabilityIndicators = getStabilityInfo();

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white border border-slate-100 rounded-xl md:rounded-2xl overflow-hidden shadow-sm hover:border-brand-primary/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-bold text-slate-900 text-sm md:text-base leading-tight">{agency.name_th}</h2>
            {agency.company_status && (
              <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                agency.company_status.includes("ปกติ") || agency.company_status === "active"
                  ? "bg-green-50 text-green-700 border border-green-100"
                  : "bg-slate-100 text-slate-500 border border-slate-200"
              }`}>
                {agency.company_status}
              </span>
            )}
            {bSize && (
              <span className={`text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide border ${bSize.color}`}>
                {bSize.label}
              </span>
            )}
            {agency.company_age && (
              <span className="text-[9px] md:text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 uppercase tracking-wide">
                เปิดมาแล้ว {agency.company_age} ปี
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {agency.name_en && <p className="text-xs md:text-sm text-slate-500 leading-tight">{agency.name_en}</p>}
            {agency.cap_amt && (
              <p className="text-[10px] md:text-xs text-slate-400 flex items-center gap-1">
                <Banknote size={12} className="shrink-0" />
                ทุนจดทะเบียน: {formatMillions(agency.cap_amt)}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-x-4 gap-y-1.5 text-xs md:text-sm text-slate-500 md:text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 mt-1 md:mt-0 border-slate-50">
          <div className="flex flex-wrap md:flex-col lg:flex-row gap-x-4 gap-y-1.5 md:items-end lg:items-center">
            {agency.license_no && (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="text-signal-green shrink-0 w-[13px] h-[13px] md:w-3.5 md:h-3.5" aria-hidden="true" />
                <span className="font-medium text-slate-700">{agency.license_no}</span>
              </span>
            )}
            {agency.province && (
              <span className="flex items-center gap-1.5">
                <MapPin className="shrink-0 text-slate-400 w-[13px] h-[13px] md:w-3.5 md:h-3.5" aria-hidden="true" />
                {agency.province}
              </span>
            )}
          </div>
          
          {agency.phone && (
            <div className="flex items-center gap-1.5 md:ml-auto w-fit shrink-0">
              <a
                href={`tel:${agency.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors group"
                title="เบอร์โทรทางการที่จดทะเบียนไว้กับกรมการจัดหางาน"
              >
                <ShieldCheck className="shrink-0 text-signal-green w-[13px] h-[13px] md:w-3.5 md:h-3.5" aria-hidden="true" />
                <span className="font-bold text-green-800 group-hover:underline">{agency.phone}</span>
                <span className="hidden sm:inline text-[9px] md:text-[10px] font-extrabold text-green-700 bg-green-100 border border-green-200 px-1.5 py-0.5 rounded-full uppercase tracking-wide whitespace-nowrap">เบอร์ทางการ</span>
              </a>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(agency.phone);
                  setPhoneCopied(true);
                  setTimeout(() => setPhoneCopied(false), 2000);
                }}
                className="p-1.5 text-slate-400 hover:text-brand-primary hover:bg-slate-100 rounded-lg transition-colors shrink-0"
                title="คัดลอกเบอร์โทร"
              >
                {phoneCopied ? <Check size={14} className="text-signal-green" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Layer 3: Conscious Deep-Dive - Progressive Disclosure */}
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full py-2 bg-slate-50/50 hover:bg-slate-100/80 border-t border-slate-50 transition-colors flex items-center justify-center gap-2 text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest"
      >
        {expanded ? (
          <>ปิดรายละเอียด <ChevronUp size={14} /></>
        ) : (
          <>ดูข้อมูล DBD & กรรมการ <ChevronDown size={14} /></>
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-slate-50/30 border-t border-slate-100"
          >
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {/* Committees Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] md:text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <Users size={14} className="text-brand-primary" />
                  รายชื่อกรรมการ (Committees)
                </h3>
                <div className="flex flex-col gap-2">
                  {agency.committees && Array.isArray(agency.committees) ? (
                    agency.committees.map((member, i) => (
                      <div key={i} className="text-xs md:text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-slate-300 font-mono mt-0.5">{i + 1}.</span>
                        <div className="flex items-center gap-2">
                          <span>{member.titleName || ""}{member.firstName} {member.lastName}</span>
                          {member.ntCode && (
                            <span className="text-base" title={member.ntCode}>
                              {getFlagEmoji(member.ntCode)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">ไม่พบข้อมูลกรรมการ</p>
                  )}
                </div>
              </div>

              {/* Financial Summary Section */}
              <div className="flex flex-col gap-3">
                <h3 className="text-[11px] md:text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={14} className="text-brand-primary" />
                  สรุปความมั่นคงทางการเงิน ปี {agency.fiscal_year || "-"}
                </h3>
                
                {/* Meaningful Stability Badges */}
                <div className="flex flex-wrap gap-2">
                  {stabilityIndicators.map((indicator, i) => (
                    <div key={i} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] md:text-xs font-bold ${indicator.color}`}>
                      {indicator.icon}
                      {indicator.label}
                    </div>
                  ))}
                  {stabilityIndicators.length === 0 && (
                    <p className="text-xs text-slate-400 italic">ไม่มีข้อมูลสรุปความมั่นคง</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mt-1">
                  <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-tighter mb-1">รายได้รวม</span>
                    <span className="block text-xs md:text-sm font-black text-slate-800">{formatMillions(agency.total_income)}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-tighter mb-1">กำไร/ขาดทุนสุทธิ</span>
                    <span className={`block text-xs md:text-sm font-black ${agency.net_profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatMillions(agency.net_profit)}
                    </span>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-tighter mb-1">สินทรัพย์รวม</span>
                    <span className="block text-xs md:text-sm font-black text-slate-800">{formatMillions(agency.total_asset)}</span>
                  </div>
                  <div className="p-3 bg-white border border-slate-100 rounded-xl shadow-xs">
                    <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-tighter mb-1">ส่วนผู้ถือหุ้น</span>
                    <span className="block text-xs md:text-sm font-black text-slate-800">{formatMillions(agency.total_equity)}</span>
                  </div>
                </div>
              </div>
            </div>
            {agency.dbd_scraped_at && (
              <div className="px-4 md:px-6 pb-4 flex items-center justify-end gap-1.5">
                <RefreshCw size={10} className="text-slate-300" />
                <span className="text-[9px] font-medium text-slate-400">
                  DBD Data Refreshed: {new Date(agency.dbd_scraped_at).toLocaleDateString("th-TH")}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function AgenciesClient() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Server-side paginated search
  useEffect(() => {
    let mounted = true;

    const fetchAgencies = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/agencies?q=${encodeURIComponent(debouncedQuery)}&page=${page}`
        );
        if (!res.ok) throw new Error("Failed to fetch agencies");
        const json = await res.json();
        if (!mounted) return;

        setResults(json.data ?? []);
        const totalCount = json.total ?? 0;
        setTotalResults(totalCount);
        setTotalPages(Math.ceil(totalCount / PAGE_SIZE) || 1);
        if (json.last_updated) setLastUpdated(json.last_updated);
        setSearched(true);
      } catch (e) {
        console.error("Fetch agencies failed:", e);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchAgencies();
    return () => {
      mounted = false;
    };
  }, [debouncedQuery, page]);

  const handleSearch = (e) => {
    e.preventDefault();
  };

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const goToPage = (nextPage) => {
    setPage(Math.max(1, Math.min(nextPage, totalPages)));
  };

  const handleRefresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/agencies?q=${encodeURIComponent(debouncedQuery)}&page=${page}`
      );
      if (res.ok) {
        const json = await res.json();
        setResults(json.data ?? []);
        const totalCount = json.total ?? 0;
        setTotalResults(totalCount);
        setTotalPages(Math.ceil(totalCount / PAGE_SIZE) || 1);
        if (json.last_updated) setLastUpdated(json.last_updated);
      }
    } catch (e) {
      console.error("Refresh failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      <header className="w-full bg-white border-b border-slate-100 py-10 md:py-20">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-4 md:gap-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="p-3 md:p-4 bg-brand-primary/10 rounded-[1.5rem] md:rounded-[2rem]">
            <Building2 className="text-brand-primary w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />
          </motion.div>
          <h1 className="text-2xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            บริษัทจัดหางานที่ได้รับอนุญาต
          </h1>
          <p className="text-base md:text-lg text-slate-600 max-w-xl leading-relaxed">
            รายชื่อบริษัทจัดหางานที่ได้รับใบอนุญาตจากกรมการจัดหางาน อัปเดตทุกวัน
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
              <CheckCircle2 className="text-signal-green w-3 h-3 md:w-3.5 md:h-3.5" aria-hidden="true" />
              <span className="text-[10px] md:text-xs font-extrabold text-green-700">{totalResults.toLocaleString()} บริษัทในฐานข้อมูล</span>
            </div>
            {lastUpdated && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full">
                <RefreshCw className="text-blue-500 w-3 h-3 md:w-3.5 md:h-3.5" aria-hidden="true" />
                <span className="text-[10px] md:text-xs font-medium text-blue-700">
                  อัปเดตล่าสุด{" "}
                  {new Date(lastUpdated).toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Bangkok" })}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-8 md:py-10 flex flex-col gap-6 max-w-4xl w-full">
        {/* Scammer tactic warning */}
        <div className="flex gap-3 p-4 md:p-5 bg-amber-50 border border-amber-200 rounded-xl md:rounded-2xl" role="alert">
          <AlertTriangle className="text-amber-500 shrink-0 mt-0.5 w-5 h-5" aria-hidden="true" />
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-extrabold text-amber-900">รู้ทันกลโกง: มิจฉาชีพขโมยตัวตนบริษัทจริง</p>
            <p className="text-xs md:text-sm text-amber-800 leading-relaxed">
              มิจฉาชีพมักนำ <strong>ชื่อบริษัท และชื่อผู้มีอำนาจลงนามแทิติบุคคล</strong> ของบริษัทที่จดทะเบียนถูกกฎหมาย
              ไปสร้างเว็บไซต์ปลอมหรือเพจ Facebook ปลอม แต่ใส่เบอร์โทรและช่องทางติดต่อของตัวเองเข้าไปแทน
            </p>
            <p className="text-xs md:text-sm font-bold text-amber-900">
              ✅ ให้ยึด <span className="underline underline-offset-2">เบอร์โทรทางการที่จดทะเบียนไว้</span> ด้านล่างเป็นเกณฑ์
              — อย่าโทรหาหรือโอนเงินผ่านช่องทางอื่นที่ไม่ตรงกับที่นี่
            </p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="relative flex flex-col md:block gap-2" role="search">
          <label htmlFor="agency-search" className="sr-only">ค้นหาบริษัทจัดหางาน</label>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5 md:w-5 md:h-5" aria-hidden="true" />
            <input
              id="agency-search"
              type="search"
              value={query}
              onChange={handleQueryChange}
              placeholder="พิมพ์ชื่อบริษัท/เลขใบอนุญาต (รองรับสะกดใกล้เคียง)"
              className="w-full pl-11 pr-4 md:pr-32 py-3.5 md:py-4 bg-white border-2 border-slate-200 rounded-xl md:rounded-2xl focus:border-brand-primary outline-none transition-all text-base md:text-lg shadow-sm"
            />
          </div>
          <button type="button"
            onClick={handleRefresh}
            className="md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 px-5 py-3 md:py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all shadow-md md:shadow-none">
            รีเฟรช
          </button>
        </form>

        {loading ? (
          <div className="flex flex-col gap-3" aria-label="กำลังโหลดรายชื่อบริษัทจัดหางาน">
            {Array.from({ length: 5 }).map((_, i) => (
              <AgencySkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <>
            {searched && results.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center gap-3">
                <AlertCircle className="text-slate-300" size={48} aria-hidden="true" />
                <p className="text-slate-500">ไม่พบบริษัทที่ตรงกับคำค้นหา</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3" aria-label="รายชื่อบริษัทจัดหางาน">
                {results.map((agency, i) => (
                  <AgencyCard key={agency.juristic_id || `${agency.license_no}-${i}`} agency={agency} index={i} />
                ))}
              </div>
            )}


            {totalPages > 1 && (
              <nav aria-label="การแบ่งหน้า" className="flex items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  aria-label="หน้าก่อนหน้า"
                  className="p-2 rounded-xl border border-slate-200 hover:border-brand-primary disabled:opacity-30 transition-all"
                >
                  <ChevronLeft size={20} aria-hidden="true" />
                </button>
                <span className="text-sm text-slate-600 font-medium" aria-live="polite">
                  หน้า {page} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  aria-label="หน้าถัดไป"
                  className="p-2 rounded-xl border border-slate-200 hover:border-brand-primary disabled:opacity-30 transition-all"
                >
                  <ChevronRight size={20} aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
