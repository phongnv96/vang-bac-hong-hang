import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bảng Giá Vàng - Hồng Hằng",
  description: "Bảng giá vàng bạc cập nhật - Doanh nghiệp Vàng Bạc Hồng Hằng",
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
