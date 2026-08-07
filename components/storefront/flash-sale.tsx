import { Zap } from "lucide-react";
import { ProductCard } from "./product-card";
import { CountdownTimer } from "./countdown-timer";
import { getFlashSaleProducts } from "@/lib/services/product.service";

export async function FlashSale() {
  const { data: flashSaleProducts } = await getFlashSaleProducts(4);

  if (!flashSaleProducts || flashSaleProducts.length === 0) {
    return null; // Don't render Flash Sale section if there are no discounted products
  }

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Red Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[400px] bg-red-600/5 dark:bg-red-900/20 blur-[120px] pointer-events-none -z-10 rounded-full" />
      
      <div className="max-w-7xl mx-auto px-4 md:px-10 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-card/40 backdrop-blur-md border border-border/50 rounded-[32px] p-6 sm:p-8 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="text-red-600 fill-red-600 w-10 h-10 animate-pulse drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
              <h2 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-amber-500">Flash Sale</h2>
            </div>
            <p className="text-muted-foreground font-medium">Ưu đãi đặc biệt kết thúc vào cuối ngày:</p>
          </div>
          
          <div className="bg-background/80 backdrop-blur-xl  px-5 py-3 rounded-[24px] shadow-md">
            <CountdownTimer />
          </div>
        </div>

        {/* Flash Sale Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
