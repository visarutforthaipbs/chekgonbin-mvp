import RoundsClient from "./RoundsClient";

const title = "งานต่างประเทศที่มีใบอนุญาต | Thai Migrant Watch";
const description =
  "งานต่างประเทศที่มีใบอนุญาตให้รับสมัครจากกรมการจัดหางาน: จำนวนคน เพศ อายุ ค่าจ้าง ใครจ่ายค่าอะไร และบริษัทที่ได้รับอนุญาต อ่านจากใบอนุญาตตัวจริง";

// Re-render daily so permits whose window has ended drop off without a deploy.
export const revalidate = 86400;

export const metadata = {
  title,
  description,
  alternates: { canonical: "/rounds" },
  openGraph: {
    title: "งานต่างประเทศที่มีใบอนุญาต",
    description,
    url: "https://thaimigrantwatch.org/rounds",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
  },
  twitter: { card: "summary_large_image", title: "งานต่างประเทศที่มีใบอนุญาต", description, images: ["/og.png"] },
};

export default function RoundsPage() {
  return <RoundsClient />;
}
