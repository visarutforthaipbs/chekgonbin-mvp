"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { trackEvent } from "@/utils/analytics";
import ScamNotice from "@/components/ScamNotice";
import { parsePhones } from "@/utils/phone";
import {
  Search,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Phone,
  Copy,
  Check,
  SearchX,
  BadgeCheck,
  X,
  WifiOff,
} from "lucide-react";

const PAGE_SIZE = 20;

const formatMillions = (val) => {
  if (val === null || val === undefined) return "—";
  return (
    new Intl.NumberFormat("th-TH", { minimumFractionDigits: 1, maximumFractionDigits: 2 }).format(val / 1_000_000) +
    " ล้านบาท"
  );
};

const formatThaiDate = (iso, opts = { day: "numeric", month: "short", year: "numeric" }) => {
  try {
    return new Date(iso).toLocaleDateString("th-TH", { ...opts, timeZone: "Asia/Bangkok" });
  } catch {
    return "";
  }
};

const getFlagEmoji = (code) => {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => 127397 + c.charCodeAt(0)));
};

const SIZE_LABEL = { S: "ขนาดเล็ก", M: "ขนาดกลาง", L: "ขนาดใหญ่" };

function AgencySkeletonCard() {
  return (
    <div className="card p-4 md:p-5 flex flex-col gap-3" aria-hidden="true">
      <div className="h-6 w-3/4 rounded-lg animate-shimmer" />
      <div className="h-4 w-1/2 rounded-md animate-shimmer" />
      <div className="h-11 w-full md:w-60 rounded-xl animate-shimmer" />
    </div>
  );
}

function Detail({ label, children }) {
  return (
    <div className="flex items-baseline justify-between gap-4 px-4 py-3">
      <dt className="text-footnote text-label-2 shrink-0">{label}</dt>
      <dd className="text-callout text-label text-right tabular-nums">{children}</dd>
    </div>
  );
}

function AgencyCard({ agency, index }) {
  const [expanded, setExpanded] = useState(false);
  const [phoneCopied, setPhoneCopied] = useState(false);
  const detailsId = `agency-details-${agency.juristic_id || index}`;
  const phones = parsePhones(agency.phone);
  const phone = phones[0];
  const statusIsNormal =
    !agency.company_status || /ปกติ|ดำเนินการ|ยังดำเนิน|active/i.test(agency.company_status);

  return (
    <motion.article
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index, 10) * 0.02, duration: 0.2 }}
      className="card overflow-hidden"
      aria-labelledby={`${detailsId}-name`}
    >
      <div className="p-4 md:p-5 flex flex-col gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id={`${detailsId}-name`} className="text-headline font-bold text-label">
            {agency.name_th}
          </h2>
          {agency.name_en && <p className="text-footnote text-label-2">{agency.name_en}</p>}
        </div>

        <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-footnote text-label-2">
          {agency.license_no && (
            <span className="inline-flex items-center gap-1.5">
              <BadgeCheck size={16} className="text-safe-ink" aria-hidden="true" />
              <span>
                ใบอนุญาต <span className="text-label font-medium tabular-nums">{agency.license_no}</span>
              </span>
            </span>
          )}
          {agency.province && (
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={16} aria-hidden="true" />
              {agency.province}
            </span>
          )}
          {agency.company_status && !statusIsNormal && (
            <span className="inline-flex items-center rounded-md bg-caution-tint px-2 py-0.5 text-caution-ink font-bold">
              สถานะ: {agency.company_status}
            </span>
          )}
        </p>

        {phone ? (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <a
                href={`tel:${phone.tel}`}
                onClick={() =>
                  trackEvent("agencies_phone_click", {
                    agency_name: agency.name_th || "",
                    license_no: agency.license_no || "",
                  })
                }
                className="btn flex-1 md:flex-none justify-start bg-safe-tint text-safe-ink hover:opacity-90"
                aria-label={`โทรเบอร์ทางการ ${phone.display}`}
              >
                <Phone size={18} aria-hidden="true" />
                <span className="tabular-nums">{phone.display}</span>
                <span className="ml-auto md:ml-3 text-footnote font-medium">เบอร์ทางการ</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard?.writeText(phone.display);
                  setPhoneCopied(true);
                  setTimeout(() => setPhoneCopied(false), 2000);
                }}
                className="icon-btn bg-fill"
                aria-label={phoneCopied ? "คัดลอกเบอร์แล้ว" : "คัดลอกเบอร์โทร"}
              >
                {phoneCopied ? <Check size={18} className="text-safe-ink" aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
              </button>
            </div>
            {phones.length > 1 && (
              <p className="text-footnote text-label-2">
                เบอร์ทางการอื่น:{" "}
                {phones.slice(1).map((p, i) => (
                  <span key={p.tel}>
                    {i > 0 && ", "}
                    <a href={`tel:${p.tel}`} className="text-safe-ink font-medium underline underline-offset-2 tabular-nums">
                      {p.display}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </div>
        ) : (
          <p className="text-footnote text-label-2">ยังไม่มีเบอร์ทางการในระบบ</p>
        )}
      </div>

      {/* Progressive disclosure: company registry & finance (Layer 3) */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={detailsId}
        className="w-full min-h-11 px-4 md:px-5 flex items-center justify-between border-t border-separator text-footnote font-bold text-label-2 hover:bg-fill transition-colors"
      >
        {expanded ? "ซ่อนข้อมูลบริษัท" : "ข้อมูลบริษัทและกรรมการ"}
        <ChevronDown size={18} className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={detailsId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden bg-surface-2"
          >
            <div className="p-4 md:p-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <h3 className="text-footnote font-bold text-label-2 px-1">ข้อมูลนิติบุคคล</h3>
                <dl className="inset-list">
                  {agency.company_age ? <Detail label="ก่อตั้งมาแล้ว">{agency.company_age} ปี</Detail> : null}
                  {agency.business_size_code && SIZE_LABEL[agency.business_size_code] ? (
                    <Detail label="ขนาดธุรกิจ">{SIZE_LABEL[agency.business_size_code]}</Detail>
                  ) : null}
                  {agency.cap_amt ? <Detail label="ทุนจดทะเบียน">{formatMillions(agency.cap_amt)}</Detail> : null}
                  {agency.company_status ? <Detail label="สถานะ">{agency.company_status}</Detail> : null}
                </dl>

                <h3 className="text-footnote font-bold text-label-2 px-1 mt-2">กรรมการ</h3>
                {Array.isArray(agency.committees) && agency.committees.length > 0 ? (
                  <ol className="inset-list">
                    {agency.committees.map((m, i) => (
                      <li key={i} className="flex items-center justify-between gap-3 px-4 py-2.5 text-callout text-label">
                        <span>
                          {m.titleName || ""}
                          {m.firstName} {m.lastName}
                        </span>
                        {m.ntCode && (
                          <span title={m.ntCode} aria-label={`สัญชาติ ${m.ntCode}`}>
                            {getFlagEmoji(m.ntCode)}
                          </span>
                        )}
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="text-footnote text-label-2 px-1">ไม่พบข้อมูลกรรมการ</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <h3 className="text-footnote font-bold text-label-2 px-1">
                  งบการเงิน{agency.fiscal_year ? ` ปี ${agency.fiscal_year}` : ""}
                </h3>
                <dl className="inset-list">
                  <Detail label="รายได้รวม">{formatMillions(agency.total_income)}</Detail>
                  <Detail label="กำไร / ขาดทุนสุทธิ">
                    {agency.net_profit === null || agency.net_profit === undefined ? (
                      "—"
                    ) : (
                      <span className={agency.net_profit >= 0 ? "text-label" : "text-danger-ink"}>
                        {agency.net_profit < 0 ? "ขาดทุน " : "กำไร "}
                        {formatMillions(Math.abs(agency.net_profit))}
                      </span>
                    )}
                  </Detail>
                  <Detail label="สินทรัพย์รวม">{formatMillions(agency.total_asset)}</Detail>
                  <Detail label="ส่วนของผู้ถือหุ้น">{formatMillions(agency.total_equity)}</Detail>
                  {typeof agency.current_ratio === "number" ? (
                    <Detail label="สภาพคล่อง (เท่า)">{agency.current_ratio.toFixed(2)}</Detail>
                  ) : null}
                </dl>
                {agency.dbd_scraped_at && (
                  <p className="text-caption text-label-2 px-1">
                    ข้อมูลกรมพัฒนาธุรกิจการค้า ณ {formatThaiDate(agency.dbd_scraped_at)}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
}

export default function AgenciesClient() {
  const searchParams = useSearchParams();
  const initialQ = searchParams?.get("q") || "";
  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [dbTotal, setDbTotal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);
  const listTopRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setFailed(false);
      try {
        const res = await fetch(`/api/agencies?q=${encodeURIComponent(debouncedQuery)}&page=${page}`);
        if (!res.ok) throw new Error("Failed to fetch agencies");
        const json = await res.json();
        if (!mounted) return;
        setResults(json.data ?? []);
        const totalCount = json.total ?? 0;
        setTotalResults(totalCount);
        if (!debouncedQuery) setDbTotal(totalCount);
        setTotalPages(Math.ceil(totalCount / PAGE_SIZE) || 1);
        if (json.last_updated) setLastUpdated(json.last_updated);
      } catch (e) {
        console.error("Fetch agencies failed:", e);
        if (mounted) setFailed(true);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [debouncedQuery, page, reloadKey]);

  const goToPage = (next) => {
    setPage(Math.max(1, Math.min(next, totalPages)));
    listTopRef.current?.scrollIntoView({ block: "start" });
  };

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-3xl px-4 md:px-6 pt-8 md:pt-14 pb-12 md:pb-20 flex flex-col gap-5 md:gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-title1 md:text-large font-bold text-label tracking-tight">บริษัทจัดหางานที่ได้รับอนุญาต</h1>
          <p className="text-body text-label-2">
            รายชื่อจากกรมการจัดหางาน
            {dbTotal ? ` ${dbTotal.toLocaleString("th-TH")} บริษัท` : ""}
            {lastUpdated ? ` · อัปเดต ${formatThaiDate(lastUpdated)}` : ""}
          </p>
        </header>

        {/* Search — primary position, live results */}
        <form role="search" onSubmit={(e) => { e.preventDefault(); inputRef.current?.blur(); }} className="sticky top-[60px] md:top-[68px] z-20 -mx-4 px-4 py-2 md:mx-0 md:px-0 bg-bg">
          <label htmlFor="agency-search" className="sr-only">
            ค้นหาบริษัทจัดหางาน
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-label-3" size={20} aria-hidden="true" />
            <input
              ref={inputRef}
              id="agency-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ชื่อบริษัท หรือเลขใบอนุญาต"
              className="field pl-12 pr-12 bg-surface"
              enterKeyHint="search"
              autoComplete="off"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  inputRef.current?.focus();
                }}
                className="icon-btn absolute right-1 top-1/2 -translate-y-1/2"
                aria-label="ล้างคำค้น"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>
        </form>

        <ScamNotice />

        <div ref={listTopRef} className="scroll-mt-32" />

        <p className="text-footnote text-label-2 px-1" aria-live="polite">
          {loading
            ? "กำลังโหลด…"
            : debouncedQuery
            ? `พบ ${totalResults.toLocaleString("th-TH")} บริษัทที่ตรงกับ “${debouncedQuery}”`
            : `ทั้งหมด ${totalResults.toLocaleString("th-TH")} บริษัท`}
        </p>

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <AgencySkeletonCard key={i} />
            ))}
          </div>
        ) : failed ? (
          <div className="card p-8 flex flex-col items-center text-center gap-3">
            <WifiOff size={36} className="text-label-3" aria-hidden="true" />
            <p className="text-headline font-bold text-label">โหลดรายชื่อไม่สำเร็จ</p>
            <p className="text-callout text-label-2">ตรวจสอบอินเทอร์เน็ต แล้วลองอีกครั้ง</p>
            <button type="button" className="btn btn-tinted mt-1" onClick={() => setReloadKey((k) => k + 1)}>
              ลองอีกครั้ง
            </button>
          </div>
        ) : results.length === 0 ? (
          <div className="card p-8 flex flex-col items-center text-center gap-3">
            <SearchX size={36} className="text-label-3" aria-hidden="true" />
            <p className="text-headline font-bold text-label">ไม่พบ “{debouncedQuery}” ในรายชื่อที่ได้รับอนุญาต</p>
            <p className="text-callout text-label-2 max-w-md">
              ลองพิมพ์เฉพาะชื่อหลัก (ไม่ต้องใส่ “บริษัทจัดหางาน” หรือ “จำกัด”) ถ้ายังไม่พบ
              บริษัทนี้อาจไม่ได้รับอนุญาตจัดส่งคนไปทำงานต่างประเทศ
            </p>
            <div className="flex flex-col sm:flex-row gap-2 mt-1">
              <a href="tel:1300" className="btn btn-gray">
                <Phone size={18} aria-hidden="true" /> โทรถามกรมการจัดหางาน 1300
              </a>
              <Link href="/report-scam" className="btn btn-tinted">
                แจ้งเบาะแส
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {results.map((agency, i) => (
              <AgencyCard key={agency.juristic_id || `${agency.license_no}-${i}`} agency={agency} index={i} />
            ))}
          </div>
        )}

        {!loading && !failed && totalPages > 1 && (
          <nav aria-label="การแบ่งหน้า" className="flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => goToPage(page - 1)}
              disabled={page === 1}
              className="btn btn-gray"
            >
              <ChevronLeft size={20} aria-hidden="true" /> ก่อนหน้า
            </button>
            <span className="text-footnote text-label-2 tabular-nums" aria-live="polite">
              หน้า {page} จาก {totalPages}
            </span>
            <button
              type="button"
              onClick={() => goToPage(page + 1)}
              disabled={page === totalPages}
              className="btn btn-gray"
            >
              ถัดไป <ChevronRight size={20} aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
