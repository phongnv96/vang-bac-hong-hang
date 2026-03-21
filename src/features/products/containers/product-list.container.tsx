import { Product } from "../types";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const MOCK_PRODUCTS: Product[] = [
  {
    id: "nhan-kim-cuong-1",
    name: "Nhẫn Kim Cương Dáng Thanh Lịch",
    category: "Nhẫn",
    material: "Vàng Trắng 18K",
    stone: "Kim cương tự nhiên 5ly4",
    imageUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop",
    images: [],
    description: "Thiết kế hiện đại, sang trọng."
  },
  {
    id: "day-chuyen-vang-y",
    name: "Dây Chuyền Vàng Ý Chữ Thập",
    category: "Dây Chuyền",
    material: "Vàng Ý 18K",
    imageUrl: "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1974&auto=format&fit=crop",
    images: [],
    description: "Sang trọng, đẳng cấp."
  },
  {
    id: "nhan-cuoi-vang-hong",
    name: "Nhẫn Cưới Khắc CNC Đặc Biệt",
    category: "Trang Sức Cưới",
    material: "Vàng Hồng 14K",
    imageUrl: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?q=80&w=1974&auto=format&fit=crop",
    images: [],
    description: "Nhẫn cưới thiết kế riêng."
  },
  {
    id: "kieng-cuoi-24k",
    name: "Kiềng Cưới Hoa Mai Trạm Khắc",
    category: "Trang Sức Cưới",
    material: "Vàng 24K (9999)",
    weight: "5 Chỉ",
    imageUrl: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop",
    images: [],
    description: "Kiềng cưới truyền thống tinh xảo."
  },
];

export function ProductListContainer() {
  return (
    <div className="bg-background min-h-screen pt-12 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="outline" className="mb-4 text-primary border-primary/30 uppercase tracking-widest text-xs">
            Trang Sức Cao Cấp
          </Badge>
          <h1 className="font-serif text-4xl md:text-6xl font-bold text-foreground mb-6">
            Bộ Sưu Tập Nổi Bật
          </h1>
          <p className="text-muted-foreground font-light leading-relaxed">
            Mỗi chế tác là một tác phẩm nghệ thuật, kết hợp giữa kỹ thuật kim hoàn truyền thống và hơi thở thời đại mới.
          </p>
        </div>

        {/* Filters/Categories (Static for now) */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          {["Tất Cả", "Nhẫn", "Dây Chuyền", "Trang Sức Cưới", "Vòng Tay"].map((cat, i) => (
            <button
              key={cat}
              className={`px-6 py-2 rounded-full text-sm tracking-wide transition-all ${
                i === 0 
                ? "bg-primary text-primary-foreground font-medium" 
                : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
          {MOCK_PRODUCTS.map((product) => (
            <Link href={`/san-pham/${product.id}`} key={product.id} className="group flex flex-col">
              <div className="relative aspect-4/5 bg-secondary overflow-hidden mb-6">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Hover overlay indicator */}
                <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-300 pointer-events-none" />
              </div>
              
              <div className="flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <span>{product.category}</span>
                  <span className="text-primary">{product.material}</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                  {product.name}
                </h3>
                <div className="pt-4 border-t border-border mt-auto flex items-center text-primary text-sm tracking-wide font-medium">
                  Chi tiết <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
