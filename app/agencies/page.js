import { Suspense } from "react";
import AgenciesClient from "./AgenciesClient";

export const metadata = {
  title: "บริษัทจัดหางานที่ได้รับอนุญาต | Thai Migrant Watch",
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
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "บริษัทจัดหางานที่ได้รับอนุญาต | Thai Migrant Watch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "บริษัทจัดหางานที่ได้รับอนุญาต",
    description:
      "ค้นหาและตรวจสอบบริษัทจัดหางานที่ถูกกฎหมายจากฐานข้อมูลกรมการจัดหางาน",
    images: ["/og.png"],
  },
};

export default function AgenciesPage() {
  return (
    <Suspense
      fallback={
        <div className="w-full max-w-3xl px-4 md:px-6 pt-8 md:pt-14 pb-12">
          <h1 className="text-title1 md:text-large font-bold text-label tracking-tight">บริษัทจัดหางานที่ได้รับอนุญาต</h1>
          <p className="text-body text-label-2 mt-2">รายชื่อจากกรมการจัดหางาน อัปเดตทุกวัน</p>
        </div>
      }
    >
      <AgenciesClient />
    </Suspense>
  );
}
