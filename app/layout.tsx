import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";

/* ──────────────────────────────────────────────
   Font Configuration (self-hosted via next/font)
   ────────────────────────────────────────────── */

/** Display / Heading font — serif, luxury feel */
const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  weight: ["700", "900"],
  variable: "--font-playfair",
  display: "swap",
});

/** Body font — sans-serif, excellent Vietnamese support */
const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-body",
  display: "swap",
});

/* ──────────────────────────────────────────────
   Metadata
   ────────────────────────────────────────────── */

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: "Bảng Giá Vàng - Vàng Bạc Hồng Hằng",
  description: "Trang cập nhật giá vàng bạc 9999, vàng tây, vàng ý, trang sức trực tuyến mỗi ngày tại Vàng Bạc Hồng Hằng - Hải Lựu, Sông Lô, Vĩnh Phúc.",
  keywords: ["Giá vàng", "Vàng bạc Hồng Hằng", "Giá vàng 9999", "Giá vàng hôm nay", "Trang sức vàng", "Tiệm vàng Hồng Hằng", "Sông Lô", "Vĩnh Phúc"],
  authors: [{ name: "Vàng Bạc Hồng Hằng" }],
  openGraph: {
    title: "Bảng Giá Vàng - Vàng Bạc Hồng Hằng",
    description: "Cập nhật bảng giá vàng 9999, nữ trang, nhẫn tròn trơn trực tuyến nhanh nhất và chính xác nhất tại Vàng Bạc Hồng Hằng.",
    url: "/",
    siteName: "Vàng Bạc Hồng Hằng",
    locale: "vi_VN",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

/* ──────────────────────────────────────────────
   Root Layout
   ────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${playfair.variable} ${beVietnam.variable}`}>
      <body className="font-(family-name:--font-body) antialiased">
        {children}
      </body>
    </html>
  );
}

