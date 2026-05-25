import ReportScamClient from "./ReportScamClient";

export const metadata = {
  title: "รายงานมิจฉาชีพ | เช็คก่อนบิน - แจ้งเบาะแสบริษัทหลอกลวง",
  description:
    "รายงานบริษัทหรือนายหน้าจัดหางานที่น่าสงสัย ช่วยป้องกันแรงงานไทยคนอื่นจากการถูกหลอก",
  alternates: { canonical: "/report-scam" },
  openGraph: {
    title: "รายงานมิจฉาชีพงานต่างประเทศ",
    description:
      "แจ้งเบาะแสบริษัทจัดหางานหลอกลวงเพื่อปกป้องแรงงานไทย",
    url: "https://checkgonbin.in.th/report-scam",
    type: "website",
    images: [
      {
        url: "/thumnail.png",
        width: 1200,
        height: 630,
        alt: "รายงานมิจฉาชีพ | เช็คก่อนบิน",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "รายงานมิจฉาชีพงานต่างประเทศ",
    description: "แจ้งเบาะแสบริษัทจัดหางานหลอกลวงเพื่อปกป้องแรงงานไทย",
    images: ["/thumnail.png"],
  },
};

export default function ReportScamPage() {
  return <ReportScamClient />;
}
