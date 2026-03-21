"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, ShieldCheck, Phone } from "lucide-react";
import { Product } from "../types";
import { OrderFormDialog } from "../components/order-form-dialog";
import { ReviewSection } from "../components/review-section";

// Mock single product data
const MOCK_PRODUCT: Product = {
  id: "nhan-kim-cuong-1",
  name: "Nhẫn Kim Cương Dáng Thanh Lịch",
  category: "Nhẫn",
  material: "Vàng Trắng 18K",
  stone: "Kim cương tự nhiên 5ly4",
  weight: "1 Chỉ 2",
  imageUrl: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop",
  images: [
    "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=2000&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1543294001-f7cd5d7fb516?q=80&w=1974&auto=format&fit=crop"
  ],
  description: "Thiết kế hiện đại, sang trọng với viên kim cương chủ 5ly4 chuẩn giác cắt Excellent. Xung quanh đính kết các viên kim cương tấm tự nhiên tạo hiệu ứng bắt sáng rực rỡ, thích hợp làm quà tặng hoặc nhẫn cầu hôn."
};

export function ProductDetailContainer({ id }: { id: string }) {
  // We use this simple state to track active image, in a real app would use a carousel or selected index
  const [activeImage, setActiveImage] = useState(MOCK_PRODUCT.imageUrl);

  return (
    <div className="bg-background min-h-screen pt-10 pb-24">
      <div className="container mx-auto px-4">
        
        {/* Breadcrumb / Back Navigation */}
        <Link href="/san-pham" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Trở về Bộ Sưu Tập
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Images */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full bg-secondary overflow-hidden">
               <Image
                  src={activeImage}
                  alt={MOCK_PRODUCT.name}
                  fill
                  className="object-cover"
                />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {MOCK_PRODUCT.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square bg-secondary overflow-hidden border-2 transition-colors ${activeImage === img ? 'border-primary' : 'border-transparent'}`}
                >
                  <Image src={img} alt={`Thumb ${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Product Information */}
          <div className="flex flex-col justify-center">
            
            <div className="mb-2">
              <Badge variant="outline" className="text-primary border-primary/30 uppercase tracking-widest text-[10px]">
                {MOCK_PRODUCT.category}
              </Badge>
            </div>
            
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-4">
              {MOCK_PRODUCT.name}
            </h1>
            
            <div className="h-px w-full bg-border my-6" />
            
            <div className="space-y-4 mb-8">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Chất liệu:</span>
                <span className="col-span-2 font-medium text-foreground">{MOCK_PRODUCT.material}</span>
              </div>
              {MOCK_PRODUCT.weight && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-muted-foreground">Trọng lượng (dự kiến):</span>
                  <span className="col-span-2 font-medium text-foreground">{MOCK_PRODUCT.weight}</span>
                </div>
              )}
              {MOCK_PRODUCT.stone && (
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <span className="text-muted-foreground">Đính đá:</span>
                  <span className="col-span-2 font-medium text-foreground">{MOCK_PRODUCT.stone}</span>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 text-sm">
                <span className="text-muted-foreground">Tình trạng:</span>
                <span className="col-span-2 text-green-500 font-medium inline-flex items-center">
                  <Check className="w-4 h-4 mr-1" />
                  Sẵn hàng tại cửa hàng
                </span>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="font-serif text-xl font-semibold mb-3">Mô tả sản phẩm</h3>
              <p className="text-muted-foreground font-light text-sm leading-relaxed whitespace-pre-wrap">
                {MOCK_PRODUCT.description}
              </p>
            </div>

            {/* Note on pricing */}
            <div className="bg-primary/5 border border-primary/10 p-4 rounded-sm mb-8 text-sm text-foreground/80 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p>
                <b>Lưu ý về giá:</b> Do đặc thù giá vàng biến động mỗi ngày, quý khách vui lòng để lại thông tin đặt mua hoặc liên hệ trực tiếp để bộ phận CSKH báo giá chính xác nhất tại thời điểm hiện tại.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <OrderFormDialog productName={MOCK_PRODUCT.name} />
              <Button size="lg" variant="outline" className="flex-1 border-primary text-primary h-14 text-sm tracking-widest uppercase font-semibold rounded-none hover:bg-primary/10 hover:text-primary">
                <Phone className="w-4 h-4 mr-2" />
                GỌI QUA ZALO
              </Button>
            </div>
            
          </div>
        </div>

        {/* Similar / Related & Reviews */}
        <ReviewSection />

      </div>
    </div>
  );
}
