# Project Handoff Documentation — เช็คก่อนบิน (ChekGonBin)

## 📌 Project Overview
**เช็คก่อนบิน (ChekGonBin)** is a public safety web application designed to protect Thai job seekers from overseas employment scams. It provides real-time agency verification against Department of Employment (DOE) Whitelists, risk assessment scoring, scam reporting, and emergency guidance.

* **Repository:** [visarutforthaipbs/chekgonbin-mvp](https://github.com/visarutforthaipbs/chekgonbin-mvp.git)
* **Main Branch:** `main`

---

## 🛠️ Technology Stack
* **Framework:** Next.js 16 (App Router with Turbopack) + React 19
* **Styling:** Tailwind CSS v4 (`globals.css` with `@theme` config) + Framer Motion
* **Database & Storage:** Supabase (PostgreSQL + Storage bucket `evidence`)
* **Scraper & Cron:** Node.js / Cheerio + Iconv-lite (TIS-620 decoding) via Vercel Cron

---

## 🚀 Latest Accomplishments & Recent Changes

### 1. Mobile-First & UI/UX Upgrades
* **Global Aesthetics:** Added ambient radial gradient blur spots (`layout.js`) and a persistent sticky glassmorphic navbar (`components/Navbar.js`).
* **Home Page (`app/page.js`):**
  * Focus ring glows on input fields (`focus:ring-brand-primary/10`).
  * Debounced Whitelist autocomplete dropdown wrapped with Framer Motion entry animations.
  * Mobile keyboard auto-dismiss (`document.activeElement.blur()`) on suggestion selection.
  * Capped dropdown height (`max-h-48 md:max-h-60`) and responsive tooltips (`max-w-[80vw]`) to prevent clipping on mobile viewports.
  * Spring-animated "เทียบ Whitelist" checkmark badge.
* **Result Page (`app/result/page.js`):**
  * Animated circular SVG stroke gauge for risk score percentage.
  * Threat-level dynamic glow shadows (Low/Medium/High).
  * Stateful interactive safety checklist with scale & line-through animations.
  * Click-to-call hotline links (`tel:1694`, `tel:1300`).
  * Print-optimized styling (`@media print`) for downloading PDF reports.
* **Agencies Page (`app/agencies/AgenciesClient.js`):**
  * Replaced loading spinner with a 5-card shimmer skeleton layout (`.animate-shimmer`).
  * Added hover-lift translation and shadow effects (`hover:-translate-y-1 hover:shadow-lg`).
  * Click-to-copy phone CTA with micro-interaction feedback.
* **Scam Report Page & API (`app/report-scam`):**
  * Drag-and-drop evidence dropzone with base64 preview.
  * Server-side upload to Supabase `evidence` bucket via `createAdminClient()`.
  * Quick-tag pills for common scam patterns.
* **About Page (`app/about/AboutClient.js`):**
  * Integrated partner logos (`public/partners/prachatham.png` and `public/partners/thai-migrant-watch.png`).

### 2. Code Quality & Build Verification
* **ESLint:** 100% clean (`npm run lint`). Zero errors or warnings.
* **Build:** Production compile succeeds cleanly (`npm run build`).

---

## ⚙️ Cron Job & Scraper Architecture

### How the Scraper Works
* **Endpoint:** `/api/cron/scrape-agencies` (`nodejs` runtime, `sin1` Singapore region). **2026-10-15: no longer scheduled on Vercel** — DOE drops connections from cloud IPs (logged `UND_ERR_SOCKET`). The daily refresh runs from a Thai IP: collectors-manager cron `checkgonbin-feed-watchdog` → `~/Documents/Personal-Project/agent-context/scripts/checkgonbin_refresh.py` (upsert-only, ≥100 rows gate).
* **Schedule:** Daily at `0 20 * * *` (03:00 AM Thailand Time ICT) via Vercel Cron.
* **Security:** Checked via `Authorization: Bearer ${process.env.CRON_SECRET}`.
* **Workflow:**
  1. Requests `https://toea.doe.go.th/LBANK-WEB/main.php`.
  2. Decodes TIS-620 Thai text to UTF-8 using `iconv-lite`.
  3. Extracts session cookies and hidden tokens.
  4. Scrapes agency tables page-by-page using `cheerio` with an 800ms throttle delay between pages.
  5. Upserts company data into Supabase `agencies` table in batches of 200.

### Local Testing Instructions
* **Via API Route:**
  ```bash
  curl -H "Authorization: Bearer YOUR_CRON_SECRET" http://localhost:3000/api/cron/scrape-agencies
  ```
* **Via Python Script:**
  ```bash
  python scripts/scraper.py
  ```

---

## 📁 Key File Map
* `app/page.js` — Home page with risk assessment form & Whitelist autocomplete.
* `app/result/page.js` — Risk score calculation results & safety checklist.
* `app/agencies/AgenciesClient.js` — Directory of whitelisted agencies with search & pagination.
* `app/report-scam/ReportScamClient.js` — Scam report form with evidence upload.
* `app/api/cron/scrape-agencies/route.js` — Automated daily scraper endpoint.
* `components/Navbar.js` — Sticky glassmorphic navigation header.
* `utils/request.js` — IP rate-limiting & header utilities.

---

## 📌 Next Steps / Ideas for Future Agents
* Add analytical chart breakdowns on `/admin` dashboard for reported scam trends.
* Implement optional SMS/Line Notify alerts when a newly reported scam matches a Whitelist company name.
