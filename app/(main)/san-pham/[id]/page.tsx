import { ProductDetailContainer } from "@/features/products";

export default async function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  return <ProductDetailContainer id={id} />;
}
