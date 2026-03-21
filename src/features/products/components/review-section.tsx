import { Star } from "lucide-react";
import Image from "next/image";

const MOCK_REVIEWS = [
  {
    id: 1,
    author: "Thu Hà",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    date: "12/10/2023",
    content: "Nhẫn siêu đẹp, độ sáng của kim cương cực kỳ xuất sắc. Chế độ bảo hành rõ ràng nên rất yên tâm mua ở Hồng Hằng."
  },
  {
    id: 2,
    author: "Hoàng Oanh",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    rating: 5,
    date: "05/09/2023",
    content: "Nhân viên tư vấn rất nhiệt tình, giúp mình chọn được size nhẫn vừa in. Sản phẩm hoàn thiện rất tỉ mỉ."
  }
];

export function ReviewSection() {
  return (
    <div className="mt-20 pt-16 border-t border-primary/10">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h2 className="font-serif text-3xl md:text-5xl font-bold text-foreground mb-6">
          Khách Hàng Đánh Giá
        </h2>
        <p className="text-muted-foreground font-light">
          Những trải nghiệm và sự hài lòng của quý khách hàng chính là thước đo giá trị chân thực nhất cho chất lượng sản phẩm và dịch vụ của chúng tôi.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {MOCK_REVIEWS.map((review) => (
          <div key={review.id} className="p-6 bg-secondary/30 border border-primary/10 backdrop-blur-sm rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border border-primary/20">
                  <Image 
                    src={review.avatar} 
                    alt={review.author} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="font-medium text-lg text-primary">{review.author}</div>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-3 h-3 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted'}`} 
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{review.date}</span>
            </div>
            
            <p className="text-sm font-light leading-relaxed text-muted-foreground">
              "{review.content}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
