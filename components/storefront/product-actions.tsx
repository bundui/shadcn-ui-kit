"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { addToCart, addToGuestCart } from "@/lib/services/cart.service";
import { checkWishlisted, removeFromWishlistByProduct } from "@/lib/services/wishlist.service";
import { useRouter } from "next/navigation";
import { Heart, Tag, Sparkles, ShieldCheck, Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/providers/auth-provider";
import { useAuthModal } from "@/lib/store/use-auth-modal";
import { toast } from "sonner";
import { WishlistModal } from "./wishlist-modal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Variant {
  id: string;
  name: string;
  sku: string;
  price_modifier: number;
  stock_quantity: number;
}

interface ProductActionsProps {
  productId: string;
  productName?: string;
  productImage?: string;
  productSlug?: string;
  basePrice: number;
  discountPercent?: number;
  variants: Variant[];
  stockQuantity?: number;
}

export function ProductActions({ productId, productName, productImage, productSlug, basePrice, discountPercent, variants, stockQuantity = 0 }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    variants && variants.length > 0 ? variants[0] : null
  );

  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);

  const { user, role } = useAuth();
  const { openModal } = useAuthModal();
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isTogglingHeart, setIsTogglingHeart] = useState(false);
  const [showWishlistModal, setShowWishlistModal] = useState(false);

  useEffect(() => {
    if (user) {
      checkWishlisted(productId).then((isListed) => {
        setIsWishlisted(!!isListed);
      });
    }
  }, [user, productId]);

  const handleToggleWishlist = async () => {
    if (!user) {
      setShowLoginAlert(true);
      return;
    }

    if (isWishlisted) {
      // Bỏ yêu thích trực tiếp
      setIsTogglingHeart(true);
      const { error } = await removeFromWishlistByProduct(productId);
      setIsTogglingHeart(false);
      if (!error) {
        setIsWishlisted(false);
        toast.success("Đã bỏ yêu thích");
      }
    } else {
      // Thêm mới -> bật popup
      setShowWishlistModal(true);
    }
  };

  // Calculate final price based on discount and selected variant
  const hasDiscount = (discountPercent ?? 0) > 0;
  const originalBasePrice = basePrice;
  const saleBasePrice = hasDiscount
    ? Math.round(originalBasePrice * (1 - (discountPercent as number) / 100))
    : originalBasePrice;

  const currentPriceModifier = selectedVariant ? selectedVariant.price_modifier : 0;

  const finalPrice = saleBasePrice + currentPriceModifier; // Red text (Sale Price)
  const finalOriginalPrice = originalBasePrice + currentPriceModifier; // Strikethrough (Original Price)

  const isOutOfStock = variants && variants.length > 0
    ? selectedVariant?.stock_quantity === 0
    : stockQuantity <= 0;

  const handleAddToCart = async () => {
    if (role === "admin" || role === "staff") {
      toast.error(
        role === "admin"
          ? "Quản trị viên (Admin) không được mua hàng cá nhân để bảo đảm tính trung thực về doanh thu!"
          : "Nhân viên (Staff) không thể mua hàng bằng tài khoản nội bộ. Vui lòng dùng tài khoản Khách hàng!"
      );
      return;
    }

    if (!user) {
      addToGuestCart({
        quantity: 1,
        product_id: productId,
        variant_id: selectedVariant?.id || null,
        products: {
          id: productId,
          name: productName || "Sản phẩm",
          price: basePrice,
          discount_percent: discountPercent,
          image_url: productImage || "/placeholder.png",
          slug: productSlug || productId,
        },
        product_variants: selectedVariant || null,
      });
      toast.success("Đã thêm vào giỏ hàng thành công!");
      return;
    }

    setIsAdding(true);
    const { error } = await addToCart(productId, 1, selectedVariant?.id);
    setIsAdding(false);

    if (error) {
      toast.error(error.message || "Có lỗi xảy ra khi thêm vào giỏ hàng!");
    } else {
      toast.success("Đã thêm vào giỏ hàng thành công!");
      window.dispatchEvent(new Event("cart-updated"));
    }
  };

  const handleBuyNow = async () => {
    if (role === "admin" || role === "staff") {
      toast.error(
        role === "admin"
          ? "Quản trị viên (Admin) không được mua hàng cá nhân để bảo đảm tính trung thực về doanh thu!"
          : "Nhân viên (Staff) không thể mua hàng bằng tài khoản nội bộ. Vui lòng dùng tài khoản Khách hàng!"
      );
      return;
    }

    if (!user) {
      addToGuestCart({
        quantity: 1,
        product_id: productId,
        variant_id: selectedVariant?.id || null,
        products: {
          id: productId,
          name: productName || "Sản phẩm",
          price: basePrice,
          discount_percent: discountPercent,
          image_url: productImage || "/placeholder.png",
          slug: productSlug || productId,
        },
        product_variants: selectedVariant || null,
      });
      router.push("/cart");
      return;
    }

    setIsAdding(true);
    const { error } = await addToCart(productId, 1, selectedVariant?.id);
    setIsAdding(false);

    if (error) {
      toast.error(error.message || "Có lỗi xảy ra!");
    } else {
      window.dispatchEvent(new Event("cart-updated"));
      router.push("/cart");
    }
  };

  return (
    <div className="space-y-6">
      {/* Price & Detailed Discount Display - Shimmering Luxury VIP Banner */}
      <div className="relative group rounded-3xl p-[2px] bg-gradient-to-r from-red-500 via-amber-400 to-rose-600 shadow-[0_10px_35px_rgba(239,68,68,0.25)] dark:shadow-[0_10px_35px_rgba(239,68,68,0.35)] transition-all duration-500 hover:shadow-[0_15px_45px_rgba(245,158,11,0.35)] overflow-hidden">
        {/* Shimmer light sweep beam */}
        <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/100 dark:via-white/50 to-transparent animate-shimmer-sweep pointer-events-none z-20" />

        {/* Ambient glowing background orbs */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-amber-400/30 via-red-500/20 to-transparent  rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700 animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-rose-500/20 via-orange-400/20 to-transparent rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />

        <div className="relative z-10 rounded-[22px] bg-white dark:bg-black p-4 sm:p-6 backdrop-blur-xl space-y-4 overflow-hidden border border-white/60 dark:border-white/10">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 ">
              <span className={cn(
                "text-3xl sm:text-4xl xl:text-5xl font-black bg-clip-text text-transparent tracking-tight leading-none drop-shadow-sm",
                isOutOfStock ? "bg-gradient-to-r from-muted-foreground to-muted-foreground/60" : "bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 dark:from-red-400 dark:via-rose-400 dark:to-amber-400"
              )}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalPrice)}
              </span>
              {!isOutOfStock && hasDiscount && (
                <span className="text-base sm:text-lg xl:text-xl text-muted-foreground/80 line-through decoration-red-500/70 font-semibold tracking-normal">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalOriginalPrice)}
                </span>
              )}
              {isOutOfStock && (
                <Badge className="bg-muted/80 backdrop-blur-md text-muted-foreground border-border/50 px-3 py-1.5 text-xs font-bold tracking-widest uppercase shadow-sm pointer-events-none ml-2">
                  Tạm hết hàng
                </Badge>
              )}
            </div>
            {!isOutOfStock && hasDiscount && (
              <Badge className="bg-gradient-to-r from-red-500 via-rose-500 to-amber-500 hover:from-red-700 hover:to-amber-700 text-white font-extrabold px-3.5 py-1.5 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5 shadow-[0_4px_15px_rgba(239,68,68,0.4)] border border-amber-300/50  w-fit shrink-0" style={{
                borderBottomRightRadius: "50%",
                borderTopRightRadius: "50%"
              }}>
                <Image src="/icons/discount1.png" alt="Discount" width={18} height={18} className="shrink-0 drop-shadow animate-bounce-subtle" />
                <span className="drop-shadow-sm">GIẢM NGAY {discountPercent}%</span>
              </Badge>
            )}
          </div>

          {!isOutOfStock && hasDiscount && (
            <div className="pt-3.5 border-t border-red-200/60 dark:border-red-800/40 flex flex-col xl:flex-row xl:items-center justify-between items-center sm:items-start gap-3 text-xs sm:text-sm font-medium">
              <div className="flex flex-wrap items-center gap-2 w-fit px-3.5 py-2 rounded-xl border-2 border-yellow-400 dark:border-red-400/20 backdrop-blur-md shadow-md">
                <Image src="/icons/save_money.png" alt="Discount" width={18} height={18} className="shrink-0 drop-shadow animate-pulse" />
                <span className="text-gray-400 dark:text-gray-300 font-semibold">Tiết kiệm:</span>
                <span className="font-black text-red-600 dark:text-amber-400 text-sm sm:text-base tracking-wide drop-shadow-sm">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(finalOriginalPrice - finalPrice)}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/15 via-red-500/15 to-orange-500/15 dark:from-amber-400/20 dark:to-red-400/20 text-red-500 dark:text-amber-200 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide shadow-md w-fit shrink-0">
                <span className="size-1 rounded-full bg-red-500 animate-ping inline-block" />
                <span>Ưu đãi áp dụng có hạn</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Promotional Perks Box */}
      {/* <div className="grid grid-cols-1 xl:grid-cols-2 gap-3 p-4 rounded-xl bg-secondary/40 border border-outline-variant/60 text-xs sm:text-sm text-foreground/80">
        <div className="flex items-center gap-2.5">
          <Truck className="size-4 text-primary shrink-0" />
          <span>Miễn phí vận chuyển toàn quốc cho đơn từ 500k</span>
        </div>
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
          <span>Bảo hành chính hãng 100%, đổi trả tận nơi 7 ngày</span>
        </div>
      </div> */}

      {/* Variants Selection */}
      {variants && variants.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-border/50">
          <div>
            <h3 className="text-sm font-semibold mb-3 text-foreground">Tùy chọn:</h3>
            <div className="flex flex-wrap gap-2.5">
              {variants.map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariant(variant)}
                  className={cn(
                    "px-4 py-2 border rounded-[12px] transition-all duration-300 font-medium text-sm",
                    selectedVariant?.id === variant.id
                      ? "border-primary bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                      : "border-border/60 bg-card/50 hover:bg-card hover:border-primary/40 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {variant.name}
                  {variant.price_modifier > 0 && (
                    <span className="text-xs ml-1.5 opacity-70">
                      (+{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price_modifier)})
                    </span>
                  )}
                  {variant.price_modifier < 0 && (
                    <span className="text-xs ml-1.5 opacity-70">
                      ({new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(variant.price_modifier)})
                    </span>
                  )}
                </button>
              ))}
            </div>
            {selectedVariant && (
              <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500" />
                Kho: {selectedVariant.stock_quantity > 0 ? <strong className="text-foreground">{selectedVariant.stock_quantity} sản phẩm</strong> : <span className="text-destructive font-bold">Hết hàng</span>}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="flex-1 flex justify-center items-center h-14 px-5 py-3 bg-primary text-primary-foreground font-bold text-sm sm:text-base rounded-[16px] shadow-lg shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {isOutOfStock ? (
            <span>Sản phẩm hiện đang tạm hết hàng</span>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px] mr-2">shopping_bag</span>
              <span>{isAdding ? "Đang xử lý..." : "Thêm vào giỏ hàng"}</span>
            </>
          )}
        </button>
        {!isOutOfStock && (
          <button
            onClick={handleBuyNow}
            disabled={isAdding}
            className="flex-1 min-w-[130px] flex justify-center items-center h-14 px-5 py-3 bg-card/80 backdrop-blur-md border-2 border-primary/20 text-primary font-bold text-sm sm:text-base rounded-[16px] hover:bg-primary/5 hover:border-primary/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shrink-0"
          >
            <span>{isAdding ? "Đang xử lý..." : "Mua ngay"}</span>
          </button>
        )}
        <button
          onClick={handleToggleWishlist}
          disabled={isTogglingHeart}
          className="flex justify-center items-center h-14 w-14 bg-card/80 backdrop-blur-md border border-border/50 text-muted-foreground rounded-[16px] hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-500 hover:border-red-200 transition-all duration-300 shrink-0"
        >
          <Heart className={cn("w-5 h-5 transition-colors shrink-0", isWishlisted && "fill-red-500 text-red-500")} />
        </button>
      </div>

      {/* Badges */}
      <div className="flex flex-col md:flex-row justify-between  text-sm text-muted-foreground">
        <div className="flex items-center"><span className="material-symbols-outlined text-[18px] mr-2">local_shipping</span> Giao hàng miễn phí toàn quốc</div>
        <div className="flex items-center"><span className="material-symbols-outlined text-[18px] mr-2">assignment_return</span> Đổi trả trong vòng 7 ngày</div>
      </div>

      {/* Login Alert Modal */}
      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent className="sm:max-w-[550px] overflow-hidden rounded-[24px] border border-border/50 bg-background/95 backdrop-blur-2xl shadow-2xl p-0 animate__animated animate__zoomIn animate__faster">
          {/* Decorative Background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="p-6 pb-2 relative z-10">
            <AlertDialogHeader className="space-y-3">
              <div className="flex items-center gap-2">
                <Image src="/icons/lock.png" alt="Lock" width={35} height={35} />
              <AlertDialogTitle className="text-xl sm:text-xl font-black text-center sm:text-left">
                Yêu cầu đăng nhập
              </AlertDialogTitle>
              </div>
              <AlertDialogDescription className="text-sm sm:text-base text-center sm:text-left text-muted-foreground leading-relaxed">
                Vui lòng đăng nhập để lưu sản phẩm vào danh sách yêu thích và trải nghiệm đầy đủ các tính năng mua sắm tuyệt vời nhất.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
          
          <div className="p-4 sm:p-4 bg-secondary/70 border-t border-border/50 relative z-10 flex flex-col sm:flex-row justify-end gap-3">
            <AlertDialogCancel className="mt-0 rounded-[14px] h-12 font-bold border-border/60 hover:bg-secondary transition-colors px-6">
              Để sau  
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => {
                setShowLoginAlert(false);
                openModal("login");
              }}
              className="rounded-[14px] h-12 font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] px-6"
            >
              Đăng nhập ngay
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {showWishlistModal && (
        <WishlistModal
          isOpen={showWishlistModal}
          onClose={() => setShowWishlistModal(false)}
          productId={productId}
          onSuccess={() => setIsWishlisted(true)}
        />
      )}
    </div>
  );
}
