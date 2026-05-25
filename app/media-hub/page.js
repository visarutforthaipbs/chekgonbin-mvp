import MediaHubClient from "./MediaHubClient";

export const metadata = {
  title: "ศูนย์ความรู้ | เช็คก่อนบิน - วิธีป้องกันการถูกหลอกทำงานต่างประเทศ",
  description:
    "เรียนรู้วิธีปกป้องตัวเองจากการหลอกลวง สัญญาณอันตราย และขั้นตอนที่ถูกต้องก่อนไปทำงานต่างประเทศ",
  alternates: { canonical: "/media-hub" },
  openGraph: {
    title: "ศูนย์ความรู้เช็คก่อนบิน",
    description:
      "เนื้อหาความรู้ อินโฟกราฟิก และแนวทางปลอดภัยสำหรับแรงงานไทย",
    url: "https://checkgonbin.in.th/media-hub",
    type: "website",
    images: [
      {
        url: "/thumnail.png",
        width: 1200,
        height: 630,
        alt: "ศูนย์ความรู้เช็คก่อนบิน",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ศูนย์ความรู้เช็คก่อนบิน",
    description:
      "เนื้อหาความรู้ อินโฟกราฟิก และแนวทางปลอดภัยสำหรับแรงงานไทย",
    images: ["/thumnail.png"],
  },
};

export default function MediaHubPage() {
  return <MediaHubClient />;
}
