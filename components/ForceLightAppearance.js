"use client";

import { useEffect } from "react";

// Admin screens are built on light-only slate classes; pin them to light
// appearance so the public site's Dark Mode tokens don't leak in.
export default function ForceLightAppearance() {
  useEffect(() => {
    const el = document.documentElement;
    el.dataset.appearance = "light";
    el.style.colorScheme = "light";
    return () => {
      delete el.dataset.appearance;
      el.style.colorScheme = "";
    };
  }, []);
  return null;
}
