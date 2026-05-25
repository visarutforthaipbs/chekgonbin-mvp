# ChekGonBin MVP

## What This Is
เช็คก่อนบิน (ChekGonBin) is a Thai civic safety tool for job seekers to verify recruitment agencies and assess scam risk before going abroad. It checks against the DOE (Department of Employment) whitelist/blacklist databases in real-time.

Live at: checkgonbin.in.th

---

## Users
Thai job seekers considering overseas work — often anxious, mobile-first, with limited time to verify. Under Signal 39, treat these as **crisis-mode users** operating at <30 bps. Every design decision must reduce cognitive load.

---

## Stack
- **Framework:** Next.js 16 (App Router, JavaScript)
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide-React
- **Animation:** Framer Motion
- **Backend:** Supabase
- **Font:** DB Helvethaica X (normal / 500 / bold — 3 weights only, Signal 39 compliant)

---

## Design System — Signal 39

All UI decisions follow the Signal 39 framework. Read `39design.md` for the full specification before making any design changes.

### Color Tokens
These colors ARE the data — never use them decoratively.

| Token | Hex | Signal 39 Role |
|---|---|---|
| `brand-primary` | `#e5472e` | Primary action, brand identity |
| `brand-secondary` | `#0b1b3b` | Deep structural background |
| `signal-red` | `#ef4444` | High threat / danger — Layer 1 only |
| `signal-orange` | `#f97316` | Medium threat / caution — Layer 1 only |
| `signal-green` | `#22c55e` | Safe / verified — Layer 1 only |

### Signal 39 Utility Classes (globals.css)
- `.no-noise` — strips all decorative shadow/border/ring
- `.breather` — standard cognitive whitespace (`p-4 md:p-8`, `gap-4 md:gap-6`)
- `.threat-low` — green left-border card for safe results (Layer 1)
- `.threat-medium` — orange left-border card for caution results (Layer 1)
- `.threat-high` — red left-border card for danger results (Layer 1)

### The 3-Layer Architecture for This Project
- **Layer 1:** Threat color (red/orange/green) communicates risk level before the user reads a single word
- **Layer 2:** Max 3 inputs in the risk check form (agency name, contact info, 2 risk flag checkboxes)
- **Layer 3:** Risk verdict card — one primary finding surfaced first, all supporting detail behind progressive disclosure

---

## Signal 39 Rules for This Project

1. **Crisis-mode density:** Users may be anxious. Default to 30% less information density than feels comfortable — more whitespace, fewer competing elements.
2. **Threat color is non-negotiable:** Never use `signal-red`, `signal-orange`, or `signal-green` for aesthetics. They encode threat level and nothing else.
3. **Mobile-first always:** The Mute/Blur Test must pass on a 375px screen. If threat level isn't readable without text, redesign.
4. **Zero Decorative Pixels:** The two blur blobs in `layout.js` are the only permitted decorative elements (Layer 1 warmth at <5% opacity). No new decorative shadows, gradients, or borders.
5. **Result page = The Receipt:** The risk result is the Meaning ROI Summary. Surface the verdict (safe/caution/danger) first, then supporting evidence behind progressive disclosure.
6. **Self-correction before output:** Before writing any component, run the Mute/Blur Test mentally. If blurring the text breaks the hierarchy, redesign Layer 1 first.

---

## File Structure
```
app/
  page.js          — Home: Hero + risk check form
  result/          — Risk verdict page (The Receipt)
  agencies/        — Agency directory
  report-scam/     — Scam reporting flow
  media-hub/       — Press/media content
  admin/           — Admin panel
components/        — Shared UI components
utils/             — Utility functions
scripts/           — Data scripts
39design.md        — Signal 39 full specification (read before any design work)
```
