export const metadata = {
  title: "ผลการประเมินความเสี่ยง | เช็คก่อนบิน",
  description: "หน้าผลประเมินความเสี่ยงเฉพาะรายการ ไม่ได้จัดทำเพื่อการทำดัชนีในเครื่องมือค้นหา",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
      noarchive: true,
      nosnippet: true,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function ResultLayout({ children }) {
  return children;
}
