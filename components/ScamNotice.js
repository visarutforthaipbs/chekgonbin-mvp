"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, ChevronDown, X } from "lucide-react";

const STORAGE_KEY = "cgb_scam_notice_v1";

/**
 * "รู้ทันกลโกง" — impersonation warning.
 * Replaces the old launch-time modal (HIG: never alert on launch; don't block
 * the primary task). Shown inline where it matters, collapsible, and the
 * collapse is remembered per device.
 */
export default function ScamNotice({ className = "" }) {
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        if (window.localStorage.getItem(STORAGE_KEY) === "collapsed") setOpen(false);
      } catch {}
      setReady(true);
    });
  }, []);

  const toggle = (next) => {
    setOpen(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next ? "open" : "collapsed");
    } catch {}
  };

  return (
    <aside
      aria-label="คำเตือน: มิจฉาชีพแอบอ้างบริษัทจริง"
      className={`rounded-2xl bg-caution-tint border border-[color-mix(in_srgb,var(--caution-fill)_30%,transparent)] ${className} ${ready ? "" : "invisible"}`}
    >
      <div className="flex items-start gap-3 p-4">
        <AlertTriangle className="text-caution-ink shrink-0 mt-0.5" size={22} aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <button
            type="button"
            onClick={() => toggle(!open)}
            aria-expanded={open}
            className="flex w-full items-start justify-between gap-2 text-left min-h-11 -my-2.5 py-2.5"
          >
            <span className="text-headline font-bold text-label">มิจฉาชีพแอบอ้างบริษัทจริง</span>
            {!open && <ChevronDown size={20} className="text-label-2 shrink-0 mt-0.5" aria-hidden="true" />}
          </button>
          {open && (
            <div className="mt-1 flex flex-col gap-2 text-callout text-label">
              <p>
                มิจฉาชีพมักนำชื่อบริษัทและชื่อกรรมการที่จดทะเบียนถูกกฎหมาย ไปทำเว็บหรือเพจปลอม แล้วใส่เบอร์โทรของตัวเอง
              </p>
              <p className="font-bold">
                โทรเฉพาะ “เบอร์ทางการ” ที่แสดงในเว็บนี้ และอย่าโอนเงินผ่านช่องทางอื่น
              </p>
            </div>
          )}
        </div>
        {open && (
          <button type="button" onClick={() => toggle(false)} className="icon-btn -mr-2 -mt-2" aria-label="ย่อคำเตือน">
            <X size={20} aria-hidden="true" />
          </button>
        )}
      </div>
    </aside>
  );
}
