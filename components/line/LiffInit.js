"use client";
import { useEffect } from "react";
import { initLiff } from "./liff";

// Mount once in the root layout. Marks <html data-in-line> when opened inside LINE
// so CSS can hide chrome that doesn't belong in a LINE webview.
export default function LiffInit() {
  useEffect(() => {
    initLiff().then((liff) => {
      if (liff && liff.isInClient()) document.documentElement.setAttribute("data-in-line", "");
    });
  }, []);
  return null;
}
