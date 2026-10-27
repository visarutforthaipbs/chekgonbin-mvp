import TW from "country-flag-icons/react/3x2/TW";
import KR from "country-flag-icons/react/3x2/KR";
import JP from "country-flag-icons/react/3x2/JP";
import IL from "country-flag-icons/react/3x2/IL";
import RO from "country-flag-icons/react/3x2/RO";
import LT from "country-flag-icons/react/3x2/LT";
import AE from "country-flag-icons/react/3x2/AE";
import TH from "country-flag-icons/react/3x2/TH";

// Only the countries we publish — keeps the bundle to ~1 KB per flag.
const Flags = { TW, KR, JP, IL, RO, LT, AE, TH };

// Country flag as an SVG (country-flag-icons, MIT), 3:2, rounded, hairline border so white
// flags (JP) hold their shape on white. Never an emoji — emoji flags render as letters on
// Windows and differ per OS.
export default function Flag({ code, size = 20, className = "", title }) {
  const Cmp = Flags[code];
  if (!Cmp) return null;
  const h = size;
  const w = Math.round(size * 1.5);
  return (
    <span
      className={`inline-flex shrink-0 overflow-hidden rounded-[3px] ring-1 ring-inset ring-[var(--separator)] ${className}`}
      style={{ width: w, height: h }}
      aria-hidden={title ? undefined : "true"}
    >
      <Cmp title={title} width={w} height={h} style={{ display: "block" }} />
    </span>
  );
}
