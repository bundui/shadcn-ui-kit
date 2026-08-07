import { getProduct } from "@/lib/services/product.service";
import { ProductCard } from "@/components/storefront/product-card";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function NewArrivals() {
  const { data: products } = await getProduct(undefined, 1, 8);

  if (!products || products.length === 0) return null;

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Subtle Blue/Primary Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 pb-6 relative">
          {/* Gradient separator line */}
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-border/80 via-border/20 to-transparent" />
          
          <div className="mb-4 sm:mb-0">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Sản phẩm Mới nhất</h2>
            <p className="text-muted-foreground mt-2 font-medium text-sm md:text-base">Cập nhật ngay những xu hướng và sản phẩm mới nhất</p>
          </div>
          <Link 
            href="/products" 
            className="group flex items-center gap-2 text-sm font-semibold text-foreground bg-card/60 backdrop-blur-md border border-border/50 hover:bg-primary hover:text-primary-foreground hover:border-primary px-5 py-2.5 rounded-[16px] transition-all duration-300 shadow-sm shrink-0 mb-1"
          >
            Xem tất cả <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
