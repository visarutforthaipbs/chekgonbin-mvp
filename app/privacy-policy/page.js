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
  },
};

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyClient />;
}
