"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, Suspense } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  Phone,
  RotateCcw,
  Share2,
  Copy,
  Check,
  Printer,
  Building2,
  SearchX,
} from "lucide-react";
import { trackEvent } from "@/utils/analytics";
import { parsePhones } from "@/utils/phone";

const SITE_URL = "https://checkgonbin.in.th";

// Layer 1 — each level is encoded by color + icon shape + words (never color alone).
const LEVELS = {
  low: {
    key: "low",
    title: "ความเสี่ยงต่ำ",
    description: "ไม่พบสัญญาณอันตรายที่ชัดเจน แต่ยังควรยืนยันกับบริษัทผ่านเบอร์ทางการก่อนจ่ายเงิน",
    Icon: CheckCircle2,
    ink: "text-safe-ink",
    tint: "bg-safe-tint",
    fill: "bg-safe-fill",
  },
  medium: {
    key: "medium",
    title: "ต้องระวัง",
    description: "พบข้อควรระวังบางอย่าง อย่าเพิ่งโอนเงิน — ยืนยันข้อมูลกับกรมการจัดหางานก่อน",
    Icon: AlertTriangle,
    ink: "text-caution-ink",
    tint: "bg-caution-tint",
    fill: "bg-caution-fill",
  },
  high: {
    key: "high",
    title: "ความเสี่ยงสูง",
    description: "พบสัญญาณอันตราย หยุดโอนเงินและหยุดส่งเอกสารส่วนตัว แล้วโทรปรึกษาสายด่วนทันที",
    Icon: OctagonAlert,
    ink: "text-danger-ink",
    tint: "bg-danger-tint",
    fill: "bg-danger-fill",
  },
};
const ORDER = ["low", "medium", "high"];
const METER_LABEL = { low: "ต่ำ", medium: "ระวัง", high: "สูง" };

const HOTLINES = {
  labour: { tel: "1694", label: "สายด่วนกระทรวงแรงงาน", sub: "ปรึกษาหรือแจ้งถูกหลอก ฟรี 24 ชม." },
  doe: { tel: "1300", label: "กรมการจัดหางาน", sub: "ยืนยันใบอนุญาตและการรับสมัคร" },
};

const CHECKLIST = [
  { id: "doe", label: "บริษัทมีชื่อในรายชื่อผู้ได้รับอนุญาตของกรมการจัดหางาน" },
  { id: "phone", label: "โทรคุยผ่านเบอร์ทางการของบริษัท ไม่ใช่เบอร์ในแชต" },
  { id: "noPersonalTransfer", label: "ไม่โอนเงินเข้าบัญชีส่วนตัว — ต้องเป็นบัญชีบริษัทเท่านั้น" },
  { id: "contract", label: "ได้สัญญาจ้างที่ระบุนายจ้าง ประเทศ ค่าจ้าง ชัดเจน" },
  { id: "receipt", label: "ได้ใบเสร็จในนามบริษัททุกครั้งที่จ่ายเงิน" },
];

const POSITIVE_PATTERNS = ["ตรวจพบชื่อบริษัทในรายชื่อผู้ได้รับอนุญาต", "ไม่พบความเสี่ยง"];

function ShareRow() {
  const [copied, setCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);
  useEffect(() => {
    queueMicrotask(() => setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share));
  }, []);

  const text = "เช็คบริษัทจัดหางานก่อนโอนเงิน ฟรีที่ Thai Migrant Watch";

  if (canNativeShare) {
    return (
      <button
        type="button"
        className="btn btn-gray flex-1"
        onClick={() => {
          trackEvent("result_share", { method: "native" });
          navigator.share({ title: "Thai Migrant Watch", text, url: SITE_URL }).catch(() => {});
        }}
      >
        <Share2 size={18} aria-hidden="true" /> แชร์ให้เพื่อน
      </button>
    );
  }

  return (
    <>
      <a
        href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(SITE_URL)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-gray flex-1"
        onClick={() => trackEvent("result_share", { method: "line" })}
      >
        แชร์ทาง LINE
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(SITE_URL)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-gray flex-1"
        onClick={() => trackEvent("result_share", { method: "facebook" })}
      >
        แชร์ทาง Facebook
      </a>
      <button
        type="button"
        className="btn btn-gray flex-1"
        onClick={() => {
          navigator.clipboard?.writeText(SITE_URL);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
        <span aria-live="polite">{copied ? "คัดลอกแล้ว" : "คัดลอกลิงก์"}</span>
      </button>
    </>
  );
}

function HotlineRow({ line, prominent = false }) {
  return (
    <a
      href={`tel:${line.tel}`}
      onClick={() => trackEvent("result_hotline_click", { tel: line.tel })}
      className={`btn ${prominent ? "btn-prominent btn-lg" : "btn-gray"} w-full justify-between text-left`}
    >
      <span className="flex items-center gap-3">
        <Phone size={20} aria-hidden="true" />
        <span className="flex flex-col leading-tight">
          <span>{line.label}</span>
          <span className={`text-footnote font-medium ${prominent ? "opacity-90" : "text-label-2"}`}>{line.sub}</span>
        </span>
      </span>
      <span className="text-title3 font-bold tabular-nums">{line.tel}</span>
    </a>
  );
}

function ResultContent() {
  const searchParams = useSearchParams();
  const result = useMemo(() => {
    const data = searchParams.get("data");
    if (!data) return null;
    try {
      const parsed = JSON.parse(data);
      return parsed && parsed.riskLevel ? parsed : null;
    } catch {
      return null;
    }
  }, [searchParams]);

  const [checklist, setChecklist] = useState({});
  const doneCount = CHECKLIST.filter((c) => checklist[c.id]).length;

  useEffect(() => {
    if (!result) return;
    trackEvent("risk_result_view", {
      risk_level: result.riskLevel || "unknown",
      score: typeof result.score === "number" ? result.score : undefined,
    });
  }, [result]);

  if (!result) {
    return (
      <div className="w-full max-w-md px-4 py-20 flex flex-col items-center text-center gap-4">
        <SearchX size={44} className="text-label-3" aria-hidden="true" />
        <h1 className="text-title2 font-bold text-label">ไม่พบผลการตรวจ</h1>
        <p className="text-body text-label-2">ลิงก์นี้อาจไม่สมบูรณ์ ลองตรวจสอบบริษัทใหม่อีกครั้ง</p>
        <Link href="/" className="btn btn-prominent btn-lg mt-2">
          ตรวจสอบบริษัท
        </Link>
      </div>
    );
  }

  const level = LEVELS[result.riskLevel] || LEVELS.medium;
  const reasons = Array.isArray(result.reasons) ? result.reasons : [];
  const agency = result.agency || null;
  const agencyPhone = agency ? parsePhones(agency.phone)[0] : null;

  // Next step: exactly one prominent action, chosen by risk level.
  const primary =
    level.key === "high" ? HOTLINES.labour : level.key === "medium" ? HOTLINES.doe : null;
  const secondary = level.key === "high" ? HOTLINES.doe : HOTLINES.labour;

  return (
    <div className="w-full max-w-2xl px-4 md:px-6 pt-6 md:pt-14 pb-12 md:pb-20 flex flex-col gap-6 md:gap-8">
      {/* 1 · Verdict — readable before reading (Layer 1) */}
      <motion.section
        aria-labelledby="verdict"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`rounded-[24px] ${level.tint} p-5 md:p-8 flex flex-col gap-5`}
      >
        <div className="flex items-start gap-4">
          <span className={`inline-flex h-14 w-14 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-full ${level.fill} text-white`}>
            <level.Icon size={30} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <div className="flex flex-col gap-1 min-w-0">
            <p className="text-footnote font-bold text-label-2">ผลการตรวจสอบเบื้องต้น</p>
            <h1 id="verdict" className={`text-title1 md:text-large font-bold ${level.ink} leading-tight`}>
              {level.title}
            </h1>
          </div>
        </div>

        {agency?.name_th && (
          <p className="flex items-center gap-2 text-callout text-label">
            <Building2 size={18} className="text-label-2 shrink-0" aria-hidden="true" />
            <span className="font-bold">{agency.name_th}</span>
          </p>
        )}

        <p className="text-body text-label">{level.description}</p>

        {/* Three-step meter: position + label, no fake precision */}
        <div className="flex flex-col gap-1.5" role="img" aria-label={`ระดับความเสี่ยง: ${level.title}`}>
          <div className="grid grid-cols-3 gap-1.5">
            {ORDER.map((k) => (
              <span
                key={k}
                className={`h-2 rounded-full ${k === level.key ? LEVELS[k].fill : "bg-fill-strong"}`}
                aria-hidden="true"
              />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1.5 text-caption" aria-hidden="true">
            {ORDER.map((k, i) => (
              <span
                key={k}
                className={`${i === 1 ? "text-center" : i === 2 ? "text-right" : ""} ${
                  k === level.key ? `${LEVELS[k].ink} font-bold` : "text-label-2"
                }`}
              >
                {METER_LABEL[k]}
              </span>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 2 · What we found */}
      <section aria-labelledby="findings" className="flex flex-col gap-3">
        <h2 id="findings" className="text-title3 font-bold text-label px-1">
          สิ่งที่เราพบ
        </h2>
        <ul className="inset-list">
          {reasons.map((reason, i) => {
            const positive = POSITIVE_PATTERNS.some((p) => reason.includes(p));
            const Icon = positive ? CheckCircle2 : level.key === "high" ? OctagonAlert : AlertTriangle;
            return (
              <li key={i} className="flex items-start gap-3 px-4 py-3.5">
                <Icon size={20} className={`shrink-0 mt-0.5 ${positive ? "text-safe-ink" : level.ink}`} aria-hidden="true" />
                <span className="text-callout text-label">{reason}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 3 · What to do now */}
      <section aria-labelledby="next" className="flex flex-col gap-3">
        <h2 id="next" className="text-title3 font-bold text-label px-1">
          ทำอะไรต่อ
        </h2>

        {agencyPhone && level.key === "low" ? (
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${agencyPhone.tel}`}
              onClick={() => trackEvent("result_official_phone_click", { license_no: agency.license_no || "" })}
              className="btn btn-prominent btn-lg w-full justify-between text-left"
            >
              <span className="flex items-center gap-3">
                <Phone size={20} aria-hidden="true" />
                <span className="flex flex-col leading-tight">
                  <span>โทรยืนยันกับบริษัท</span>
                  <span className="text-footnote font-medium opacity-90">เบอร์ทางการที่จดทะเบียนไว้</span>
                </span>
              </span>
              <span className="text-title3 font-bold tabular-nums">{agencyPhone.display}</span>
            </a>
            <p className="text-footnote text-label-2 px-1">ถ้าเบอร์ในแชตไม่ตรงกับเบอร์นี้ ให้สงสัยไว้ก่อนว่าเป็นมิจฉาชีพ</p>
          </div>
        ) : primary ? (
          <HotlineRow line={primary} prominent />
        ) : (
          <Link
            href={agency?.name_th ? `/agencies?q=${encodeURIComponent(agency.name_th)}` : "/agencies"}
            className="btn btn-prominent btn-lg w-full"
          >
            ดูเบอร์ทางการของบริษัท
          </Link>
        )}
        <HotlineRow line={secondary} />
      </section>

      {/* 4 · Before you pay — a personal checklist */}
      <section aria-labelledby="checklist" className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between px-1">
          <h2 id="checklist" className="text-title3 font-bold text-label">
            ก่อนจ่ายเงิน เช็ค 5 ข้อ
          </h2>
          <span className="text-footnote text-label-2 tabular-nums" aria-live="polite">
            ครบ {doneCount}/{CHECKLIST.length}
          </span>
        </div>
        <ul className="inset-list">
          {CHECKLIST.map((item) => (
            <li key={item.id}>
              <label className="flex items-start gap-3 px-4 py-3.5 min-h-11 cursor-pointer hover:bg-fill transition-colors">
                <input
                  type="checkbox"
                  className="check mt-0.5"
                  checked={!!checklist[item.id]}
                  onChange={(e) => setChecklist((prev) => ({ ...prev, [item.id]: e.target.checked }))}
                />
                <span className={`text-callout ${checklist[item.id] ? "text-label-2" : "text-label"}`}>{item.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-footnote text-label-2 px-1">
        ผลนี้เป็นการประเมินเบื้องต้นจากข้อมูลที่คุณให้และฐานข้อมูลที่เรามี ไม่สามารถรับรองความปลอดภัยได้ 100%
        โปรดยืนยันกับกรมการจัดหางานโดยตรงก่อนตัดสินใจ
      </p>

      {/* 5 · Secondary actions */}
      <div className="flex flex-col gap-3 no-print">
        <div className="flex flex-col sm:flex-row gap-2">
          <ShareRow />
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Link href="/" className="btn btn-tinted flex-1">
            <RotateCcw size={18} aria-hidden="true" /> ตรวจสอบบริษัทอื่น
          </Link>
          <button type="button" onClick={() => window.print()} className="btn btn-gray flex-1">
            <Printer size={18} aria-hidden="true" /> บันทึกเป็น PDF
          </button>
        </div>
        <Link href="/report-scam" className="btn btn-plain self-center">
          เจอมิจฉาชีพ? แจ้งเบาะแสเพื่อเตือนคนอื่น
        </Link>
      </div>
    </div>
  );
}

export default function Result() {
  return (
    <div className="w-full flex flex-col items-center">
      <Suspense
        fallback={
          <div role="status" className="flex flex-col items-center justify-center py-20 gap-3 text-label-2">
            <span className="h-8 w-8 rounded-full border-[3px] border-accent border-t-transparent animate-spin" aria-hidden="true" />
            กำลังโหลดผลลัพธ์…
          </div>
        }
      >
        <ResultContent />
      </Suspense>
    </div>
  );
}
