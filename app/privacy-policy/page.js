import PrivacyPolicyClient from "./PrivacyPolicyClient";

export const metadata = {
  title: "นโยบายความเป็นส่วนตัว | เช็คก่อนบิน",
  description:
    "นโยบายความเป็นส่วนตัวของเช็คก่อนบิน การเก็บรักษาและคุ้มครองข้อมูลส่วนบุคคลตามมาตรฐาน PDPA",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "นโยบายความเป็นส่วนตัว",
    description:
      "การเก็บรักษาและคุ้มครองข้อมูลส่วนบุคคลตามมาตรฐาน PDPA",
    url: "https://checkgonbin.in.th/privacy-policy",
    type: "website",
    images: [
      {
        url: "/thumnail.png",
        width: 1200,
        height: 630,
        alt: "นโยบายความเป็นส่วนตัว | เช็คก่อนบิน",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "นโยบายความเป็นส่วนตัว",
    description: "การเก็บรักษาและคุ้มครองข้อมูลส่วนบุคคลตามมาตรฐาน PDPA",
    images: ["/thumnail.png"],
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
