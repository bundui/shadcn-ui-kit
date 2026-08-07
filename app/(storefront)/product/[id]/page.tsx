import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/lib/services/product.service";
import { ProductGallery } from "@/components/storefront/product-gallery";
import { ProductTabs } from "@/components/storefront/product-tabs";
import { ProductCard } from "@/components/storefront/product-card";
import { ProductActions } from "@/components/storefront/product-actions";
import { Star } from "lucide-react";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const productId = resolvedParams.id;

  const { data: product, error } = await getProductById(productId);

  if (error || !product) {
    return notFound();
  }

  // Related products
  const { data: relatedProducts } = await getRelatedProducts(product.category_id, product.id, 4);

  // Format images
  const extraImages = product.product_images?.length 
    ? [...product.product_images].sort((a: any, b: any) => a.display_order - b.display_order)
    : [];
    
  const images = [
    { id: product.id, image_url: product.image_url },
    ...extraImages
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Product Overview */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div className="w-full">
          <ProductGallery images={images} productName={product.name} discountPercent={product.discount_percent} />
        </div>

        {/* Right: Product Info & Actions */}
        <div className="flex flex-col">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-sm flex flex-col space-y-6 lg:space-y-8 relative overflow-hidden">
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                {product.brand && (
                  <span className="px-3 py-1.5 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase tracking-widest border border-primary/20">
                    {product.brand}
                  </span>
                )}
                <span className="flex items-center text-muted-foreground font-medium text-xs bg-muted/30 px-3 py-1.5 rounded-full border border-border/50">
                  {product.product_reviews?.length ? (
                    <>
                      <Star className="size-4 mr-1.5 text-amber-500 fill-amber-500 inline-block" />
                      <span className="font-bold text-foreground">
                        {(product.product_reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0) / product.product_reviews.length).toFixed(1)}
                      </span>
                      <span className="ml-1 opacity-80">({product.product_reviews.length} Đánh giá)</span>
                    </>
                  ) : (
                    <span>Chưa có đánh giá</span>
                  )}
                </span>
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.1]">{product.name}</h1>
            </div>

            {product.description && (
              <p className="text-muted-foreground text-sm sm:text-base line-clamp-3 leading-relaxed relative z-10">
                {product.description}
              </p>
            )}

            <div className="relative z-10">
              {/* Interactive Client Component for Price, Quantity, Variant Selection & Buttons */}
              <ProductActions 
                productId={product.id}
                productName={product.name}
                productImage={product.image_url}
                productSlug={product.slug || product.id}
                basePrice={product.price}
                discountPercent={product.discount_percent}
                variants={product.product_variants || []}
                stockQuantity={product.stock_quantity || 0}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <ProductTabs 
        productId={product.id}
        description={product.description_html || product.description || ""} 
        specs={product.product_specs || []} 
        reviews={product.product_reviews || []}
        productName={product.name}
        productImage={product.image_url}
      />

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">Sản phẩm liên quan</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p as any} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
