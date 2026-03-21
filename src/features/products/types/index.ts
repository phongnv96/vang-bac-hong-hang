export type Product = {
  id: string;
  name: string;
  category: string;
  material: string; // e.g., Vàng 18K, Vàng 9999
  weight?: string; // e.g., 2 chỉ 5 phân
  stone?: string; // e.g., Kim cương tự nhiên, Đá CZ
  imageUrl: string;
  images: string[];
  description: string;
};
