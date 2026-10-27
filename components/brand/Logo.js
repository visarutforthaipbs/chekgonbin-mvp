"use client";

import { useEffect, useRef, useState } from "react";
import paths from "./brand-paths.json";

// Inline THMW logo so each word is a styleable group.
// variant: "watch" (ink words, teal WATCH, coral heart — default), "ink" (all ink + coral heart),
//          "current" (original: RANT WATCH teal).
// animate: "load" (words rise in once, heart beats once), "inview" (same, when scrolled into
//          view — footer), "none". Honours prefers-reduced-motion via CSS.
const FILLS = {
  watch: { thai: "var(--label)", heart: "var(--brand-heart)", mig: "var(--label)", rant: "var(--label)", watch: "var(--accent)" },
  ink: { thai: "var(--label)", heart: "var(--brand-heart)", mig: "var(--label)", rant: "var(--label)", watch: "var(--label)" },
  current: { thai: "var(--label)", heart: "var(--brand-heart)", mig: "var(--label)", rant: "var(--accent)", watch: "var(--accent)" },
};
const ORDER = ["thai", "heart", "mig", "rant", "watch"];

function Group({ name, html, fill, delay }) {
  // The path data is static, generated from the owner's logo by scripts (potrace). Not user input.
  return (
    <g
      className={`logo-part logo-${name}`}
      fill={fill}
      style={{ "--d": `${delay}ms` }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function Logo({ kind = "lockup", variant = "watch", animate = "load", className = "", title = "Thai Migrant Watch" }) {
  const data = paths[kind];
  const ref = useRef(null);
  const [on, setOn] = useState(animate === "load");

  useEffect(() => {
    if (animate !== "inview" || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [animate]);

  const fills = FILLS[variant] || FILLS.watch;
  // heart transform-origin in viewBox units (centre of the heart's bbox)
  const hb = paths.heartBox;
  const hx = (hb.x0 + hb.x1) / 2;
  const hy = (hb.y0 + hb.y1) / 2;

  return (
    <svg
      ref={ref}
      viewBox={data.viewBox}
      role="img"
      aria-label={title}
      className={`thmw-logo ${on ? "is-on" : ""} ${animate === "none" ? "no-anim" : ""} ${className}`}
      style={{ "--hx": `${hx}px`, "--hy": `${hy}px` }}
    >
      {data.groups.map((g, i) => {
        const name = ORDER.find((n) => g.startsWith(`<g class="${n}"`)) || ORDER[i];
        // strip the outer <g class="…" transform="…"> wrapper; keep its transform on our group
        const m = g.match(/^<g class="\w+" transform="([^"]*)">([\s\S]*)<\/g>$/);
        const inner = m ? m[2] : g;
        const tf = m ? m[1] : "";
        return (
          <g key={name} transform={tf || undefined}>
            <Group name={name} html={inner} fill={fills[name]} delay={80 * i} />
          </g>
        );
      })}
    </svg>
  );
}
