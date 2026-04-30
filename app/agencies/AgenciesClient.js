"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, Building2, MapPin, Phone, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";

export default function AgenciesClient() {
  const [query, setQuery]       = useState("");
  const [results, setResults]   = useState([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (q, p = 1) => {
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/agencies?q=${encodeURIComponent(q)}&page=${p}`);
      const json = await res.json();
      setResults(json.data ?? []);
      setTotal(json.total ?? 0);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { search(""); }, [search]);

  const handleSearch = (e) => {
    e.preventDefault();
    search(query, 1);
  };

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center">
      <header className="w-full bg-white border-b border-slate-100 py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6 flex flex-col items-center text-center gap-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-brand-primary/10 rounded-[2rem]">
            <Building2 className="text-brand-primary" size={48} aria-hidden="true" />
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            บริษัทจัดหางานที่ได้รับอนุญาต
          </h1>
          <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
            รายชื่อบริษัทจัดหางานที่ได้รับใบอนุญาตจากกรมการจัดหางาน อัปเดตทุกวัน
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-100 rounded-full">
            <CheckCircle2 className="text-signal-green" size={14} aria-hidden="true" />
            <span className="text-xs font-extrabold text-green-700">{total.toLocaleString()} บริษัทในฐานข้อมูล</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-6 py-10 flex flex-col gap-6 max-w-4xl w-full">
        <form onSubmit={handleSearch} className="relative" role="search">
          <label htmlFor="agency-search" className="sr-only">ค้นหาบริษัทจัดหางาน</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} aria-hidden="true" />
          <input
            id="agency-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาชื่อบริษัท หรือเลขที่ใบอนุญาต..."
            className="w-full pl-12 pr-32 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:border-brand-primary outline-none transition-all text-lg shadow-sm"
          />
          <button type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all">
            ค้นหา
          </button>
        </form>

        {loading ? (
          <div role="status" className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" aria-hidden="true" />
            <span className="sr-only">กำลังค้นหา...</span>
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
                  <motion.div
                    key={`${agency.license_no}-${i}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center gap-4 shadow-sm hover:border-brand-primary/30 hover:shadow-md transition-all"
                  >
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-bold text-slate-900">{agency.name_th}</h2>
                        {agency.company_status && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                            agency.company_status.includes("ปกติ") || agency.company_status === "active"
                              ? "bg-green-50 text-green-700"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                            {agency.company_status}
                          </span>
                        )}
                      </div>
                      {agency.name_en && <p className="text-sm text-slate-500">{agency.name_en}</p>}
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500 md:text-right shrink-0">
                      {agency.license_no && (
                        <span className="flex items-center gap-1">
                          <CheckCircle2 className="text-signal-green shrink-0" size={14} aria-hidden="true" />
                          {agency.license_no}
                        </span>
                      )}
                      {agency.province && (
                        <span className="flex items-center gap-1">
                          <MapPin className="shrink-0" size={14} aria-hidden="true" />
                          {agency.province}
                        </span>
                      )}
                      {agency.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="shrink-0" size={14} aria-hidden="true" />
                          {agency.phone}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <nav aria-label="การแบ่งหน้า" className="flex items-center justify-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => search(query, page - 1)}
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
                  onClick={() => search(query, page + 1)}
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
