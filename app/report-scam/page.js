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
  },
};

export default function ReportScamPage() {
  return <ReportScamClient />;
}
