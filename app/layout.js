import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";
import Script from "next/script";
import "./globals.css";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover", // lets the mobile tab bar sit above the home indicator
  themeColor: "#f5f5f7",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Thai Migrant Watch",
  alternateName: ["เช็คก่อนบิน", "ChekGonBin"],
  url: "https://thaimigrantwatch.org",
  logo: "https://thaimigrantwatch.org/og.png",
  sameAs: ["https://www.facebook.com/profile.php?id=61570127262236"],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: "thaimigrantwatchs@gmail.com",
    availableLanguage: ["th", "en"],
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Thai Migrant Watch",
  alternateName: ["เช็คก่อนบิน", "ChekGonBin"],
  url: "https://thaimigrantwatch.org",
  inLanguage: "th-TH",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://thaimigrantwatch.org/agencies?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export const metadata = {
  metadataBase: new URL("https://thaimigrantwatch.org"),
  title: "Thai Migrant Watch — ไปทำงานต่างประเทศ ดูทั้งเส้นทางก่อนโอนเงิน",
  description:
    "เลือกประเทศ แล้วดูทั้งเส้นทาง: ไปทางไหนได้บ้าง เช็กบริษัทก่อนจ่าย งานที่มีใบอนุญาต และโทรใครเมื่อมีปัญหา — เราไม่ใช่ช่องทางสมัคร และไม่รับเงิน",
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
  authors: [{ name: "Thai Migrant Watch" }],
  openGraph: {
    title: "Thai Migrant Watch — ไปทำงานต่างประเทศ ดูทั้งเส้นทางก่อนโอนเงิน",
    description: "เลือกประเทศ แล้วดูทั้งเส้นทาง: ไปทางไหนได้บ้าง เช็กบริษัทก่อนจ่าย และโทรใครเมื่อมีปัญหา",
    url: "https://thaimigrantwatch.org",
    siteName: "Thai Migrant Watch",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Thai Migrant Watch",
      },
    ],
    locale: "th_TH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thai Migrant Watch — ไปทำงานต่างประเทศ ดูทั้งเส้นทางก่อนโอนเงิน",
    description: "เลือกประเทศ แล้วดูทั้งเส้นทาง: ไปทางไหนได้บ้าง เช็กบริษัทก่อนจ่าย และโทรใครเมื่อมีปัญหา",
    images: ["/og.png"],
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
      <body className="min-h-screen flex flex-col relative overflow-x-hidden" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-3 focus:bg-accent focus:text-on-accent focus:rounded-xl focus:font-bold"
        >
          ข้ามไปเนื้อหาหลัก
        </a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
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

        <Providers>
          <Navbar />
          <main id="main-content" className="flex-1 flex flex-col items-center w-full">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
