import AboutClient from "./AboutClient";

export const metadata = {
  title: "เกี่ยวกับเช็คก่อนบิน | โครงการป้องกันแรงงานไทยถูกหลอก",
  description:
    "เรียนรู้เกี่ยวกับโครงการเช็คก่อนบิน เครื่องมือตรวจสอบความเสี่ยงสำหรับแรงงานไทยก่อนไปทำงานต่างประเทศ พร้อมนโยบาย PDPA",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "เกี่ยวกับเช็คก่อนบิน",
    description:
      "โครงการเพื่อสังคมที่มุ่งปกป้องแรงงานไทยจากการหลอกลวงไปทำงานต่างประเทศ",
    url: "https://checkgonbin.in.th/about",
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
