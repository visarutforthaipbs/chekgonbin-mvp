import { Providers } from "./providers";
import "./globals.css";

export const metadata = {
  title: "เช็คก่อนบิน - ตรวจสอบความเสี่ยงงานต่างประเทศ",
  description:
    "เครื่องมือช่วยตรวจสอบความเสี่ยงเบื้องต้นก่อนตัดสินใจไปทำงานต่างประเทศ",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
