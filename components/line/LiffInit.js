"use client";
import { useEffect } from "react";
import { initLiff } from "./liff";

// Mount once in the root layout. Marks <html data-in-line> when opened inside LINE
// so CSS can hide chrome that doesn't belong in a LINE webview.
export default function LiffInit() {
  useEffect(() => {
    initLiff().then((liff) => {
      if (liff && liff.isInClient()) document.documentElement.setAttribute("data-in-line", "");
      // Deep links like /#scam-signals (rich menu) target client-rendered sections that
      // don't exist yet when the browser does its own hash scroll — scroll once they do.
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      let tries = 0;
      const t = setInterval(() => {
        const el = document.getElementById(id);
        if (el || ++tries > 20) {
          clearInterval(t);
          el?.scrollIntoView({ block: "start" });
        }
      }, 150);
    });
  }, []);
  return null;
}
