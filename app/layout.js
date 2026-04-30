import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://checkgonbin.in.th"),
  title: "เช็คก่อนบิน - ตรวจสอบความเสี่ยงงานต่างประเทศ | ป้องกันมิจฉาชีพ",
  description:
    "เครื่องมือตรวจสอบความเสี่ยงเบื้องต้นสำหรับผู้หางานต่างประเทศ เช็คบริษัทจัดหางาน ตรวจสอบบัญชีดำ (Blacklist) และป้องกันการโดนหลอกไปทำงานต่างประเทศ",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "เช็คก่อนบิน",
    "ตรวจสอบงานต่างประเทศ",
    "โดนหลอกทำงานต่างประเทศ",
    "บริษัทจัดหางานถูกกฎหมาย",
    "ตรวจสอบใบอนุญาตจัดหางาน",
    "เตือนภัยแรงงานไทย",
    "หางานเกาหลี",
    "หางานไต้หวัน",
  ],
  authors: [{ name: "ChekGonBin Team" }],
  openGraph: {
    title: "เช็คก่อนบิน - ตรวจสอบความเสี่ยงก่อนไปทำงานต่างประเทศ",
    description: "อย่าให้ความฝันกลายเป็นฝันร้าย! ตรวจสอบความเสี่ยงและบริษัทจัดหางานได้ฟรีที่นี่",
    url: "https://checkgonbin.in.th",
    siteName: "เช็คก่อนบิน",
    images: [
      {
        url: "/thumnail.png",
        width: 1200,
        height: 630,
        alt: "เช็คก่อนบิน - ตรวจสอบความเสี่ยงงานต่างประเทศ",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "เช็คก่อนบิน - ตรวจสอบความเสี่ยงก่อนไปทำงานต่างประเทศ",
    description: "เครื่องมือป้องกันการโดนหลอกไปทำงานต่างประเทศ ตรวจสอบความเสี่ยงได้ใน 1 นาที",
    images: ["/thumnail.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className="min-h-screen flex flex-col" suppressHydrationWarning>
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KR47Y7TTK7"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-KR47Y7TTK7');
          `}
        </Script>

        <Navbar />
        <main className="flex-1 flex flex-col items-center w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
