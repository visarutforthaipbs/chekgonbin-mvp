"use client";

import { MotionConfig } from "framer-motion";

// Honors the OS "Reduce Motion" setting for every framer-motion animation.
export default function Providers({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
