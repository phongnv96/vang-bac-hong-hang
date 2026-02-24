import type { Metadata } from "next";
import "./globals.css";

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL;
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()), // Tự động lấy domain từ Vercel khi deploy
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
    // Next.js sẽ tự động dùng file opengraph-image.tsx nên không cần chỉ định mảng images ở đây
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Roboto+Condensed:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
