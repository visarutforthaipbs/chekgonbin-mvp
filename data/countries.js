// Country journey pages — reviewed data, git history is the audit trail (same rule as rounds.js).
// Every number here must cite a source in `source`. Empty tabs render "ยังไม่มีข้อมูล" — never invent.
// Order = departures 2567 (DOE lmia report: Taiwan 35.86 % first).

export const COUNTRIES_UPDATED = "2026-10-27";

// Hotlines in Thailand — the same on every country page.
export const THAI_HOTLINES = [
  { label: "สายด่วนกระทรวงแรงงาน", number: "1506", suffix: "กด 2", tel: "1506", note: "กรมการจัดหางาน" },
  { label: "สายด่วนกรมการจัดหางาน", number: "1694", tel: "1694" },
  {
    label: "ตรวจสอบใบอนุญาตบริษัทจัดหางาน",
    number: "0 2248 4792",
    tel: "+6622484792",
    note: "กองทะเบียนจัดหางานกลางฯ · อีกเบอร์ 0 2245 6763",
  },
];

// Fund benefits — กองทุนเพื่อช่วยเหลือคนหางานไปทำงานในต่างประเทศ, annual report FY2567
// https://www.doe.go.th/prd/assets/upload/files/overseas_th/f0ef9841d0f2768318900ab80ebdeb37.pdf
export const FUND = {
  fee: "สมัครครั้งเดียว 300–500 บาท ตามประเทศ",
  benefits: [
    { what: "ตกค้างในต่างประเทศ ส่งกลับบ้าน", amount: "ไม่เกิน 30,000 บาท" },
    { what: "ค่าทนาย / คดีในต่างประเทศ", amount: "ไม่เกิน 100,000 บาท" },
    { what: "เจ็บป่วย / พิการ", amount: "ไม่เกิน 30,000 บาท" },
    { what: "เสียชีวิต (ครอบครัวได้รับ)", amount: "40,000 บาท + ค่าส่งศพ" },
  ],
  source: "https://www.doe.go.th/prd/assets/upload/files/overseas_th/f0ef9841d0f2768318900ab80ebdeb37.pdf",
};

export const COUNTRIES = [
  {
    slug: "taiwan",
    code: "TW",
    name: "ไต้หวัน",
    flag: "🇹🇼",
    jobs: "โรงงาน · ก่อสร้าง · ประมง · ดูแลผู้สูงอายุ",
    stat: { value: "35.86%", label: "ของคนไทยที่ไปทำงานต่างประเทศปี 2567 ไปไต้หวัน", source: "https://www.doe.go.th/prd/assets/upload/files/lmia_th/39ae438f35456fa765a1064ff77f83dc.pdf" },
    risk: { text: "ปี 2567 กองทุนฯ จ่ายกรณีเสียชีวิตในไต้หวัน 51 ราย", source: "https://www.doe.go.th/prd/assets/upload/files/overseas_th/f0ef9841d0f2768318900ab80ebdeb37.pdf" },
    routes: ["บริษัทจัดหางาน", "นายจ้างพาไป", "Re-entry (กลับไปนายจ้างเดิม)"],
  },
  {
    slug: "korea",
    code: "KR",
    name: "เกาหลีใต้",
    flag: "🇰🇷",
    jobs: "โรงงาน (EPS) · เกษตรตามฤดูกาล (E-8)",
    stat: { value: "7,919", label: "คนสมัครกองทุนฯ ไปเกาหลี ปีงบ 2567", source: "https://www.doe.go.th/prd/assets/upload/files/overseas_th/f0ef9841d0f2768318900ab80ebdeb37.pdf" },
    risk: { text: "ไปแบบไม่มีวีซ่าทำงาน (ผีน้อย) มีประมาณ 140,000 คน มากกว่าคนที่ไปถูกกฎหมายผ่าน EPS หลายเท่า", source: "https://epress.lib.uts.edu.au/journals/index.php/portal/article/download/7680/8201/39961" },
    routes: ["รัฐจัดส่ง (EPS)", "เกษตรตามฤดูกาล E-8 ผ่าน อปท.", "Re-entry"],
  },
  {
    slug: "japan",
    code: "JP",
    name: "ญี่ปุ่น",
    flag: "🇯🇵",
    jobs: "ฝึกงานเทคนิค · แรงงานทักษะเฉพาะ (SSW)",
    stat: { value: "5,116", label: "คนสมัครกองทุนฯ ไปญี่ปุ่น ปีงบ 2567", source: "https://www.doe.go.th/prd/assets/upload/files/overseas_th/f0ef9841d0f2768318900ab80ebdeb37.pdf" },
    routes: ["รัฐจัดส่ง (IM Japan)", "บริษัทจัดหางาน", "นายจ้างส่งไปฝึกงาน"],
  },
  {
    slug: "israel",
    code: "IL",
    name: "อิสราเอล",
    flag: "🇮🇱",
    jobs: "เกษตร (TIC) · ก่อสร้าง",
    stat: { value: "1,067", label: "คนสมัครกองทุนฯ ไปอิสราเอล ปีงบ 2567", source: "https://www.doe.go.th/prd/assets/upload/files/overseas_th/f0ef9841d0f2768318900ab80ebdeb37.pdf" },
    risk: { text: "ปี 2567 กองทุนฯ จ่ายกรณีเสียชีวิตในอิสราเอล 60 ราย มากที่สุดในทุกประเทศ", source: "https://www.doe.go.th/prd/assets/upload/files/overseas_th/f0ef9841d0f2768318900ab80ebdeb37.pdf" },
    routes: ["รัฐจัดส่ง (TIC เกษตร)", "บริษัทจัดหางาน (ก่อสร้าง)"],
  },
  {
    slug: "romania",
    code: "RO",
    name: "โรมาเนีย",
    flag: "🇷🇴",
    jobs: "โรงงาน · ก่อสร้าง",
    routes: ["บริษัทจัดหางาน"],
  },
  {
    slug: "lithuania",
    code: "LT",
    name: "ลิทัวเนีย",
    flag: "🇱🇹",
    jobs: "โรงงาน · ขนส่ง",
    routes: ["บริษัทจัดหางาน"],
  },
  {
    slug: "uae",
    code: "AE",
    name: "สหรัฐอาหรับเอมิเรตส์",
    short: "UAE",
    flag: "🇦🇪",
    jobs: "นวด · สปา · บริการ",
    risk: { text: "คนไทยในดูไบราว 12,000 คน ทำงานถูกกฎหมายเพียง 4,500 คน และ 94% ของผู้ขอความช่วยเหลือเป็นผู้หญิงที่ถูกชวนไปทำงานนวดผ่าน LINE/Facebook", source: "https://www.thaipbs.or.th/news/content/337865" },
    routes: ["บริษัทจัดหางาน", "นายจ้างพาไป"],
  },
];

export function getCountry(slug) {
  return COUNTRIES.find((c) => c.slug === slug) || null;
}

// The 7 stages of the journey — one tab each, same order on every country page.
export const STAGES = [
  { id: "worth", label: "ไปแล้วได้อะไร", phase: "ก่อนไป" },
  { id: "routes", label: "ไปทางไหนได้บ้าง", phase: "ก่อนไป" },
  { id: "pay", label: "เช็กก่อนจ่าย", phase: "ก่อนไป" },
  { id: "prepare", label: "เตรียมตัว", phase: "ก่อนไป" },
  { id: "arrived", label: "ถึงแล้วต้องรู้", phase: "อยู่ที่นั่น" },
  { id: "help", label: "มีปัญหาโทรใคร", phase: "อยู่ที่นั่น" },
  { id: "return", label: "กลับบ้าน", phase: "กลับบ้าน" },
];
