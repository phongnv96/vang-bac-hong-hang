import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tài khoản khách hàng",
  description:
    "Theo dõi tích lũy vàng, giao dịch mua/bán và lời lỗ tại Vàng Bạc Hồng Hằng.",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
