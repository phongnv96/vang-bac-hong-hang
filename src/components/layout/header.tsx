import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Phone } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Logo } from "@/components/ui/logo";
import { DesktopAuth, MobileAuth } from "./header-auth";

const NAVIGATION_LINKS = [
  { href: "/", label: "Trang Chủ" },
  { href: "/bang-gia-vang", label: "Bảng Giá Vàng" },
  { href: "/san-pham", label: "Sản Phẩm" },
  { href: "/lien-he", label: "Liên Hệ" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 md:h-20 flex items-center justify-between transition-all">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Logo className="w-8 h-8 md:w-10 md:h-10" />
          <span className="font-serif text-2xl md:text-3xl font-bold tracking-wider text-primary">
            HỒNG HẰNG
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-primary transition-colors uppercase"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Call To Action */}
        <div className="hidden md:flex items-center gap-4">
          <DesktopAuth />
          <Button className="bg-primary text-primary-foreground font-semibold hover:brightness-110">
            <Phone className="w-4 h-4 mr-2" />
            098x.xxx.xxx
          </Button>
        </div>

        {/* Mobile Navigation (Sheet) */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Mở menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background/95 backdrop-blur-md border-l-border overflow-y-auto">
              <SheetTitle className="font-serif text-2xl text-primary mb-6 flex items-center gap-3">
                <Logo className="w-8 h-8" />
                HỒNG HẰNG
              </SheetTitle>
              
              {/* Mobile Auth Section */}
              <div className="mb-6 pb-6 border-b border-border/50">
                <MobileAuth />
              </div>

              <nav className="flex flex-col gap-4">
                {NAVIGATION_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors uppercase py-2 border-b border-border/50"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-8">
                <Button className="w-full bg-primary text-primary-foreground font-bold py-6">
                  <Phone className="w-5 h-5 mr-3" />
                  GỌI TƯ VẤN NGAY
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        
      </div>
    </header>
  );
}
