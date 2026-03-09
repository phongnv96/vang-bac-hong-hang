import Link from "next/link";
import { Facebook, MapPin, Phone, Mail } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  return (
    <footer className="bg-[#0A0000] border-t border-primary/20 text-foreground pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & Intro */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-2 group">
              <Logo className="w-10 h-10 group-hover:scale-105 transition-transform" />
              <span className="font-serif text-3xl font-bold tracking-wider text-primary">
                HỒNG HẰNG
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tự hào mang đến những sản phẩm trang sức vàng bạc cao cấp, thiết kế tinh xảo, chất lượng vượt trội. Nơi tôn vinh vẻ đẹp và giá trị trường tồn.
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-primary font-semibold tracking-wide">Liên Hệ</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-primary shrink-0" />
                <span>Số 123 Đường Hải Lựu, Xã Hải Lựu, Huyện Sông Lô, Tỉnh Vĩnh Phúc</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-primary shrink-0" />
                <span>098x.xxx.xxx</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-primary shrink-0" />
                <span>contact@vangbachonghang.com</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-primary font-semibold tracking-wide">Khám Phá</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/bang-gia-vang" className="text-muted-foreground hover:text-primary transition-colors">
                  Bảng Giá Vàng Trực Tuyến
                </Link>
              </li>
              <li>
                <Link href="/san-pham" className="text-muted-foreground hover:text-primary transition-colors">
                  Bộ Sưu Tập Trang Sức
                </Link>
              </li>
              <li>
                <Link href="/dinh-gia" className="text-muted-foreground hover:text-primary transition-colors">
                  Dịch Vụ Định Giá & Chế Tác
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach" className="text-muted-foreground hover:text-primary transition-colors">
                  Chính Sách Bảo Hành & Thu Đổi
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials & Business Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-primary font-semibold tracking-wide">Kết Nối Với Chúng Tôi</h3>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full border border-primary/30 flex items-center justify-center text-primary/80 hover:bg-primary hover:text-primary-foreground transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              {/* Add more social icons here like Zalo, Instagram */}
            </div>
            
            <div className="p-4 bg-primary/5 rounded-md border border-primary/10">
              <p className="text-xs text-muted-foreground mb-1">CƠ SỞ VÀNG BẠC HỒNG HẰNG</p>
              <p className="text-xs text-muted-foreground">Mã số thuế: 01xxxxxxx</p>
            </div>
          </div>
          
        </div>

        {/* Bottom Banner */}
        <div className="pt-8 border-t border-primary/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} Vàng Bạc Hồng Hằng. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground/60">
            <Link href="/dieu-khoan" className="hover:text-primary">Điều khoản dịch vụ</Link>
            <Link href="/bao-mat" className="hover:text-primary">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
