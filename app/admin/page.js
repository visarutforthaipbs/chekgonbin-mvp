"use client";

import { useState, useEffect, useCallback } from "react";
import { ShieldCheck, AlertCircle, CheckCircle2, XCircle, BarChart3, Clock, LogOut, Plus } from "lucide-react";

const STORAGE_KEY = "cgb_admin_key";

function useAdminKey() {
  const [key, setKey] = useState("");
  useEffect(() => { setKey(localStorage.getItem(STORAGE_KEY) ?? ""); }, []);
  const save = (k) => { localStorage.setItem(STORAGE_KEY, k); setKey(k); };
  const clear = () => { localStorage.removeItem(STORAGE_KEY); setKey(""); };
  return { key, save, clear };
}

function headers(key) {
  return { "Content-Type": "application/json", "x-admin-key": key };
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  const attempt = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/admin/analytics", { headers: headers(input) });
    if (res.ok) { onLogin(input); }
    else { setError(true); }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <form onSubmit={attempt} className="bg-white rounded-3xl p-10 w-full max-w-sm flex flex-col gap-6 shadow-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-brand-primary/10 rounded-xl">
            <ShieldCheck className="text-brand-primary" size={32} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-500">เช็คก่อนบิน — ผู้ดูแลระบบ</p>
        </div>
        <input
          type="password"
          placeholder="Admin key"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          className={`px-4 py-3 border-2 rounded-xl outline-none transition-all ${error ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-brand-primary"}`}
        />
        {error && <p className="text-sm text-red-500 -mt-3">Key ไม่ถูกต้อง</p>}
        <button type="submit" className="py-3 bg-brand-primary text-white rounded-xl font-bold hover:bg-brand-primary/90 transition-all">
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}

// ─── Analytics tab ────────────────────────────────────────────────────────────
function AnalyticsTab({ adminKey }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("/api/admin/analytics", { headers: headers(adminKey) })
      .then((r) => r.json()).then(setData);
  }, [adminKey]);

  if (!data) return <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>;

  const { riskCounts, recentChecks, reportCounts } = data;

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "ทั้งหมด", value: riskCounts.total, color: "text-slate-900" },
          { label: "ความเสี่ยงต่ำ", value: riskCounts.low, color: "text-signal-green" },
          { label: "ความเสี่ยงปานกลาง", value: riskCounts.medium, color: "text-signal-orange" },
          { label: "ความเสี่ยงสูง", value: riskCounts.high, color: "text-signal-red" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-1">
            <span className="text-xs text-slate-400 uppercase tracking-wide">{s.label}</span>
            <span className={`text-3xl font-black ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "รอตรวจสอบ", value: reportCounts.pending, color: "text-signal-orange" },
          { label: "ยืนยันแล้ว", value: reportCounts.verified, color: "text-signal-green" },
          { label: "ปฏิเสธ", value: reportCounts.rejected, color: "text-slate-400" },
          { label: "เพิ่ม Blacklist", value: reportCounts.added_to_blacklist, color: "text-signal-red" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col gap-1">
            <span className="text-xs text-slate-400 uppercase tracking-wide">{s.label}</span>
            <span className={`text-3xl font-black ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex items-center gap-2">
          <Clock size={16} className="text-slate-400" />
          <h3 className="font-bold text-slate-800">การตรวจสอบล่าสุด</h3>
        </div>
        <div className="divide-y divide-slate-50">
          {recentChecks.map((c, i) => (
            <div key={i} className="px-5 py-3 flex items-center justify-between gap-4">
              <span className="text-slate-700 text-sm truncate max-w-xs">{c.agency_name || "(ไม่ระบุ)"}</span>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-slate-400">{new Date(c.created_at).toLocaleString("th-TH")}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                  c.risk_level === "high" ? "bg-red-100 text-red-600" :
                  c.risk_level === "medium" ? "bg-orange-100 text-orange-600" : "bg-green-100 text-green-600"
                }`}>{c.score}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Reports tab ──────────────────────────────────────────────────────────────
function ReportsTab({ adminKey }) {
  const [statusFilter, setStatusFilter] = useState("pending");
  const [reports, setReports]           = useState([]);
  const [loading, setLoading]           = useState(false);

  const load = useCallback(async (s) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/reports?status=${s}`, { headers: headers(adminKey) });
      const json = await res.json();
      setReports(Array.isArray(json) ? json : []);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [adminKey]);

  useEffect(() => { load(statusFilter); }, [statusFilter, load]);

  const updateStatus = async (id, status) => {
    await fetch("/api/admin/reports", { method: "PATCH", headers: headers(adminKey), body: JSON.stringify({ id, status }) });
    load(statusFilter);
  };

  const promoteToBlacklist = async (report) => {
    await fetch("/api/admin/blacklist", {
      method: "POST",
      headers: headers(adminKey),
      body: JSON.stringify({
        reportId:    report.id,
        name:        report.agency_name,
        contactInfo: report.contact_info,
        scamMethod:  report.description,
      }),
    });
    load(statusFilter);
  };

  const statusTabs = ["pending", "verified", "rejected", "added_to_blacklist"];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-2 flex-wrap">
        {statusTabs.map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
              statusFilter === s ? "bg-brand-primary text-white border-brand-primary" : "bg-white text-slate-600 border-slate-200 hover:border-brand-primary"
            }`}>
            {s === "pending" ? "รอตรวจสอบ" : s === "verified" ? "ยืนยันแล้ว" : s === "rejected" ? "ปฏิเสธ" : "Blacklist แล้ว"}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-10 flex justify-center"><div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" /></div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16 text-slate-400">ไม่มีรายการ</div>
      ) : (
        <div className="flex flex-col gap-4">
          {reports.map((r) => (
            <div key={r.id} className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex flex-col gap-1">
                  <h4 className="font-bold text-slate-900">{r.agency_name}</h4>
                  {r.contact_info && <p className="text-sm text-slate-500">{r.contact_info}</p>}
                  <p className="text-xs text-slate-400">{new Date(r.created_at).toLocaleString("th-TH")}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {r.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(r.id, "verified")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-50 text-green-700 border border-green-100 rounded-lg text-xs font-bold hover:bg-green-100 transition-all">
                        <CheckCircle2 size={13} /> ยืนยัน
                      </button>
                      <button onClick={() => updateStatus(r.id, "rejected")}
                        className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all">
                        <XCircle size={13} /> ปฏิเสธ
                      </button>
                    </>
                  )}
                  {r.status === "verified" && (
                    <button onClick={() => promoteToBlacklist(r)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">
                      <Plus size={13} /> เพิ่ม Blacklist
                    </button>
                  )}
                </div>
              </div>
              {r.description && (
                <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 leading-relaxed">{r.description}</p>
              )}
              {r.evidence && <p className="text-xs text-slate-400">หลักฐาน: {r.evidence}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const { key, save, clear } = useAdminKey();
  const [authed, setAuthed]  = useState(false);
  const [tab, setTab]        = useState("analytics");

  const handleLogin = (k) => { save(k); setAuthed(true); };

  useEffect(() => {
    if (key) {
      fetch("/api/admin/analytics", { headers: headers(key) })
        .then((r) => { if (r.ok) setAuthed(true); });
    }
  }, [key]);

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-brand-primary" size={24} />
            <span className="font-black text-slate-900">Admin Panel</span>
          </div>
          <button onClick={() => { clear(); setAuthed(false); }}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand-primary transition-colors">
            <LogOut size={16} /> ออกจากระบบ
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8 max-w-5xl flex flex-col gap-8">
        <div className="flex gap-2">
          {[
            { id: "analytics", label: "Analytics", icon: BarChart3 },
            { id: "reports",   label: "รายงานเบาะแส", icon: AlertCircle },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all border ${
                tab === id ? "bg-brand-primary text-white border-brand-primary" : "bg-white text-slate-600 border-slate-200 hover:border-brand-primary"
              }`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </div>

        {tab === "analytics" && <AnalyticsTab adminKey={key} />}
        {tab === "reports"   && <ReportsTab   adminKey={key} />}
      </div>
    </div>
  );
}
