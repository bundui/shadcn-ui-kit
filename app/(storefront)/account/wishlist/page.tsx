"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getWishlist, removeFromWishlist } from "@/lib/services/wishlist.service";
import { useAuth } from "@/components/providers/auth-provider";
import { addToCart } from "@/lib/services/cart.service";
import { IconLoader2, IconHeartBroken, IconTrash, IconShoppingCart } from "@tabler/icons-react";
import { LuxeLoading } from "@/components/storefront/luxe-loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export default function WishlistPage() {
  const { user, role } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = useCallback(async () => {
    setTimeout(() => setLoading(true), 0);
    const { data, error } = await getWishlist();
    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchWishlist();
    }
  }, [user, fetchWishlist]);

  const handleRemove = async (id: string) => {
    const { error } = await removeFromWishlist(id);
    if (!error) {
      setItems(items.filter(item => item.id !== id));
      toast.success("Đã xóa khỏi danh sách yêu thích");
    } else {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleAddToCart = async (product: any) => {
    if (role === "admin" || role === "staff") {
      toast.error(
        role === "admin"
          ? "Quản trị viên (Admin) không được mua hàng cá nhân để bảo đảm tính trung thực về doanh thu!"
          : "Nhân viên (Staff) không thể mua hàng bằng tài khoản nội bộ. Vui lòng dùng tài khoản Khách hàng!"
      );
      return;
    }

    // If product has variants, it's better to direct user to product page.
    // For simplicity here, we try to add it. If it requires variant, we could link them instead.
    const { error } = await addToCart(product.id, 1);
    if (error) {
      toast.error(error.message || "Lỗi khi thêm vào giỏ");
    } else {
      toast.success("Đã thêm vào giỏ hàng");
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  if (loading) return <LuxeLoading label="Đang tải danh sách yêu thích..." />;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Sản phẩm yêu thích</h1>
        <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">Lưu trữ và quản lý những sản phẩm bạn đang quan tâm.</p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-card/40 backdrop-blur-md rounded-[32px] border border-border/50 flex flex-col items-center justify-center">
          <div className="size-24 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mb-6 ring-8 ring-rose-50/50 dark:ring-rose-900/20">
            <Image src="/icons/love3.png" alt="Wishlist Empty" width={48} height={48} className="opacity-80 drop-shadow-sm" />
          </div>
          <h3 className="text-2xl font-bold text-foreground">Danh Sách Trống</h3>
          <p className="text-muted-foreground mt-2 max-w-md mx-auto mb-8 text-[15px]">Bạn chưa lưu sản phẩm nào. Hãy khám phá và thả tim cho những món đồ bạn yêu thích nhé.</p>
          <Button asChild className="rounded-full px-8 h-12 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all text-[15px] font-bold">
            <Link href="/products">Tiếp Tục Mua Sắm</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-12">
          {Object.entries(
            items.reduce((acc, item) => {
              const groupName = item.wishlist_groups?.name || "Mặc định";
              if (!acc[groupName]) acc[groupName] = [];
              acc[groupName].push(item);
              return acc;
            }, {} as Record<string, any[]>)
          ).map(([groupName, groupItems]: [string, any]) => (
            <div key={groupName} className="space-y-6">
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center shadow-sm border border-rose-100 dark:border-rose-900/50">
                    <Image src="/icons/love3.png" alt="Wishlist Group" width={20} height={20} />
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">{groupName}</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs font-bold">
                    {(groupItems as any[]).length}
                  </span>
                </div>
                <div className="flex-1 h-px bg-border/60"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {(groupItems as any[]).map((item) => {
                  const p = item.products;
                  if (!p) return null;
                  
                  const price = Number(p.price);
                  const discount = Number(p.discount_percent || 0);
                  const finalPrice = price - (price * discount / 100);

                  return (
                    <div key={item.id} className="group relative rounded-[24px] bg-card/40 hover:bg-card/80 border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col overflow-hidden">
                      {/* Product Image */}
                      <Link href={`/product/${p.id}`} className="relative aspect-[4/5] overflow-hidden bg-muted/30 block">
                        <Image 
                          fill
                          unoptimized
                          src={p.image_url} 
                          alt={p.name}
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                        
                        {/* Badges */}
                        {discount > 0 && (
                          <span className="absolute top-3 left-3 bg-red-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm z-10">
                            -{discount}%
                          </span>
                        )}
                        
                        {/* Floating Actions on Hover */}
                        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20 px-4">
                          <Button 
                            variant="default" 
                            size="sm"
                            className="flex-1 rounded-full shadow-lg font-bold bg-white/95 text-black hover:bg-white border border-white/20 dark:bg-black/80 dark:text-white dark:hover:bg-black backdrop-blur-md"
                            onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}
                          >
                            <IconShoppingCart className="size-4 mr-1.5" /> Thêm Giỏ
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="shrink-0 rounded-full shadow-lg size-9 border border-destructive/20 bg-destructive/90 hover:bg-destructive backdrop-blur-md"
                            onClick={(e) => { e.preventDefault(); handleRemove(item.id); }}
                          >
                            <IconTrash className="size-4 text-white" />
                          </Button>
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <Link href={`/product/${p.id}`} className="mb-1">
                          <h3 className="font-semibold text-[15px] text-foreground line-clamp-2 hover:text-primary transition-colors leading-snug">
                            {p.name}
                          </h3>
                        </Link>
                        
                        <div className="mt-1 mb-3">
                          <div className="flex flex-wrap items-baseline gap-2">
                            <span className="font-bold text-[17px] text-primary">{formatCurrency(finalPrice)}</span>
                            {discount > 0 && (
                              <span className="text-[13px] text-muted-foreground line-through decoration-muted-foreground/50">
                                {formatCurrency(price)}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {item.note && (
                          <div className="mt-auto text-[12.5px] bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 p-2.5 rounded-xl border border-amber-200/50 dark:border-amber-900/50 leading-relaxed">
                            <span className="font-bold uppercase text-[9px] tracking-wider mb-0.5 block opacity-70">Ghi chú</span>
                            <span className="italic line-clamp-2">{item.note}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
