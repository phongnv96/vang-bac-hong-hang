import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Diamond, ShieldCheck, Gem } from "lucide-react";
import Image from "next/image";
import { HomePagePriceBoard } from "@/features/price-board/components";
import { ReviewSection } from "@/features/products/components/review-section";

export function HomePage() {
  return (
    <div className="flex flex-col w-full bg-background min-h-screen">
      {/* ──────────────────────────────────────────────
          1. Hero Section (Luxury Cinematic Entry)
          ────────────────────────────────────────────── */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-linear-to-b from-background/40 via-background/60 to-background z-10" />
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        </div>

        <div className="container relative z-20 px-4 text-center mt-20">
          <Badge variant="outline" className="mb-6 border-primary/50 text-primary py-1 px-4 tracking-widest uppercase text-xs backdrop-blur-sm bg-background/50">
            Từ năm 1990
          </Badge>
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-6 leading-tight drop-shadow-2xl">
            Tinh Hoa <br />
            <span className="text-primary italic">Trang Sức</span> Việt
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            Chế tác thủ công tinh xảo, chất lượng vàng chuẩn xác. Tôn vinh vẻ đẹp sang trọng và đẳng cấp của riêng bạn với bộ sưu tập trang sức đặc quyền.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" asChild className="bg-primary text-primary-foreground hover:brightness-110 w-full sm:w-auto px-8 py-6 rounded-none text-sm tracking-widest uppercase">
              <Link href="/san-pham">Khám phá bộ sưu tập</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary text-primary hover:bg-primary/10 w-full sm:w-auto px-8 py-6 rounded-none text-sm tracking-widest uppercase backdrop-blur-sm">
              <Link href="/bang-gia-vang">Xem bảng giá toàn màn hình</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          2. Live Prices Callout
          ────────────────────────────────────────────── */}
      <section className="py-16 md:py-24 relative z-20 -mt-20">
        <div className="container px-4 mx-auto">
          <HomePagePriceBoard />
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          3. Featured Collections
          ────────────────────────────────────────────── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 lg:mb-16 gap-4">
            <div>
              <span className="text-primary tracking-widest uppercase text-xs font-semibold mb-2 block">Bộ Sưu Tập</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-foreground">Nổi Bật</h2>
            </div>
            <Link href="/san-pham" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center tracking-wide">
              Xem tất cả <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/san-pham?category=nhan" className="group">
              <div className="relative aspect-3/4 overflow-hidden bg-secondary">
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent z-10 opacity-80" />
                <Image
                  src="https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop"
                  alt="Nhẫn trang sức"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <h3 className="font-serif text-3xl text-foreground font-semibold mb-2">Nhẫn</h3>
                  <p className="text-primary text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Khám Phá</p>
                </div>
              </div>
            </Link>

            <Link href="/san-pham?category=day-chuyen" className="group md:-mt-8">
              <div className="relative aspect-3/4 overflow-hidden bg-secondary">
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent z-10 opacity-80" />
                <Image
                  src="https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1974&auto=format&fit=crop"
                  alt="Dây chuyền"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <h3 className="font-serif text-3xl text-foreground font-semibold mb-2">Dây Chuyền</h3>
                  <p className="text-primary text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Khám Phá</p>
                </div>
              </div>
            </Link>

            <Link href="/san-pham?category=trang-suc-cuoi" className="group">
              <div className="relative aspect-3/4 overflow-hidden bg-secondary">
                <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent z-10 opacity-80" />
                <Image
                  src="https://images.unsplash.com/photo-1622290319146-7b63df48a635?q=80&w=1974&auto=format&fit=crop"
                  alt="Trang sức cưới"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 w-full p-8 z-20">
                  <h3 className="font-serif text-3xl text-foreground font-semibold mb-2">Trang Sức Cưới</h3>
                  <p className="text-primary text-sm tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Khám Phá</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          4. USPs (Why Choose Us)
          ────────────────────────────────────────────── */}
      <section className="py-24 border-t border-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">Uy Tín & Chất Lượng</h2>
            <p className="text-muted-foreground font-light">Mang đến giá trị trường tồn qua từng sản phẩm. Chúng tôi cam kết chất lượng vàng chuẩn xác và dịch vụ tận tâm nhất.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Diamond className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif text-foreground font-semibold mb-3">Chế Tác Tinh Xảo</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">Sản phẩm được gia công bởi những nghệ nhân kim hoàn giàu kinh nghiệm, mang đến vẻ đẹp hoàn mỹ từng chi tiết.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif text-foreground font-semibold mb-3">Chất Lượng Đảm Bảo</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">Mọi sản phẩm đều được kiểm định chặt chẽ, cam kết tuổi vàng chuẩn xác với giấy đảm bảo đi kèm minh bạch.</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                <Gem className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-serif text-foreground font-semibold mb-3">Thu Đổi Dễ Dàng</h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed">Chính sách bảo hành và thu đổi rõ ràng, tối đa hóa quyền lợi khách hàng, giúp bạn an tâm khi sở hữu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────────
          5. Customer Reviews
          ────────────────────────────────────────────── */}
      <section className="py-12 bg-background mb-16 container mx-auto px-4">
        <ReviewSection />
      </section>
    </div>
  );
}
