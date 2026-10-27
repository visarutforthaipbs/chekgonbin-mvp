import AboutClient from "./AboutClient";

export const metadata = {
  title: "เกี่ยวกับ Thai Migrant Watch | โครงการป้องกันแรงงานไทยถูกหลอก",
  description:
    "เรียนรู้เกี่ยวกับโครงการ Thai Migrant Watch เครื่องมือตรวจสอบความเสี่ยงสำหรับแรงงานไทยก่อนไปทำงานต่างประเทศ พร้อมนโยบาย PDPA",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "เกี่ยวกับ Thai Migrant Watch",
    description:
      "โครงการเพื่อสังคมที่มุ่งปกป้องแรงงานไทยจากการหลอกลวงไปทำงานต่างประเทศ",
    url: "https://checkgonbin.in.th/about",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "เกี่ยวกับ Thai Migrant Watch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "เกี่ยวกับ Thai Migrant Watch",
    description:
      "โครงการเพื่อสังคมที่มุ่งปกป้องแรงงานไทยจากการหลอกลวงไปทำงานต่างประเทศ",
    images: ["/og.png"],
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
