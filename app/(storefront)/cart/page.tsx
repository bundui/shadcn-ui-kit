"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCart, updateCartItemQuantity, removeFromCart, getGuestCartItems, updateGuestCartQuantity, removeFromGuestCart } from "@/lib/services/cart.service";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconLoader2, IconTrash, IconMinus, IconPlus, IconShoppingCart, IconReceipt2 } from "@tabler/icons-react";
import { useAuth } from "@/components/providers/auth-provider";
import { useAuthModal } from "@/lib/store/use-auth-modal";
import { LuxeLoading } from "@/components/storefront/luxe-loading";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();
  const { openModal } = useAuthModal();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadCart = useCallback(async () => {
    setLoading(true);
    if (user) {
      const { data, error } = await getCart();
      if (!error && data) {
        setCartItems(data);
      }
    } else {
      setCartItems(getGuestCartItems());
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (!authLoading) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadCart();
    }
    const handleCartUpdate = () => {
      if (!user) {
        setCartItems(getGuestCartItems());
      }
    };
    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [user, authLoading, loadCart]);

  const handleUpdateQuantity = async (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingId(id);
    if (user) {
      const { error } = await updateCartItemQuantity(id, newQuantity);
      if (!error) {
        setCartItems(items => items.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
      }
    } else {
      updateGuestCartQuantity(id, newQuantity);
      setCartItems(getGuestCartItems());
    }
    setUpdatingId(null);
  };

  const handleRemove = async (id: string) => {
    setUpdatingId(id);
    if (user) {
      const { error } = await removeFromCart(id);
      if (!error) {
        setCartItems(items => items.filter(item => item.id !== id));
        window.dispatchEvent(new Event("cart-updated"));
      }
    } else {
      removeFromGuestCart(id);
      setCartItems(getGuestCartItems());
    }
    setUpdatingId(null);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const calculateItemPrice = (item: any) => {
    const basePrice = Number(item.products?.price || 0);
    const discount = Number(item.products?.discount_percent || 0);
    const modifier = Number(item.product_variants?.price_modifier || 0);

    const discountedBase = basePrice - (basePrice * discount / 100);
    return discountedBase + modifier;
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (calculateItemPrice(item) * item.quantity);
    }, 0);
  };

  if (authLoading || loading) {
    return <LuxeLoading label="Đang đồng bộ Giỏ hàng..." />;
  }



  if (role === "admin" || role === "staff") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-card/50 backdrop-blur-xl border border-border/50 rounded-[32px] mx-auto max-w-2xl my-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="h-24 w-24 bg-red-500/10 rounded-[24px] flex items-center justify-center mb-4 shadow-inner">
          <Image src="/icons/warning2.png" alt="Warning" width={56} height={56} className="object-contain drop-shadow-sm" />
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 relative z-10 text-center mb-3">
          Tài khoản {role === "admin" ? "Quản trị viên (Admin)" : "Nhân viên (Staff)"}
        </h2>
        <p className="text-muted-foreground text-[15px] relative z-10 text-center max-w-lg leading-relaxed mb-6">
          {role === "admin"
            ? "Tài khoản Quản trị viên (Admin) không được tạo giỏ hàng và mua sắm cá nhân để bảo đảm tính trung thực về doanh thu."
            : "Tài khoản Nhân viên (Staff) là tài khoản vận hành nội bộ, không thể tiến hành thanh toán giỏ hàng cá nhân."}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-4 w-full justify-center relative z-10">
          <Button asChild className="w-full sm:w-auto font-bold rounded-full px-8 shadow-md shadow-primary/20 h-11 transition-all hover:scale-105">
            <Link href="/dashboard">Về Dashboard</Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto rounded-full px-8 font-bold hover:bg-muted/50 h-11 transition-all border-border/50 hover:border-foreground/20">
            <Link href="/">Về Trang Chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 px-4 bg-card/50 backdrop-blur-xl border-2 border-border/50 rounded-[32px] mx-auto max-w-2xl my-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="h-25 w-25 bg-primary/10 rounded-[25px] flex items-center justify-center mb-2 shadow-inner">
          <Image src="/icons/cart1.png" alt="Empty Cart" width={64} height={64} />
        </div>
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 relative z-10">Giỏ hàng trống</h2>
        <p className="text-muted-foreground text-base relative z-10 text-center">Chưa có sản phẩm nào trong giỏ hàng của bạn.<br/>Hãy lấp đầy nó nhé!</p>
        <Button asChild size="lg" className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300 relative z-10">
          <Link href="/products">Tiếp tục mua sắm</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 ml-2">Giỏ hàng của bạn</h1>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4 mx-2">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[24px] shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="py-4">Sản phẩm</TableHead>
                  <TableHead className="hidden md:table-cell py-4">Đơn giá</TableHead>
                  <TableHead className="hidden sm:table-cell text-center py-4">Số lượng</TableHead>
                  <TableHead className="hidden sm:table-cell text-right py-4">Tạm tính</TableHead>
                  <TableHead className="hidden sm:table-cell w-[50px] py-4"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => {
                  const price = calculateItemPrice(item);
                  const isUpdating = updatingId === item.id;
                  return (
                    <TableRow key={item.id} className={`border-border/50 hover:bg-muted/30 transition-colors ${isUpdating ? "opacity-50 pointer-events-none" : ""}`}>
                      <TableCell className="p-4 sm:p-4">
                        <div className="flex gap-4">
                          <Image
                            width={96}
                            height={96}
                            unoptimized
                            src={item.products?.image_url || "https://placehold.co/100x100"}
                            alt="product"
                            className="h-20 w-20 sm:h-24 sm:w-24 rounded-[16px] object-cover border border-border/50 shadow-sm shrink-0"
                          />
                          <div className="flex flex-col flex-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-semibold text-sm md:text-base line-clamp-2">{item.products?.name}</p>
                                {item.product_variants && (
                                  <p className="text-xs md:text-sm text-muted-foreground mt-1">Phân loại: {item.product_variants.name}</p>
                                )}
                              </div>
                              {/* Mobile Delete Button */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="sm:hidden h-8 w-8 text-muted-foreground hover:text-destructive -mt-2 -mr-2 shrink-0"
                                onClick={() => handleRemove(item.id)}
                              >
                                <IconTrash className="h-4 w-4" />
                              </Button>
                            </div>

                            {/* Mobile Price and Quantity */}
                            <div className="sm:hidden mt-auto pt-4 flex items-end justify-between flex-1">
                              <div>
                                <span className="font-medium text-sm text-primary block">{formatCurrency(price)}</span>
                                {item.products?.discount_percent > 0 && (
                                  <span className="text-xs text-muted-foreground line-through block mt-0.5">
                                    {formatCurrency(Number(item.products.price))}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 border border-border/50">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-md bg-background shadow-sm hover:bg-background/80 hover:text-primary transition-colors"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                >
                                  <IconMinus className="h-3.5 w-3.5" />
                                </Button>
                                <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-md bg-background shadow-sm hover:bg-background/80 hover:text-primary transition-colors"
                                  onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                                >
                                  <IconPlus className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium">
                        <div className="flex flex-col">
                          <span>{formatCurrency(price)}</span>
                          {item.products?.discount_percent > 0 && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatCurrency(Number(item.products.price))}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="flex items-center justify-center gap-1 bg-muted/50 rounded-xl p-1 border border-border/50 w-fit mx-auto">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-background shadow-sm hover:bg-background/80 hover:text-primary shrink-0 transition-colors"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <IconMinus className="h-3.5 w-3.5" />
                          </Button>
                          <span className="w-8 sm:w-10 text-center font-bold text-sm sm:text-base">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg bg-background shadow-sm hover:bg-background/80 hover:text-primary shrink-0 transition-colors"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            <IconPlus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right font-semibold text-primary text-sm sm:text-base">
                        {formatCurrency(price * item.quantity)}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemove(item.id)}
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="md:col-span-1 mx-2">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[24px] p-6 sm:p-8 shadow-xl sticky top-28 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10 pointer-events-none" />
            <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
            <div className="space-y-4 text-sm mb-8">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Tạm tính</span>
                <span className="font-bold text-base">{formatCurrency(calculateTotal())}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Phí vận chuyển</span>
                <span className="font-medium text-muted-foreground text-xs italic">Sẽ tính ở bước sau</span>
              </div>

              <div className="border-t border-border/60 pt-6 mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-base flex items-center gap-2 text-foreground/90">
                    <IconReceipt2 className="h-5 w-5 hidden md:block lg:hidden text-primary" />
                    <span className="md:hidden lg:block">Tổng cộng</span>
                  </span>
                  <span className="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">{formatCurrency(calculateTotal())}</span>
                </div>
                <p className="text-[11px] text-muted-foreground text-right">(Đã bao gồm VAT nếu có)</p>
              </div>
            </div>

            {user ? (
              role === "admin" || role === "staff" ? (
                <div className="space-y-3">
                  <Button className="w-full h-14 text-base font-bold rounded-xl opacity-60 cursor-not-allowed shadow-md" size="lg" disabled>
                    Tiến hành thanh toán
                  </Button>
                  <p className="text-[12px] text-center text-amber-600 dark:text-amber-400 font-medium bg-amber-500/10 p-3 rounded-[14px] border border-amber-500/20">
                    * {role === "admin"
                      ? "Quản trị viên (Admin) không được tạo đơn hàng thanh toán cá nhân."
                      : "Nhân viên (Staff) vui lòng dùng tài khoản Khách hàng để thanh toán."}
                  </p>
                </div>
              ) : (
                <Button className="w-full h-14 text-base font-bold rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 hover:scale-[1.02] duration-300" size="lg" asChild>
                  <Link href="/checkout">Tiến hành thanh toán</Link>
                </Button>
              )
            ) : (
              <div className="space-y-3">
                <Button
                  className="w-full h-14 text-base font-bold rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 hover:scale-[1.02] duration-300"
                  size="lg"
                  onClick={() => openModal("login")}
                >
                  Đăng nhập để thanh toán
                </Button>
                <p className="text-[12px] text-center text-muted-foreground font-medium px-2">
                  * Vui lòng đăng nhập để hoàn tất đặt hàng. Giỏ hàng sẽ được tự động lưu.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
