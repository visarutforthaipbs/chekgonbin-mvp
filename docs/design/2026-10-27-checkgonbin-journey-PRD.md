# PRD — เช็คก่อนบิน (checkgonbin.in.th) as the whole-journey platform
Owner: THMW. Author: thmw-pm, 27 Oct 2026. Status: **APPROVED 27 Oct 2026** with owner amendments: site name = **Thai Migrant Watch** (new domain to come; `checkgonbin.in.th` stays until then), **light appearance only** (dark tokens opt-in via `data-appearance="dark"`), logo as traced SVG (`public/brand/thmw-wordmark.svg`, `thmw-lockup.svg`), slogan "คนไทยต้องไม่ไปตายดาบหน้า" as text. Build on `feat/journey`.
Evidence: `~/.hermes/profiles/thmw-pm/cache/scratch/research/THMW-worker-research-brief-2026-10-27.md` (39 findings, # refs below) and `checkgonbin-platform-design-2026-10-27.md`.
Design discipline: Apple HIG (skill `apple-hig-design`, `references/specs.md`) + apple.com web idiom, mapped onto the repo's own `39design.md` (Signal 39) and the existing token sheet `app/globals.css`.

## 0. Non-design findings first
- Dev server `:3000` and prod both return 200. `render_check.py` on `/`, `/rounds`, `/agencies` (390/1280 × light/dark): **0 target fails, 0 page errors**, body 18 px DB Helvethaica X, label `#0b1b3b` on `#f5f5f7`. The site is already HIG-clean at the measurement level; this PRD is about **structure, brand and journey**, not repairs.
- `/agencies` has 2 `<h1>` (one hidden SPA header or a real duplicate — check before shipping).

## 1. Owner decisions (fill in before build)

| # | Decision | Recommendation | Owner |
|---|---|---|---|
| D1 | Brand colour source | THMW logo: **teal `#217E9F`** (measured from the logo file) = the ONE interactive accent; **coral `#E5472E`** (the heart) = brand mark + the single emergency action + danger states only. Current site accent is red `#d93d24` → becomes the emergency/danger fill. | ☐ |
| D2 | Logo | Keep the **THMW logo** (as supplied) in the nav at 44 px (the wordmark is square; 28 px is illegible), footer and OG cards; "เช็คก่อนบิน" stays the product name in text next to it ("เช็คก่อนบิน · by Thai Migrant Watch"). The current shield icon is retired. | ☐ |
| D3 | Typeface | **System stack** (`-apple-system, BlinkMacSystemFont, system-ui, "Noto Sans Thai"`) — the true apple.com idiom, zero font download, Thai set by the OS (SF Thai on Apple, Noto Thai on Android). Alternative: keep DB Helvethaica X (condensed; needs +1 px scale as today). ≤ 2 families either way. | ☐ |
| D4 | Pilot countries | Israel + Romania + Lithuania (our permits, zero existing research) + women's massage/spa path. Korea, Taiwan phase 2. (#0, #9, #29) | ☐ |
| D5 | Community | Aggregates-only at launch (n ≥ 5 per corridor), free text to newsroom. (#34, #10) | ☐ |
| D6 | Research before build | Start Phase 1 now; 5–6 Messenger interviews run in parallel and feed tab copy. | ☐ |
| D7 | Delivery | Clickable prototype on branch `feat/journey` off `feat/open-rounds`; preview via dev server screenshots; nothing pushed/merged without "ship it". | ☐ |

## 2. Users and the one primary task per screen (HIG → Purpose)

| Persona | Volume/yr | Primary task on arrival | Source |
|---|---|---|---|
| First-timer | ~55,000 | "บริษัทนี้จริงไหม / ต้องจ่ายเท่าไหร่" | #0b, inbox 61% |
| Repeat worker | 36,936 (largest) | "โทรใคร / กองทุนจ่ายอะไร" | #0b |
| Family at home | partners of 95,084 | "คนของฉันอยู่ไหน ติดต่อสถานทูตยังไง" | #19 |

Profile: Isan 58 %, secondary school 54 %, on LINE/FB, arriving from a forwarded link on a phone (#0, #6–8, #33, #39). **Compact size class is the design target; regular (desktop) is the derivative.**

## 3. Top 5 changes, with the HIG principle

| # | Change | Principle (HIG) |
|---|---|---|
| 1 | Home becomes **one question** ("อยากไปทำงานประเทศไหน?") + **one emergency button**; the agency search moves to "เช็ก 3 อย่างก่อนโอนเงิน" below the fold. Today the home page *is* the form. | Simplicity → establish hierarchy; Purpose → one primary task |
| 2 | **Country page = 7 journey tabs** (segmented control on compact, sidebar on regular). Today country content is scattered across posts. | Familiarity → consistent structure; Layout → progressive disclosure |
| 3 | **Accent re-pointed to the logo teal**; red reserved for the emergency action and danger. Today red = brand + CTA + danger (three meanings). | Color → "same colour ≠ two meanings"; one accent |
| 4 | **Share card on every page** (LINE/FB) with one number + one warning; OG image generated per page. | Agency → people share through their own networks (#39) |
| 5 | **Human reply path** with published response time under every hotline card. | Feedback → tell people what happens next |

## 4. Colour roles (light / dark) — measured contrast

| Role | Light | Dark | Measured | Use |
|---|---|---|---|---|
| `--accent` | `#217E9F` (logo teal) | `#217E9F` | white on it **4.62:1** ✓ | the ONE filled button per view, active tab, focus ring |
| `--accent-ink` | `#1B6F8D` | `#5FB3D1` | 5.21:1 on `#f5f5f7`; 7.17:1 on `#1c1c1e` ✓ | links ("›"), accent text, icons |
| `--accent-tint` | `#E6F1F5` | `rgba(33,126,159,.18)` | ink on tint 5.29:1 ✓ | selected chips, info callouts |
| `--brand-heart` | `#E5472E` | `#E5472E` | decoration only (white on it 3.98:1 ✗ for text) | logo heart, nothing interactive |
| `--danger-fill` | `#D93D24` | `#FF453A` | white on it **4.52:1** ✓ | the emergency button, scam warnings |
| `--danger-ink` | `#B42318` | `#FF6961` | 4.8:1 / 6.39:1 ✓ | danger text |
| `--label` | `#1D1D1F` | `#F5F5F7` | 16.8:1 | body, headlines (ink — numbers are ink, never accent) |
| `--label-2` | `#6E6E73` | `#A1A1AA` | 4.66:1 on bg ✓ | secondary text |
| `--bg` / `--surface` | `#F5F5F7` / `#FFFFFF` | `#000000` / `#1C1C1E` | — | grouped backgrounds |
| `--glass` | `rgba(255,255,255,.78)` | `rgba(28,28,30,.74)` | — | nav bar + sticky action bar only |
| safe / caution | keep existing fills & inks | keep | ≥ 4.5:1 ✓ | risk tags (Signal 39 Layer 1) |

Deviation recorded: navy `#0b1b3b` label is replaced by apple ink `#1d1d1f`; navy drops out (it was never in the logo).

## 5. Type scale (web, 1 pt = 1 px)

| Style | Size / weight / tracking | Use |
|---|---|---|
| Display | 48 (compact) / 64 (regular), 700, −0.022em | home question only |
| Title 1 | 32 / 40, 700, −0.02em | country H1 |
| Title 2 | 24, 700 | tab headings |
| Headline | 18, 600 | card titles (full headline — never line-clamp Thai) |
| Body | 17, 400, line-height ≥ 1.5 (Thai) | all copy, ≤ 672 px measure |
| Callout | 16, 400 | share-card captions |
| Footnote | 13, 400 | sources, "ข้อมูล ณ วันที่" |
Minimum rendered text 11 px; test at 200 % zoom and 320 px width. Numbers tabular-nums, ink.

## 6. Components (states: default · hover · pressed · focus · disabled)

| Component | Spec |
|---|---|
| Nav bar | glass, 48 px, THMW logo 28 px + "เช็คก่อนบิน" + 4 links on regular; on compact logo + title only. No colour fill. |
| Tab bar (compact) | 4 tabs, labels always on: ประเทศ · เช็กบริษัท · ฉุกเฉิน · เรื่องเล่า. 49 px + safe area. |
| Country picker | 8 pill buttons, 44 px min, teal tint when selected, order = departures (#0) |
| Emergency button | the only red fill, 50 px, `#D93D24`, white 17 px 600; leads to `/emergency/[country]` |
| Journey tabs | compact: scrollable segmented control; regular: left sidebar (≤ 2 levels) |
| Round card | from `RoundParts.js`; one number large (places), window line verbatim "ใบอนุญาตให้รับสมัครได้ถึง 7 ธ.ค. 2569 อาจปิดก่อนหากเต็ม" |
| Cost calculator | 2 inputs (route, quoted amount) → "ส่วนต่างจากที่กฎหมายอนุญาต"; aggregated from permits + #30; never implies a quote is legal |
| Evidence checklist | 5 checkboxes (slip · chat · page URL · contract · ID copy) stored locally; "report before you pay" link to 1506 กด 2 |
| Hotline card | numbers as `tel:` links 44 px; embassy, labour attaché, NGO, 1506 กด 2; fund benefits line (#26); reply-path line "เราตอบใน 24 ชม. ทาง LINE OA" |
| Share card | `og:image` per page (teal band, logo, one number, one warning, IBM Plex/system) + LINE share button |
| Experience form | 5 fields (§4 design doc), anonymous, inline validation in Thai, success state says what happens to the report |
| Aggregate block | shows only when n ≥ 5: "จาก N คน · จ่ายเฉลี่ย X ฿ · Y% งานตรงตามบอก" |
| Status tags | borderless tint, 6 px radius (never look like buttons); pills with 1 px border are controls only |

## 7. Per-page spec — the ONE filled action

| Route | Purpose | Filled action | Secondary |
|---|---|---|---|
| `/` | choose a country | **country pill** (teal) — emergency button is red by role, not a second accent | "เช็กบริษัท" link › |
| `/[country]` (7 tabs) | the journey | per tab: ไปทางไหน → "ดูรอบนี้"; เช็กก่อนจ่าย → "เช็กบริษัท"; เตรียมตัว → "สมัครกองทุน"; มีปัญหา → `tel:` | share card |
| `/emergency/[country]` | get help now | **call** (red, the only red fill on the site) | copy numbers, LINE OA |
| `/agencies` (existing) | verify a company | "เช็กเลย" (teal) | report a page |
| `/rounds` (existing) | open rounds | card › permit page | filter by country |
| `/stories` | community aggregates + form | "เล่าประสบการณ์" (teal) | — |
| `/about` | who we are, "เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน", sources | — | — |

Every page: one `<h1>`, footer with THMW logo + sources line + "ข้อมูล ณ วันที่", `lang="th"`.

## 8. Engineering approach
- Branch `feat/journey` from `feat/open-rounds`. Tokens: edit `app/globals.css` only — re-point `--accent*` to teal, add `--accent-tint`, `--brand-heart`, swap `--label` to ink, font stack per D3. **No hex outside globals.css** (`grep -rn '#[0-9a-fA-F]{6}' app components --include=*.js` must return nothing).
- Data in reviewed repo files: `data/countries/{israel,romania,lithuania}.js` (same discipline as `data/rounds.js`), `data/hotlines/*.js` (from `~/THMW-series/out/*/hotline/facts.json`), `scripts/test-countries.mjs` (banned words, required fields, phones dialable).
- Supabase only for the experience form (`stories` table; RLS insert-only; aggregates via a view with `HAVING count(*) >= 5`). Needs the service key → owner permission.
- OG images: `app/[country]/opengraph-image.js` (Next ImageResponse) with the logo as a static asset.
- Gate: `scripts/hig_check.py` (copy of `hig_audit_matrix.py`) run on every route × 390/1280 × light/dark; pass = `fails 0, lowc 0, small 0, h1 1`. Dark mode via `prefers-color-scheme` (no in-app toggle).

## 9. Acceptance criteria
1. Home shows the question + 8 country pills + the red emergency button above the fold at 390 × 844.
2. Israel, Romania, Lithuania pages render all 7 tabs; empty tabs say "ยังไม่มีข้อมูล — ส่งมาให้เรา", never a graybox.
3. Every `tel:` number in hotline cards dials (Playwright `href^=tel:` check) and is 44 px.
4. Matrix gate passes on all routes, both schemes; contrast of every text node ≥ 4.5:1 (3:1 ≥ 18 px bold).
5. Banned words test extended to the new data files (ค่าใช้จ่ายก่อนเดินทาง, เรียกเก็บเงิน, ปิด 7 ธ.ค., ฟรี, ยังเปิด).
6. Share card renders per page; LINE share opens with the OG image.
7. Lighthouse mobile performance ≥ 90 on a country page on 3G throttling (no webfont if D3 = system).
8. `prefers-reduced-motion`: no animation > 0.01 ms; keyboard tab order logical with visible focus rings (teal).
9. "เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน" present on every route.

## 10. Out of scope / flagged
- No native app (#36, #37). No open comments at launch (D5). No Cloudflare R2.
- Korea/Taiwan/UAE pages, LINE OA groups, cost figures per destination beyond permits + #30 (research gap).
- `/admin` keeps the legacy Signal 39 palette (light-only guard) until a separate task.
- Brand collision flagged: coral is both the logo heart and the danger hue. Resolution above (heart = decoration, danger = `#D93D24` fill). If the owner wants coral anywhere else interactive, this rule breaks.

## 11. HIG deviations recorded
- **No Dark Mode** (owner: the site is white). HIG says respect the system setting; the dark token block is kept but off, so it can be switched on with one attribute later.
- Thai body 17 px with line-height 1.55 (HIG 17/1.29) — tone marks need the room.
- Two brand hues on one page (teal + coral heart) — coral never interactive.
- 39design.md "Rule of Three" applied to tabs by grouping 7 tabs into 3 phases (ก่อนไป · อยู่ที่นั่น · กลับบ้าน) on the regular sidebar; compact shows the flat segmented control.
