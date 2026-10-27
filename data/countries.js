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
    abroad: [
      { label: "สายด่วนแรงงานต่างชาติ กระทรวงแรงงานไต้หวัน 24 ชม. (มีภาษาไทย)", number: "1955", tel: "1955", source: "https://tteo.thaiembassy.org/th/page/55680-emergency-tel?menu=5d7dc71915e39c072c004ece" },
      { label: "ฝ่ายคุ้มครองและดูแลคนไทย สำนักงานการค้าฯ ไทเป", number: "(886-2) 2775-2211", suffix: "ต่อ 110–119", tel: "+886227752211", source: "https://tteo.thaiembassy.org/th/page/55680-emergency-tel?menu=5d7dc71915e39c072c004ece" },
      { label: "Hot Line คุ้มครองคนไทย นอกเวลาราชการ เฉพาะเหตุด่วน", number: "(886) 952-238-931", tel: "+886952238931", source: "https://tteo.thaiembassy.org/th/page/55680-emergency-tel?menu=5d7dc71915e39c072c004ece" },
      { label: "สำนักงานแรงงานไทย ไทเป", number: "(886-2) 2701-1413", suffix: "ต่อ 200, 202", tel: "+886227011413", source: "https://www.mol.go.th/ต่างประเทศ" },
      { label: "สำนักงานแรงงานไทย เกาสง (ไต้หวันใต้)", number: "(886-7) 338-0052", tel: "+88673380052", source: "https://www.mol.go.th/ต่างประเทศ" },
    ],
    emergencyLocal: "ตำรวจ 110 · รถพยาบาล/ดับเพลิง 119",
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
    abroad: [
      { label: "ฮอตไลน์ สถานเอกอัครราชทูต ณ กรุงโซล (LINE ID: rtethai)", number: "010-6747-0095", suffix: "จากไทย +82 10 6747 0095", tel: "+821067470095", source: "https://seoul.thaiembassy.org/" },
      { label: "ฮอตไลน์ สถานเอกอัครราชทูต ณ กรุงโซล เบอร์ที่ 2", number: "010-3099-2955", tel: "+821030992955", source: "https://seoul.thaiembassy.org/" },
      { label: "ศูนย์ปรึกษาแรงงานต่างชาติ (มีภาษาไทย) ทุกวัน 09:00–18:00", number: "1577-0071", tel: "15770071", source: "https://www.gov.kr/portal/foreigner/ko/m020401" },
      { label: "สำนักงานแรงงานไทย ณ กรุงโซล", number: "(02) 794-5222", tel: "+8227945222", source: "https://www.mol.go.th/ต่างประเทศ" },
    ],
    routes: ["รัฐจัดส่ง (EPS)", "เกษตรตามฤดูกาล E-8 ผ่าน อปท.", "Re-entry"],
  },
  {
    slug: "japan",
    code: "JP",
    name: "ญี่ปุ่น",
    flag: "🇯🇵",
    jobs: "ฝึกงานเทคนิค · แรงงานทักษะเฉพาะ (SSW)",
    stat: { value: "5,116", label: "คนสมัครกองทุนฯ ไปญี่ปุ่น ปีงบ 2567", source: "https://www.doe.go.th/prd/assets/upload/files/overseas_th/f0ef9841d0f2768318900ab80ebdeb37.pdf" },
    abroad: [
      { label: "สำนักงานแรงงานไทย ณ กรุงโตเกียว", number: "03-5422-7014", suffix: "/ 7015", tel: "+81354227014", source: "https://www.mol.go.th/ต่างประเทศ" },
    ],
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
    abroad: [
      { label: "ฉุกเฉินนอกเวลาราชการ สถานเอกอัครราชทูต ณ กรุงเทลอาวีฟ (คนไทยเท่านั้น)", number: "054-636-8150", suffix: "จากไทย +972 54 636 8150", tel: "+972546368150", source: "https://telaviv.thaiembassy.org/th/index" },
      { label: "สถานเอกอัครราชทูต ณ กรุงเทลอาวีฟ ในเวลาราชการ", number: "(09) 954-8412", tel: "+97299548412", source: "https://telaviv.thaiembassy.org/th/index" },
      { label: "สำนักงานแรงงานไทย อิสราเอล (Herzliya)", number: "(09) 954-8431", suffix: "ถึง 8433", tel: "+97299548431", source: "https://www.mol.go.th/ต่างประเทศ" },
    ],
    routes: ["รัฐจัดส่ง (TIC เกษตร)", "บริษัทจัดหางาน (ก่อสร้าง)"],
  },
  {
    slug: "romania",
    code: "RO",
    name: "โรมาเนีย",
    flag: "🇷🇴",
    jobs: "โรงงาน · ก่อสร้าง",
    abroad: [
      { label: "ฉุกเฉินสำหรับคนไทย สถานเอกอัครราชทูต ณ กรุงบูคาเรสต์", number: "072-519-7860", suffix: "จากไทย +40 72 519 7860", tel: "+40725197860", source: "https://bucharest.thaiembassy.org/" },
      { label: "สถานเอกอัครราชทูต ณ กรุงบูคาเรสต์ ในเวลาราชการ", number: "(021) 311-0078", tel: "+40213110078", source: "https://bucharest.thaiembassy.org/" },
    ],
    abroadNote: "โรมาเนียไม่มีสำนักงานแรงงานไทย — ให้โทรสถานทูต หรือ 1506 กด 2 ที่ไทย",
    routes: ["บริษัทจัดหางาน"],
  },
  {
    slug: "lithuania",
    code: "LT",
    name: "ลิทัวเนีย",
    flag: "🇱🇹",
    jobs: "โรงงาน · ขนส่ง",
    abroad: [
      { label: "สถานเอกอัครราชทูต ณ กรุงโคเปนเฮเกน (ดูแลลิทัวเนีย) กด 1 ฝ่ายกงสุล", number: "+45 39 62 50 10", tel: "+4539625010", source: "https://copenhagen.thaiembassy.org/th/index" },
    ],
    abroadNote: "ลิทัวเนียไม่มีสถานทูตไทย — สถานทูตที่โคเปนเฮเกน (เดนมาร์ก) ดูแล และมีกงสุลกิตติมศักดิ์ที่วิลนีอุส (ที่มา: copenhagen.thaiembassy.org)",
    routes: ["บริษัทจัดหางาน"],
  },
  {
    slug: "uae",
    code: "AE",
    name: "สหรัฐอาหรับเอมิเรตส์",
    short: "UAE",
    flag: "🇦🇪",
    jobs: "นวด · สปา · บริการ",
    risk: { text: "คนไทยในดูไบกว่า 12,000 คน ทำงานถูกกฎหมายเพียง 4,500 คน (กงสุลใหญ่ให้สัมภาษณ์ Thai PBS 2567)", source: "https://www.thaipbs.or.th/news/content/337865" },
    abroad: [
      { label: "ฮอตไลน์นอกเวลาราชการ สถานกงสุลใหญ่ ณ เมืองดูไบ", number: "050-652-5945", suffix: "จากไทย +971 50 652 5945", tel: "+971506525945", source: "https://dubai.thaiembassy.org/th/index" },
      { label: "สถานกงสุลใหญ่ ณ เมืองดูไบ ในเวลาราชการ", number: "(04) 348-9550", suffix: "ต่อ 18", tel: "+97143489550", source: "https://dubai.thaiembassy.org/th/index" },
      { label: "สำนักงานแรงงานไทย อาบูดาบี", number: "(02) 557-6833", tel: "+97125576833", source: "https://www.mol.go.th/ต่างประเทศ" },
    ],
    routes: ["บริษัทจัดหางาน", "นายจ้างพาไป"],
  },
];

// Women's path — the group the data says is most at risk: 20 % of departures but 49 % of
// complainants (the101.world on DOE FY2568 data); UAE help-seekers 94 % women (Thai PBS).
export const WOMEN = {
  headline: "ผู้หญิงไปทำงานต่างประเทศ: 1 ใน 5 ของคนที่ไป แต่เกือบครึ่งของคนที่ถูกหลอก",
  stats: [
    { value: "20%", label: "ของคนที่ไปทำงานต่างประเทศปี 2568 เป็นผู้หญิง (13,705 จาก 69,646 คน)", source: "https://www.the101.world/labor-protection-reena/" },
    { value: "49%", label: "ของผู้ร้องเรียนว่าถูกหลอก เป็นผู้หญิง (419 จาก 849 คน ปีงบ 2568)", source: "https://www.doe.go.th/prd/assets/upload/files/strategy_th/d27891049905f0231a91a7c4e90f9a04.pdf" },
    { value: "94%", label: "ของคนไทยที่ขอความช่วยเหลือที่กงสุลดูไบ เป็นผู้หญิงที่ถูก “แม่แท็ก” ชวนไปทำงานนวดผ่าน LINE/Facebook/TikTok", source: "https://image.mfa.go.th/mfa/0/yZ0EO327fd/%E0%B9%80%E0%B8%AD%E0%B8%81%E0%B8%AA%E0%B8%B2%E0%B8%A3/nbt/nbt16/IS/16019.pdf" },
  ],
  signals: [
    "ชวนไป “นวด/สปา/ร้านอาหาร” ผ่าน LINE หรือ Facebook โดยไม่มีชื่อบริษัทจัดหางานและเลขใบอนุญาต ต.",
    "บอกว่าไปวีซ่าท่องเที่ยวก่อน แล้วค่อยเปลี่ยนเป็นวีซ่าทำงานที่นั่น",
    "ให้จ่ายค่าตั๋ว ค่าวีซ่า หรือ “ค่าประกัน” ก่อน แล้วไปหักจากค่าจ้าง",
    "ยึดพาสปอร์ตเมื่อถึงที่หมาย",
  ],
  note: "ถ้าตรงข้อใดข้อหนึ่ง: ยังไม่ต้องโอน โทร 1506 กด 2 หรือ 0 2248 4792 ก่อน",
};

// What it really costs — numbers that already exist in public reports. Per-route costs for
// Romania/Lithuania/Israel are read from the permit PDFs on /rounds, not here.
export const COSTS = [
  { route: "ญี่ปุ่น ค่านายหน้าฝั่งไทย (ค่าเฉลี่ย สำรวจปี 2561)", amount: "213,800 บาท", source: "http://ethesisarchive.library.tu.ac.th/thesis/2018/TU_2018_6004010580_9961_10343.pdf" },
  { route: "ไต้หวัน ค่าใช้จ่ายทั้งหมดต่อคนต่อการไป 1 ครั้ง (ค่าเฉลี่ย สำรวจปี 2561)", amount: "529,200 บาท", source: "http://ethesisarchive.library.tu.ac.th/thesis/2018/TU_2018_6004010580_9961_10343.pdf" },
  { route: "เงินที่ผู้ร้องเรียน 849 คนเสียไปรวมกัน ปีงบ 2568", amount: "86,294,298 บาท", note: "ได้คืน 438,000 บาท (0.5%)", source: "https://www.doe.go.th/prd/assets/upload/files/strategy_th/d27891049905f0231a91a7c4e90f9a04.pdf" },
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
