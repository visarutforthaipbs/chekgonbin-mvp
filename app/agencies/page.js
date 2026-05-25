import AgenciesClient from "./AgenciesClient";

export const metadata = {
  title: "บริษัทจัดหางานที่ได้รับอนุญาต | เช็คก่อนบิน",
  description:
    "รายชื่อบริษัทจัดหางานที่ได้รับใบอนุญาตจากกรมการจัดหางาน (DOE) ตรวจสอบก่อนใช้บริการ อัปเดตทุกวัน",
  alternates: { canonical: "/agencies" },
  openGraph: {
    title: "บริษัทจัดหางานที่ได้รับอนุญาต",
    description:
      "ค้นหาและตรวจสอบบริษัทจัดหางานที่ถูกกฎหมายจากฐานข้อมูลกรมการจัดหางาน",
    url: "https://checkgonbin.in.th/agencies",
    type: "website",
    images: [
      {
        url: "/thumnail.png",
        width: 1200,
        height: 630,
        alt: "บริษัทจัดหางานที่ได้รับอนุญาต | เช็คก่อนบิน",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "บริษัทจัดหางานที่ได้รับอนุญาต",
    description:
      "ค้นหาและตรวจสอบบริษัทจัดหางานที่ถูกกฎหมายจากฐานข้อมูลกรมการจัดหางาน",
    images: ["/thumnail.png"],
  },
};

export default function AgenciesPage() {
  return <AgenciesClient />;
}
