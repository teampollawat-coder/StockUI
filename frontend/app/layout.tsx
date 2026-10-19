import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = { title: "ร้านค้า", description: "ระบบแสดงสินค้า สต็อก และตะกร้า" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
