import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

export interface ProductCardData {
  id: string;
  name: string;
  image_url?: string;
  price: number;
  discount_percent?: number | null;
  stock_quantity?: number | null;
  sold?: number; // Not in DB yet, make it optional
  brand?: string | null;
  categories?: { name: string } | null;
}

interface ProductCardProps {
  product: ProductCardData;
}

export function ProductCard({ product }: ProductCardProps) {
  const stock = product.stock_quantity || 0;
  const isOutOfStock = stock <= 0;
  const sold = product.sold || 0;
  const totalOriginalStock = stock + sold; // Assuming stock_quantity is current available stock
  const progress = totalOriginalStock > 0 ? Math.min(100, Math.round((sold / totalOriginalStock) * 100)) : 0;

  const hasDiscount = (product.discount_percent ?? 0) > 0;
  const originalPrice = product.price;
  const salePrice = hasDiscount
    ? Math.round(originalPrice * (1 - (product.discount_percent as number) / 100))
    : originalPrice;

  return (
    <div className={cn(
      "group border border-border/50 rounded-[24px] overflow-hidden cursor-pointer bg-card/80 backdrop-blur-xl transition-all duration-500 relative flex flex-col h-full",
      isOutOfStock 
        ? "hover:border-border transition-all" 
        : "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:bg-card"
    )}>
      {hasDiscount && (
        <Badge className="absolute top-5 left-5 z-10 bg-red-600 hover:bg-red-700 text-white shadow-md border-none px-2.5 py-1 text-xs font-extrabold pointer-events-none">
          -{product.discount_percent}%
        </Badge>
      )}
      
      <Link href={`/product/${product.id}`} className="relative aspect-square overflow-hidden bg-secondary/10 m-3 rounded-[16px] block cursor-pointer group/image">
        <Image
          fill
          unoptimized
          alt={product.name}
          className={cn(
            "object-contain p-4 transition-all duration-500",
            isOutOfStock ? "opacity-40 group-hover/image:opacity-70" : "group-hover/image:scale-110"
          )}
          src={product.image_url || "/placeholder-image.jpg"}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
             <div className="border-[4px] border-red-600/80 text-red-600/80 px-4 py-2 rounded-md font-black text-xl  tracking-[0.15em] uppercase transform -rotate-[15deg] shadow-2xl bg-white/10 backdrop-blur-[1px]">
               Cháy hàng
             </div>
          </div>
        )}
      </Link>
      <div className="p-4 pt-2 flex flex-col flex-grow">
        <Link href={`/product/${product.id}`} className="flex justify-between items-start mb-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-bold text-[17px] leading-snug text-foreground line-clamp-2 hover:text-primary transition-colors cursor-pointer pr-2">
              {product.name}
            </h3>
            {product.brand && (
              <span className="text-primary/80 font-bold text-[10px] uppercase tracking-widest">
                {product.brand}
              </span>
            )}
          </div>
          <div className="flex flex-col items-end shrink-0">

            <div className="mt-auto">
              <div className="flex justify-between text-xs font-semibold text-muted-foreground ">
                <span>{sold > 0 ? `Đã bán ${sold}` : ''}</span>
                {isOutOfStock ? (
                  <span className="text-white bg-red-600/90 shadow-sm px-2.5 py-0.5 rounded-full font-bold">Hết hàng</span>
                ) : (
                  <span>Còn {stock}</span>
                )}
              </div>
              {!isOutOfStock && sold > 0 && (
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full rounded-full" style={{ width: `${progress}%` }}></div>
                </div>
              )}
            </div>

          </div>
        </Link>
        <div className="flex justify-between items-end flex-wrap gap-x-3 gap-y-1 mt-auto pt-2">
          <div className="flex flex-col items-start gap-1">
            <span className={cn(
              "font-extrabold text-xl leading-none",
              isOutOfStock ? "text-muted-foreground" : "text-red-600"
            )}>
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(salePrice)}
            </span>
            {hasDiscount && (
              <span className="text-muted-foreground line-through text-xs font-semibold leading-none">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
