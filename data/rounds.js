// รอบที่เปิดรับ: one entry per DOE recruitment permit (หนังสืออนุญาตให้รับสมัครคนหางาน, จต.2).
//
// RULES FOR EDITING THIS FILE (Thai Migrant Watch house rules):
// - One permit = one entry. Never merge permits, even for the same country/employer.
// - Every value comes from the permit scan itself. Quote conditions verbatim (`quote`).
//   If the permit does not state something, use null and the UI says "ใบอนุญาตไม่ได้ระบุ".
//   Never fill a gap from news, comments or another permit.
// - The window is the agency's authorised recruiting period, NOT a guaranteed open
//   round. The UI always says "ใบอนุญาตให้รับสมัครได้ถึง … อาจปิดก่อนหากเต็ม".
// - Agency phone: only a number printed on THIS permit (`agency.phones`). Otherwise
//   leave it empty; the card links to the DOE registry entry via /agencies?q=.
// - Each entry is read by one reader and confirmed by a second (`verified`).
//   Do not add an entry without both.

export const ROUNDS_UPDATED = "2026-10-27";

const FEE_BAN = "ห้ามเรียกหรือรับค่าบริการ ค่าใช้จ่าย หรือผลประโยชน์ใด ๆ จากคนหางาน";
const doe = (id) => `https://www.doe.go.th/prd/download/download_by_pool_file/${id}`;

export const COUNTRIES = {
  IL: { name: "อิสราเอล" },
  RO: { name: "โรมาเนีย" },
  LT: { name: "ลิทัวเนีย" },
};

export const ROUNDS = [
  // ───────────────────────── Israel ─────────────────────────
  {
    permit: "149/2569",
    slug: "149-2569",
    country: "IL",
    channel: "private",
    industry: "ก่อสร้าง",
    employer: "Mashbir Yaakov Ltd.",
    employerPlace: "Be'er Sheva, Israel",
    agency: {
      name: "อี.พี.เอ. อินเตอร์เนชั่นแนล",
      license: "ต.1222/2562",
      search: "อี.พี.เอ",
      phones: ["098-829-9796", "080-078-5288", "098-289-5518"],
    },
    positions: [
      { title: "ช่างฉาบปูน", count: 36 },
      { title: "ช่างปูกระเบื้อง", count: 40 },
      { title: "ช่างเหล็ก", count: 31 },
      { title: "ช่างไม้", count: 36 },
      { title: "ช่างเชื่อม", count: 40 },
      { title: "โฟร์แมน", count: 40 },
    ],
    total: 223,
    sex: "male",
    sexQuote: "คนไทย (เพศชาย) อายุไม่ต่ำกว่า 25 ปี",
    ageMin: 25,
    ageMax: null,
    pay: [
      {
        label: "ทุกตำแหน่ง",
        main: "พื้นฐาน ไม่น้อยกว่า 6,443.85 เชเกล/เดือน",
        baht: "ประมาณ 72,412 บาท/เดือน",
        note: "ไม่รวมค่าล่วงเวลา · ใบนี้ใช้อัตรา 1 เชเกล = 11.23 บาท",
      },
    ],
    costs: [
      { item: "ที่พัก", who: "deduct", quote: "นายจ้างจัดหาที่พักให้โดยหักค่าใช้จ่ายตามที่กฎหมายกำหนด", ref: "ข้อ 5" },
      { item: "อาหาร", who: "worker", quote: "ค่าอาหารลูกจ้างเป็นผู้รับผิดชอบ", ref: "ข้อ 6" },
      { item: "ตั๋วเครื่องบินไป-กลับ", who: "worker", quote: "ค่าบัตรโดยสารเครื่องบินไป-กลับประเทศอิสราเอลลูกจ้างเป็นผู้รับผิดชอบ", ref: "ข้อ 7" },
    ],
    terms: [
      "ระยะเวลาการจ้างงาน 1 ปี (ต่ออายุได้สูงสุดถึง 5 ปี)",
      "ทำงานวันละ 8 ชั่วโมง สัปดาห์ละ 6 วัน",
      "ระยะเวลาทดลองงาน 3 เดือน",
    ],
    windowStart: "2026-10-09",
    windowEnd: "2026-12-07",
    issued: "2026-10-09",
    feeBan: FEE_BAN,
    source: { url: doe(150897), page: 1 },
    verified: "อ่านโดย thmw-content และ thmw-qa 24 ต.ค. 2569; ตรวจซ้ำโดย thmw-pm 27 ต.ค. 2569",
  },

  // ───────────────────────── Romania ─────────────────────────
  {
    permit: "148/2569",
    slug: "148-2569",
    country: "RO",
    channel: "private",
    industry: null,
    employer: "AYCW S.R.L.",
    employerPlace: "Bihor, Romania",
    agency: {
      name: "เอสพี ลีดเดอร์ อินเตอร์เนชั่นแนล กรุ๊ป",
      license: "ต.974/2543",
      search: "เอสพี ลีดเดอร์",
      phones: ["02-930-7214"],
    },
    positions: [{ title: "พนักงานทั่วไป", count: 400 }],
    total: 400,
    sex: null,
    ageMin: null,
    ageMax: null,
    pay: [{ label: "พนักงานทั่วไป", main: "4,050 เลอู/เดือน", baht: "ประมาณ 29,226.48 บาท/เดือน (ตามที่ใบนี้แปลงไว้)" }],
    costs: [
      { item: "อาหาร", who: "partial", quote: "นายจ้างจัดหาอาหารให้วันละ 1 มื้อ ในกรณีที่สามารถจัดหาได้ เช่น อาหารกลางวัน", ref: "ข้อ 4" },
      { item: "ที่พัก", who: "employer", quote: "นายจ้างจัดหาที่พักให้ลูกจ้างโดยไม่คิดมูลค่า", ref: "ข้อ 5" },
      { item: "ตั๋วเครื่องบินไป-กลับ", who: "employer", quote: "นายจ้างจัดหาบัตรโดยสารเครื่องบินไป-กลับให้ลูกจ้างโดยไม่คิดมูลค่า", ref: "ข้อ 6" },
    ],
    terms: ["สัญญาจ้าง 12 เดือน ต่ออายุได้สูงสุด 60 เดือน"],
    windowStart: "2026-10-09",
    windowEnd: "2026-12-07",
    issued: "2026-10-09",
    feeBan: FEE_BAN,
    source: { url: doe(150896), page: 1 },
    verified: "อ่านโดย thmw-qa และ thmw-content 22–23 ต.ค. 2569",
  },
  {
    permit: "150/2569",
    slug: "150-2569",
    country: "RO",
    channel: "private",
    industry: null,
    employer: "AYCW S.R.L.",
    employerPlace: "Bihor, Romania",
    agency: {
      name: "วินซ์ เพลสเมนท์",
      license: "ต.887/2539",
      search: "วินซ์ เพลสเมนท์",
      phones: ["081-931-5686"],
    },
    positions: [{ title: "คนงานทั่วไป", count: 400 }],
    total: 400,
    sex: null,
    ageMin: null,
    ageMax: null,
    pay: [{ label: "คนงานทั่วไป", main: "4,050 เลอู/เดือน", baht: "ประมาณ 29,686.50 บาท/เดือน (ตามที่ใบนี้แปลงไว้)" }],
    costs: [
      { item: "อาหาร", who: "partial", quote: "นายจ้างจัดอาหารให้วันละ 1 มื้อ ในกรณีที่สามารถจัดหาได้ เช่น อาหารกลางวัน", ref: "ข้อ 4" },
      { item: "ที่พัก", who: "employer", quote: "นายจ้างจัดที่พักให้โดยไม่คิดมูลค่า", ref: "ข้อ 5" },
      { item: "ตั๋วเครื่องบินไป-กลับ", who: "employer", quote: "นายจ้างจัดค่าบัตรโดยสารเครื่องบินไป-กลับให้โดยไม่คิดมูลค่า", ref: "ข้อ 6" },
    ],
    terms: ["สัญญาจ้าง 12 เดือน ต่ออายุได้สูงสุด 60 เดือน"],
    windowStart: "2026-10-09",
    windowEnd: "2026-12-07",
    issued: "2026-10-09",
    feeBan: FEE_BAN,
    source: { url: doe(150898), page: 1 },
    verified: "อ่านโดย thmw-qa และ thmw-content 22–23 ต.ค. 2569",
  },
  {
    permit: "151/2569",
    slug: "151-2569",
    country: "RO",
    channel: "private",
    industry: null,
    employer: "AYCW S.R.L.",
    employerPlace: "Bihor, Romania",
    agency: {
      name: "วี ดรากอน",
      license: "ต.980/2543",
      search: "วี ดรากอน",
      phones: ["02-530-9050"],
    },
    positions: [{ title: "พนักงานทั่วไป", count: 500 }],
    total: 500,
    sex: null,
    ageMin: null,
    ageMax: null,
    pay: [{ label: "พนักงานทั่วไป", main: "4,050 เลอู/เดือน", baht: "ประมาณ 29,403 บาท/เดือน (ใบนี้ใช้อัตรา 1 เลอู = 7.26 บาท)" }],
    costs: [
      { item: "อาหาร", who: "partial", quote: "ค่าอาหารนายจ้างจัดให้ 1 มื้อ (ในกรณีที่ทำได้ เช่น มื้อกลางวัน)", ref: "ข้อ 5" },
      { item: "ที่พัก", who: "employer", quote: "นายจ้างจัดหาที่พักให้โดยไม่คิดมูลค่า", ref: "ข้อ 4" },
      { item: "ตั๋วเครื่องบินไป-กลับ", who: "employer", quote: "ค่าบัตรโดยสารเครื่องบินไป-กลับ นายจ้างเป็นผู้รับผิดชอบ", ref: "ข้อ 6" },
    ],
    terms: ["สัญญาจ้าง 12 เดือน ต่ออายุได้สูงสุด 60 เดือน"],
    windowStart: "2026-10-09",
    windowEnd: "2026-12-07",
    issued: "2026-10-09",
    feeBan: FEE_BAN,
    source: { url: doe(150899), page: 1 },
    verified: "อ่านโดย thmw-qa และ thmw-content 22–23 ต.ค. 2569",
  },
  {
    permit: "152/2569",
    slug: "152-2569",
    country: "RO",
    channel: "private",
    industry: null,
    employer: "AYCW S.R.L.",
    employerPlace: "Bihor, Romania",
    agency: {
      name: "อุดรเวิลด์บริดจ์ อินเตอร์เนชั่นแนล",
      license: "ต.1215/2561",
      search: "อุดรเวิลด์",
      phones: ["042-115-586", "063-315-5695"],
    },
    positions: [{ title: "คนงานทั่วไป", count: 600 }],
    total: 600,
    sex: null,
    ageMin: null,
    ageMax: null,
    pay: [{ label: "คนงานทั่วไป", main: "4,050 เลอู/เดือน", baht: "ประมาณ 28,663.09 บาท/เดือน (ตามที่ใบนี้แปลงไว้)" }],
    costs: [
      { item: "อาหาร", who: "partial", quote: "นายจ้างจัดหาอาหารวันละ 1 มื้อ โดยไม่คิดค่าใช้จ่าย (สำหรับวันที่ทำงาน)", ref: "ข้อ 3" },
      { item: "ที่พัก", who: "employer", quote: "นายจ้างจัดหาที่พักให้โดยไม่คิดมูลค่า", ref: "ข้อ 4" },
      { item: "ตั๋วเครื่องบินไป-กลับ", who: "employer", quote: "นายจ้างจ่ายค่าบัตรโดยสารเครื่องบินเที่ยวไปและกลับ", ref: "ข้อ 5" },
    ],
    terms: ["สัญญาจ้าง 12 เดือน ต่ออายุได้สูงสุด 60 เดือน"],
    windowStart: "2026-10-09",
    windowEnd: "2026-12-07",
    issued: "2026-10-09",
    feeBan: FEE_BAN,
    source: { url: doe(150900), page: 1 },
    verified: "อ่านโดย thmw-qa และ thmw-content 22–23 ต.ค. 2569",
  },

  // ───────────────────────── Lithuania ─────────────────────────
  ...[
    {
      permit: "145/2569",
      id: 150893,
      employer: "UAB RNDV Group",
      industry: "ก่อสร้าง",
      positions: [{ title: "ช่างไฟฟ้า", count: 40 }],
      total: 40,
      pay: [{ label: "ช่างไฟฟ้า", main: "สุทธิ (หลังหักภาษี) 1,300 ยูโร/เดือน", baht: "ประมาณ 49,816 บาท/เดือน", note: "รวมก่อนหักภาษี 1,914.08 ยูโร (ประมาณ 73,347.55 บาท)" }],
    },
    {
      permit: "146/2569",
      id: 150894,
      employer: "UAB RNDV Ferrum",
      industry: "ต่อเรือ",
      positions: [
        { title: "ช่างประกอบโครงเรือ", count: 40 },
        { title: "ช่างเชื่อมโครงเรือ", count: 40 },
      ],
      total: 80,
      pay: [{ label: "ทั้ง 2 ตำแหน่ง", main: "หลังหักภาษี 1,500 ยูโร/เดือน", baht: "ประมาณ 57,480 บาท/เดือน", note: "ก่อนหักภาษี 2,256.06 ยูโร (ประมาณ 86,452 บาท)" }],
    },
    {
      permit: "147/2569",
      id: 150895,
      employer: "UAB RNDV Industries",
      industry: "ก่อสร้าง",
      positions: [
        { title: "ช่างตั้งนั่งร้าน", count: 30 },
        { title: "ช่างหุ้มฉนวน", count: 30 },
      ],
      total: 60,
      pay: [{ label: "ทั้ง 2 ตำแหน่ง", main: "หลังหักภาษี 1,300 ยูโร/เดือน", baht: "ประมาณ 49,816 บาท/เดือน", note: "รวมก่อนหักภาษี 1,914.08 ยูโร (ประมาณ 73,347.55 บาท)" }],
    },
  ].map((lt) => ({
    permit: lt.permit,
    slug: lt.permit.replace("/", "-"),
    country: "LT",
    channel: "private",
    industry: lt.industry,
    employer: lt.employer,
    employerPlace: "Klaipeda, Lithuania",
    agency: { name: "มาลินโด", license: "ต.8/2527", search: "มาลินโด", phones: ["02-676-9216", "085-531-6142", "091-036-2614", "081-234-3484"] },
    positions: lt.positions,
    total: lt.total,
    sex: "male",
    sexQuote: "(เพศชาย) ใต้ชื่อตำแหน่ง",
    ageMin: null,
    ageMax: null,
    pay: lt.pay,
    payNote: "ส่วนต่างระหว่างเงินเดือนรวมกับสุทธิ ใบเรียกว่าภาษี ควรถามบริษัทว่าหักอะไรบ้าง",
    costs: [
      { item: "ที่พัก", who: "employer-unclear", quote: "นายจ้างเป็นผู้จัดหาให้", ref: "สาระสำคัญของสัญญาจ้าง" },
      { item: "อาหาร", who: "in-pay", quote: "นายจ้างเป็นผู้จัดหาให้ (รวมอยู่ในเงินเดือนรวมแล้ว)", ref: "สาระสำคัญของสัญญาจ้าง" },
      { item: "ตั๋วเครื่องบินไป-กลับ", who: "unclear", quote: "นายจ้างให้ความช่วยเหลือในการจัดการตั๋วโดยสารเครื่องบินทั้งขาไปและขากลับเมื่อสิ้นสุดสัญญา", ref: "สาระสำคัญของสัญญาจ้าง" },
    ],
    terms: ["สัญญาจ้าง 2 ปี และสามารถต่อสัญญาได้", "ทำงานวันละ 8 ชั่วโมง สัปดาห์ละ 5 วัน", "ทดลองงาน 3 เดือน"],
    windowStart: "2026-10-09",
    windowEnd: "2026-12-07",
    issued: "2026-10-09",
    feeBan: FEE_BAN,
    source: { url: doe(lt.id), page: 1 },
    verified: "อ่านโดย thmw-qa และ thmw-content 22–23 ต.ค. 2569; ค่าจ้างใบ 147 ตรวจซ้ำโดย thmw-pm 27 ต.ค. 2569",
  })),
  // ───────────────────────── AUTO (permit-publish.py: primary read + GPU Thai-OCR check) ─────────────────────────
  {
    permit: "154/2569",
    slug: "154-2569",
    country: "IL",
    channel: "private",
    industry: "ก่อสร้าง",
    employer: "WORK CONNEXT LTD.",
    employerPlace: "35 HA'MASGER STREET, TEL AVIV",
    agency: {
      name: "บีเจซี เวิร์ค คอนเน็กซ์",
      license: "ต.1302/2568",
      search: "บีเจซี",
      phones: ["063-271-9818"],
    },
    positions: [
      {
        title: "ช่างเหล็ก",
        count: 454,
      },
    ],
    total: 454,
    sex: null,
    sexQuote: null,
    ageMin: null,
    ageMax: null,
    pay: [
      {
        label: "ช่างเหล็ก",
        main: "6,443.85 เชเกล/เดือน",
        baht: "ประมาณ 70,882.35 บาท/เดือน",
        note: "ตัวเลขเงินบาทตามที่ใบนี้แปลงไว้",
      },
    ],
    costs: [
      {
        item: "ที่พัก",
        who: "deduct",
        quote: "นายจ้างจัดหาที่พักให้โดยหักจากค่าจ้าง ตามที่กฎหมายแรงงานอิสราเอลกำหนด",
        ref: "เงื่อนไขข้อ 3",
      },
      {
        item: "อาหาร",
        who: "unclear",
        quote: "นายจ้างจัดหาห้องครัวและอุปกรณ์ประกอบอาหารให้ลูกจ้างโดยไม่คิดมูลค่า",
        ref: "เงื่อนไขข้อ 4",
      },
      {
        item: "ตั๋วเครื่องบินไป-กลับ",
        who: "unclear",
        quote: null,
        ref: null,
      },
    ],
    terms: [
      "ระยะเวลาการจ้างงาน 1 ปี ต่อสัญญาได้ 5 ปี",
      "ชั่วโมงการทำงาน 8 ชั่วโมงต่อวัน 6 วันต่อสัปดาห์ หรือทำงาน 9 ชั่วโมงต่อวัน 5 วันต่อสัปดาห์ (ไม่เกิน 58 ชั่วโมงต่อสัปดาห์)",
      "เงื่อนไขอื่นๆ เป็นไปตามกฎหมายแรงงานของรัฐอิสราเอล",
    ],
    windowStart: "2026-10-15",
    windowEnd: "2026-12-13",
    issued: "2026-10-15",
    verified: "อ่านจากใบอนุญาตโดย thmw-pm และตรวจซ้ำด้วย Thai OCR (typhoon-ocr บน gpu01) 27 ต.ค. 2569; ผ่าน 26 จุดตรวจ",
    feeBan: FEE_BAN,
    source: { url: doe(151208), page: 1 },
  },
];

// What each `who` value means, worded for workers. Never say "ฟรี".
export const COST_LABEL = {
  employer: { text: "นายจ้างจัดให้ตามใบอนุญาต", tone: "safe" },
  partial: { text: "นายจ้างจัดให้บางส่วน", tone: "caution" },
  deduct: { text: "นายจ้างจัดให้ แต่หักค่าใช้จ่าย", tone: "caution" },
  "in-pay": { text: "รวมอยู่ในเงินเดือนรวม", tone: "caution" },
  "employer-unclear": { text: "นายจ้างจัดหาให้ ใบไม่ได้บอกว่าใครจ่าย", tone: "caution" },
  unclear: { text: "ใบไม่ได้บอกว่าใครจ่าย", tone: "caution" },
  worker: { text: "คนงานจ่ายเอง", tone: "danger" },
};

const TH_MONTHS = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];

/** "2026-12-07" -> "7 ธ.ค. 2569" */
export function thaiDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${TH_MONTHS[m - 1]} ${y + 543}`;
}

/** Today's date in Thailand as YYYY-MM-DD. */
export function todayBangkok(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Bangkok" }).format(now);
}

/** Rounds whose permit window has not ended yet. */
export function activeRounds(today = todayBangkok()) {
  return ROUNDS.filter((r) => r.windowEnd >= today);
}

export function getRound(slug) {
  return ROUNDS.find((r) => r.slug === slug) || null;
}

export function positionsLabel(r) {
  return r.positions.map((p) => p.title).join(" · ");
}

/** Short headline: job titles, or "งานก่อสร้าง 6 ตำแหน่ง" when there are more than 2. */
export function headline(r) {
  if (r.positions.length > 2 && r.industry) return `งาน${r.industry} ${r.positions.length} ตำแหน่ง`;
  return positionsLabel(r);
}

/**
 * Check one person against one permit.
 * Returns { status: "fit" | "ask" | "no", reasons: string[] }.
 * "no"  = the permit's own wording rules this person out.
 * "ask" = the permit doesn't say, so ask the agency before applying.
 * Never turns a missing value into a yes or a no.
 */
export function checkEligibility(r, { sex, age }) {
  const no = [];
  const ask = [];

  if (sex) {
    if (r.sex === "male" && sex === "female") no.push("ใบอนุญาตรับเฉพาะผู้ชาย");
    else if (r.sex == null) ask.push("ใบอนุญาตไม่ได้ระบุเพศ");
  }

  const a = Number(age);
  if (age !== "" && age != null && Number.isFinite(a)) {
    if (r.ageMin != null && a < r.ageMin) no.push(`ใบอนุญาตกำหนดอายุไม่ต่ำกว่า ${r.ageMin} ปี`);
    else if (r.ageMax != null && a > r.ageMax) no.push(`ใบอนุญาตกำหนดอายุไม่เกิน ${r.ageMax} ปี`);
    else if (r.ageMin == null && r.ageMax == null) ask.push("ใบอนุญาตไม่ได้ระบุเกณฑ์อายุ");
    else if (r.ageMax == null) ask.push("ใบอนุญาตไม่ได้ระบุอายุสูงสุด");
  }

  if (no.length) return { status: "no", reasons: no };
  if (ask.length) return { status: "ask", reasons: ask };
  return { status: "fit", reasons: [] };
}
