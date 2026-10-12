"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Lock, ImagePlus, Loader2, Trash2, Plus } from "lucide-react";
import { trackEvent } from "@/utils/analytics";

const QUICK_TAGS = [
  "เก็บค่าธรรมเนียมล่วงหน้า",
  "แอบอ้างชื่อบริษัทจริง",
  "เสนอรายได้สูงเกินจริง",
  "ชวนผ่านกลุ่ม/บัญชีโซเชียลส่วนตัว",
];

const EMPTY = {
  agencyName: "",
  contactPerson: "",
  contactInfo: "",
  evidence: "",
  description: "",
  reporterName: "",
  reporterPhone: "",
};

const MAX_BYTES = 5 * 1024 * 1024;

function Field({ id, label, hint, required, error, children }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-callout font-bold text-label">
        {label}
        {required ? <span className="text-label-2 font-medium"> (จำเป็น)</span> : <span className="text-label-2 font-medium"> (ไม่บังคับ)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="flex items-start gap-1.5 text-footnote text-danger-ink">
          <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-footnote text-label-2">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export default function ReportScamClient() {
  const [formData, setFormData] = useState(EMPTY);
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef(null);

  const set = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  }, []);

  const handleAddTag = useCallback((tag) => {
    setFormData((prev) => {
      const tagText = `[รูปแบบ: ${tag}]`;
      if (prev.description.includes(tagText)) return prev;
      return { ...prev, description: prev.description ? `${prev.description}\n${tagText}` : tagText };
    });
    setErrors((prev) => ({ ...prev, description: undefined }));
  }, []);

  const readFile = useCallback(
    (file) => {
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        setErrors((p) => ({ ...p, evidence: "เลือกได้เฉพาะไฟล์รูปภาพ (JPEG, PNG, WebP)" }));
        return;
      }
      if (file.size > MAX_BYTES) {
        setErrors((p) => ({ ...p, evidence: "รูปใหญ่เกิน 5MB — ลองครอปหรือส่งภาพหน้าจอใหม่" }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        set("evidence", reader.result);
        setPreviewUrl(reader.result);
        setFileName(file.name);
      };
      reader.readAsDataURL(file);
    },
    [set]
  );

  const validate = () => {
    const next = {};
    if (!formData.agencyName.trim()) next.agencyName = "กรอกชื่อบริษัทหรือชื่อนายหน้าที่ติดต่อมา";
    if (!formData.evidence) next.evidence = "แนบรูปหลักฐานอย่างน้อย 1 รูป เช่น ภาพหน้าจอแชตหรือสลิปโอนเงิน";
    if (!formData.description.trim()) next.description = "เล่าสั้นๆ ว่าเกิดอะไรขึ้น";
    setErrors(next);
    const first = ["agencyName", "evidence", "description"].find((k) => next[k]);
    if (first) {
      const el = document.getElementById(first === "evidence" ? "report-evidence-file" : `report-${first}`);
      el?.focus();
      el?.scrollIntoView({ block: "center" });
    }
    return !first;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading || !validate()) return;
    setIsLoading(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/report-scam", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.status === 429) {
        setSubmitError("ส่งรายงานบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่");
        return;
      }
      if (!response.ok) throw new Error("submit failed");

      trackEvent("report_scam_submit", {
        has_evidence: formData.evidence ? "yes" : "no",
        has_contact_info: formData.contactInfo?.trim() ? "yes" : "no",
      });
      setSubmitted(true);
      setFormData(EMPTY);
      setPreviewUrl("");
      setFileName("");
      window.scrollTo({ top: 0 });
    } catch {
      setSubmitError("ส่งไม่สำเร็จ ข้อมูลที่กรอกยังอยู่ — ตรวจสอบอินเทอร์เน็ตแล้วกดส่งอีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-xl px-4 md:px-6 py-16 md:py-24 flex flex-col items-center text-center gap-4">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-safe-fill text-white">
            <CheckCircle2 size={34} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <h1 className="text-title1 font-bold text-label" tabIndex={-1}>
            ได้รับรายงานแล้ว ขอบคุณที่ช่วยเตือนคนอื่น
          </h1>
          <p className="text-body text-label-2">
            ทีมงานจะตรวจสอบข้อมูล และเพิ่มเข้าฐานข้อมูลเฝ้าระวังเพื่อเตือนคนอื่น ข้อมูลของคุณจะไม่ถูกเปิดเผยต่อสาธารณะ
          </p>
          <p className="text-callout text-label">
            ถ้าเสียเงินไปแล้ว โทร <a href="tel:1694" className="font-bold text-accent-ink underline underline-offset-2">1694</a>{" "}
            สายด่วนกระทรวงแรงงาน และแจ้งความที่สถานีตำรวจ
          </p>
          <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full sm:w-auto">
            <Link href="/" className="btn btn-prominent">
              กลับไปตรวจสอบบริษัท
            </Link>
            <button type="button" className="btn btn-gray" onClick={() => setSubmitted(false)}>
              แจ้งอีกรายการ
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full max-w-2xl px-4 md:px-6 pt-8 md:pt-14 pb-12 md:pb-20 flex flex-col gap-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-title1 md:text-large font-bold text-label tracking-tight">แจ้งเบาะแสมิจฉาชีพ</h1>
          <p className="text-body text-label-2">
            เจอบริษัทหรือนายหน้าที่น่าสงสัย? ข้อมูลของคุณช่วยเตือนคนที่กำลังจะโอนเงินคนต่อไป
          </p>
          <p className="flex items-start gap-2 text-footnote text-label-2">
            <Lock size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
            ชื่อและเบอร์ของผู้แจ้งเก็บเป็นความลับ ไม่เปิดเผยต่อสาธารณะ
          </p>
        </header>

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
          {/* 1 — who */}
          <fieldset className="card p-5 md:p-6 flex flex-col gap-5">
            <legend className="sr-only">ข้อมูลบริษัทหรือนายหน้า</legend>
            <h2 className="text-title3 font-bold text-label" aria-hidden="true">
              ใครติดต่อคุณมา
            </h2>
            <Field id="report-agencyName" label="ชื่อบริษัทหรือนายหน้า" required error={errors.agencyName}>
              <input
                id="report-agencyName"
                type="text"
                placeholder="เช่น บจก. จัดหางาน ABC"
                className="field"
                value={formData.agencyName}
                onChange={(e) => set("agencyName", e.target.value)}
                aria-invalid={errors.agencyName ? "true" : undefined}
                aria-describedby={errors.agencyName ? "report-agencyName-error" : undefined}
                aria-required="true"
              />
            </Field>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="report-contactPerson" label="ชื่อคนที่ติดต่อมา">
                <input
                  id="report-contactPerson"
                  type="text"
                  placeholder="เช่น คุณสมชาย"
                  className="field"
                  value={formData.contactPerson}
                  onChange={(e) => set("contactPerson", e.target.value)}
                />
              </Field>
              <Field id="report-contactInfo" label="เบอร์ / LINE / อีเมล">
                <input
                  id="report-contactInfo"
                  type="text"
                  placeholder="081-234-5678 หรือ @lineid"
                  className="field"
                  value={formData.contactInfo}
                  onChange={(e) => set("contactInfo", e.target.value)}
                />
              </Field>
            </div>
          </fieldset>

          {/* 2 — what happened */}
          <fieldset className="card p-5 md:p-6 flex flex-col gap-5">
            <legend className="sr-only">หลักฐานและรายละเอียด</legend>
            <h2 className="text-title3 font-bold text-label" aria-hidden="true">
              เกิดอะไรขึ้น
            </h2>

            <div className="flex flex-col gap-2">
              <span id="evidence-label" className="text-callout font-bold text-label">
                รูปหลักฐาน<span className="text-label-2 font-medium"> (จำเป็น)</span>
              </span>
              {!previewUrl ? (
                <label
                  htmlFor="report-evidence-file"
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragging(false);
                    readFile(e.dataTransfer.files?.[0]);
                  }}
                  className={`flex flex-col items-center justify-center gap-2 min-h-40 rounded-2xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-colors focus-within:border-accent ${
                    errors.evidence
                      ? "border-danger-ink bg-danger-tint"
                      : dragging
                      ? "border-accent bg-fill"
                      : "border-separator-strong bg-surface-2 hover:bg-fill"
                  }`}
                >
                  <ImagePlus size={30} className="text-accent-ink" aria-hidden="true" />
                  <span className="text-callout font-bold text-label">แตะเพื่อเลือกรูป</span>
                  <span className="text-footnote text-label-2">ภาพหน้าจอแชต สลิปโอนเงิน หรือโพสต์รับสมัคร · ไม่เกิน 5MB</span>
                  <input
                    ref={fileRef}
                    id="report-evidence-file"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    aria-labelledby="evidence-label"
                    aria-invalid={errors.evidence ? "true" : undefined}
                    aria-describedby={errors.evidence ? "report-evidence-error" : undefined}
                    onChange={(e) => readFile(e.target.files?.[0])}
                  />
                </label>
              ) : (
                <div className="flex items-center gap-3 rounded-2xl bg-surface-2 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="ตัวอย่างรูปหลักฐานที่เลือก" className="h-20 w-20 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-callout font-bold text-label truncate">{fileName || "รูปหลักฐาน"}</p>
                    <p className="text-footnote text-safe-ink flex items-center gap-1">
                      <CheckCircle2 size={14} aria-hidden="true" /> แนบแล้ว
                    </p>
                  </div>
                  <button
                    type="button"
                    className="icon-btn"
                    aria-label="ลบรูปนี้"
                    onClick={() => {
                      set("evidence", "");
                      setPreviewUrl("");
                      setFileName("");
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                  >
                    <Trash2 size={20} aria-hidden="true" />
                  </button>
                </div>
              )}
              {errors.evidence && (
                <p id="report-evidence-error" className="flex items-start gap-1.5 text-footnote text-danger-ink">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
                  {errors.evidence}
                </p>
              )}
            </div>

            <Field id="report-description" label="เล่าเหตุการณ์" required error={errors.description} hint="แตะรูปแบบที่ตรงด้านบน แล้วเล่าเพิ่มสั้นๆ">
              <div className="flex flex-wrap gap-2 -mt-0.5" role="group" aria-label="รูปแบบการหลอกลวงที่พบบ่อย">
                {QUICK_TAGS.map((tag) => {
                  const added = formData.description.includes(`[รูปแบบ: ${tag}]`);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleAddTag(tag)}
                      aria-pressed={added}
                      className={`btn min-h-11 px-3.5 text-footnote font-medium ${added ? "btn-tinted" : "btn-gray"}`}
                    >
                      {added ? <CheckCircle2 size={16} aria-hidden="true" /> : <Plus size={16} aria-hidden="true" />}
                      {tag}
                    </button>
                  );
                })}
              </div>
              <textarea
                id="report-description"
                placeholder="เช่น ให้โอนค่าดำเนินการ 30,000 บาทเข้าบัญชีส่วนตัว แล้วติดต่อไม่ได้"
                className="field min-h-36 resize-y"
                value={formData.description}
                onChange={(e) => set("description", e.target.value)}
                aria-invalid={errors.description ? "true" : undefined}
                aria-describedby={errors.description ? "report-description-error" : "report-description-hint"}
                aria-required="true"
              />
            </Field>
          </fieldset>

          {/* 3 — reporter (optional) */}
          <fieldset className="card p-5 md:p-6 flex flex-col gap-5">
            <legend className="sr-only">ข้อมูลผู้แจ้ง</legend>
            <div className="flex flex-col gap-1">
              <h2 className="text-title3 font-bold text-label" aria-hidden="true">
                ให้เราติดต่อกลับ
              </h2>
              <p className="text-footnote text-label-2">ไม่บังคับ · ใช้เฉพาะเพื่อสอบถามข้อมูลเพิ่ม และเก็บเป็นความลับ</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field id="report-reporterName" label="ชื่อของคุณ">
                <input
                  id="report-reporterName"
                  type="text"
                  autoComplete="name"
                  className="field"
                  value={formData.reporterName}
                  onChange={(e) => set("reporterName", e.target.value)}
                />
              </Field>
              <Field id="report-reporterPhone" label="เบอร์โทรของคุณ">
                <input
                  id="report-reporterPhone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="08x-xxx-xxxx"
                  className="field"
                  value={formData.reporterPhone}
                  onChange={(e) => set("reporterPhone", e.target.value)}
                />
              </Field>
            </div>
          </fieldset>

          {submitError && (
            <p role="alert" className="flex items-start gap-2 rounded-xl bg-danger-tint px-4 py-3 text-callout text-danger-ink">
              <AlertCircle size={20} className="shrink-0 mt-0.5" aria-hidden="true" />
              {submitError}
            </p>
          )}

          <button type="submit" disabled={isLoading} aria-busy={isLoading} className="btn btn-prominent btn-lg w-full">
            {isLoading ? (
              <>
                <Loader2 size={22} className="animate-spin" aria-hidden="true" /> กำลังส่ง…
              </>
            ) : (
              "ส่งเบาะแส"
            )}
          </button>
          <p className="-mt-3 text-center text-caption text-label-2">
            การส่งถือว่ายอมรับ{" "}
            <Link href="/privacy-policy" className="underline underline-offset-2">
              นโยบายความเป็นส่วนตัว
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
