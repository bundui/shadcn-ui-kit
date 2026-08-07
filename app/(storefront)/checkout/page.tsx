"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getCart } from "@/lib/services/cart.service";
import { placeOrder } from "@/lib/services/checkout.service";
import { getAddresses } from "@/lib/services/address.service";
import { supabase } from "@/lib/supabase/client";
import { validateCoupon, Coupon } from "@/lib/services/coupon.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/components/providers/auth-provider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { IconLoader2, IconCheck } from "@tabler/icons-react";
import { toast } from "sonner";
import { LuxeLoading } from "@/components/storefront/luxe-loading";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, role, loading: authLoading } = useAuth();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    paymentMethod: "cod"
  });

  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [saveNewAddress, setSaveNewAddress] = useState<boolean>(true);
  const [createdOrder, setCreatedOrder] = useState<any>(null);

  const loadAddresses = useCallback(async () => {
    const { data } = await getAddresses();
    if (data && data.length > 0) {
      setSavedAddresses(data);
      const defaultAddr = data.find((a: any) => a.is_default) || data[0];
      if (defaultAddr) {
        setSelectedAddressId(defaultAddr.id);
        setFormData(prev => ({
          ...prev,
          fullName: defaultAddr.full_name || prev.fullName,
          phone: defaultAddr.phone || "",
          street: defaultAddr.street || "",
          city: defaultAddr.city || ""
        }));
      }
    }
  }, []);

  const loadCart = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getCart();
    if (!error && data) {
      setCartItems(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setTimeout(() => {
          setFormData(prev => ({ ...prev, fullName: user.user_metadata?.full_name || "" }));
        }, 0);
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCart();
        loadAddresses();
      } else {
        router.push("/login");
      }
    }
  }, [user, authLoading, router, loadCart, loadAddresses]);

  useEffect(() => {
    window.addEventListener("cart-updated", loadCart);
    return () => {
      window.removeEventListener("cart-updated", loadCart);
    };
  }, [loadCart]);

  const getSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const basePrice = Number(item.products?.price || 0);
      const discount = Number(item.products?.discount_percent || 0);
      const modifier = Number(item.product_variants?.price_modifier || 0);
      const discountedBase = basePrice - (basePrice * discount / 100);
      return total + ((discountedBase + modifier) * item.quantity);
    }, 0);
  };

  const calculateTotal = () => {
    let total = getSubtotal();
    if (appliedCoupon) {
      total = total - (total * appliedCoupon.discount_percent / 100);
    }
    return total;
  };

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setCouponError("");
    const { data, error } = await validateCoupon(couponCodeInput);
    if (error || !data) {
      setCouponError(error?.message || "Mã không hợp lệ");
      setAppliedCoupon(null);
    } else {
      setAppliedCoupon(data);
      setCouponError("");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    if (role === "admin" || role === "staff") {
      toast.error(
        role === "admin"
          ? "Quản trị viên (Admin) không được tạo đơn hàng cá nhân để bảo đảm tính trung thực về doanh thu!"
          : "Nhân viên (Staff) không thể tạo đơn hàng bằng tài khoản nội bộ. Vui lòng dùng tài khoản Khách hàng!"
      );
      return;
    }

    // Bước 3: Validate số điện thoại Việt Nam
    const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone.trim())) {
      toast.error("Số điện thoại không hợp lệ!", {
        description: "Vui lòng nhập đúng định dạng số di động Việt Nam (10 chữ số, ví dụ 098... hoặc 039...)."
      });
      return;
    }

    setSubmitting(true);
    const { data: order, error } = await placeOrder({
      ...formData,
      couponId: appliedCoupon ? appliedCoupon.id : undefined,
      selectedAddressId: selectedAddressId || undefined,
      saveToAddressBook: !selectedAddressId ? saveNewAddress : false
    });

    if (error || !order) {
      setSubmitting(false); // Only stop loading if there's an error
      toast.error("Đặt hàng thất bại!", {
        description: error?.message || "Lỗi kết nối máy chủ"
      });
    } else {
      setCreatedOrder(order);
      if (formData.paymentMethod === "banking") {
        toast.info("Đang chuyển đến cổng thanh toán QR...", {
          description: "Vui lòng hoàn tất chuyển khoản trong 10 phút."
        });
        // Intentionally keep submitting=true to prevent UI flashes before Next.js navigation finishes
        router.push(`/checkout/payment/${order.id}`);
      } else {
        toast.success("Đặt hàng thành công!");
        setSuccess(true);
        setSubmitting(false); // Can safely set false here since the success screen handles the UI
      }
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 px-4 bg-card/50 backdrop-blur-xl border border-border/50 rounded-[32px] mx-auto max-w-2xl my-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="mx-auto w-24 h-24 bg-green-500/10 text-green-600 rounded-[24px] flex items-center justify-center mb-2 shadow-inner">
          <Image src="/icons/success.png" alt="Success" width={60} height={60} className="object-contain drop-shadow-sm" />
        </div>
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 relative z-10">Đặt hàng thành công!</h1>
        <p className="text-muted-foreground text-base relative z-10 text-center">
          Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đang được xử lý.
        </p>
        <div className=" relative z-10">
          <Button asChild size="lg" className="rounded-xl px-8 font-bold shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300">
            <Link href="/account/orders">Quản lý Đơn hàng </Link>
          </Button>
        </div>
      </div>
    );
  }

  if ((authLoading || loading) && !submitting) {
    return <LuxeLoading label="Đang chuẩn bị thông tin thanh toán..." />;
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
            ? "Tài khoản Quản trị viên (Admin) không được tạo đơn hàng và thanh toán cá nhân để bảo đảm tính trung thực cho các báo cáo doanh thu."
            : "Tài khoản Nhân viên (Staff) là tài khoản vận hành nội bộ, không thể tiến hành thanh toán."}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-4 w-full justify-center relative z-10">
          <Button asChild className="w-full sm:w-auto font-bold rounded-full px-8 shadow-md shadow-primary/20 h-11 transition-all hover:scale-105">
            <Link href="/dashboard">Về Dashboard Quản Trị</Link>
          </Button>
          <Button variant="outline" asChild className="w-full sm:w-auto rounded-full px-8 font-bold hover:bg-muted/50 h-11 transition-all border-border/50 hover:border-foreground/20">
            <Link href="/">Về Trang Chủ</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !submitting) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-6 px-4 bg-card/50 backdrop-blur-xl border border-border/50 rounded-[32px] mx-auto max-w-2xl my-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 relative z-10">Giỏ hàng trống</h1>
        <Button asChild size="lg" className="rounded-xl px-8 font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300 relative z-10">
          <Link href="/cart">Quay lại Giỏ hàng</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 ml-2">Thanh toán</h1>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12 mx-2">
        <div className="space-y-8">
          {/* Thông tin giao hàng */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10 pointer-events-none" />
            <h2 className="text-xl font-bold border-b border-border/50 pb-4">Thông tin nhận hàng</h2>

            {savedAddresses.length > 0 && (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-3">
                <Label className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
                  ★ Chọn nhanh từ Sổ địa chỉ đã lưu:
                </Label>
                <Select
                  value={selectedAddressId || "new"}
                  onValueChange={(val) => {
                    if (val === "new") {
                      setSelectedAddressId("");
                      setFormData(prev => ({
                        ...prev,
                        phone: "",
                        street: "",
                        city: ""
                      }));
                    } else {
                      setSelectedAddressId(val);
                      const addr = savedAddresses.find(a => a.id === val);
                      if (addr) {
                        setFormData(prev => ({
                          ...prev,
                          fullName: addr.full_name || prev.fullName,
                          phone: addr.phone || "",
                          street: addr.street || "",
                          city: addr.city || ""
                        }));
                      }
                    }
                  }}
                >
                  <SelectTrigger className="w-full h-11 px-4 rounded-[14px] border border-input bg-background text-sm focus:ring-2 focus:ring-primary outline-none cursor-pointer text-foreground shadow-sm">
                    <SelectValue placeholder="-- Tự nhập địa chỉ mới bên dưới --" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="new">-- Tự nhập địa chỉ mới bên dưới --</SelectItem>
                    {savedAddresses.map(addr => (
                      <SelectItem key={addr.id} value={addr.id} className="cursor-pointer">
                        <div className="flex items-center gap-2">
                          {addr.type === 'home' && <span className="flex items-center gap-1 text-[10px] bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300 font-bold px-2 py-0.5 rounded-full"><Image src="/icons/home1.png" alt="Home" width={12} height={12} /> Nhà riêng</span>}
                          {addr.type === 'office' && <span className="flex items-center gap-1 text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full"><Image src="/icons/office.png" alt="Office" width={12} height={12} /> Văn phòng</span>}
                          {addr.type === 'other' && <span className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 font-bold px-2 py-0.5 rounded-full"><Image src="/icons/pin.png" alt="Other" width={12} height={12} /> Khác</span>}
                          <span className="truncate">{addr.full_name} ({addr.phone}) - {addr.street}, {addr.city} {addr.is_default ? " [Mặc định]" : ""}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName" className="font-semibold">Họ và Tên</Label>
              <Input
                id="fullName"
                required
                className="h-11 rounded-[14px] bg-background/50 focus:bg-background transition-colors"
                value={formData.fullName}
                onChange={e => setFormData({ ...formData, fullName: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="font-semibold">Số điện thoại</Label>
              <Input
                id="phone"
                required
                type="tel"
                className="h-11 rounded-[14px] bg-background/50 focus:bg-background transition-colors"
                value={formData.phone}
                onChange={e => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="city" className="font-semibold">Tỉnh / Thành phố</Label>
                <Input
                  id="city"
                  required
                  className="h-11 rounded-[14px] bg-background/50 focus:bg-background transition-colors"
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label htmlFor="street" className="font-semibold">Địa chỉ cụ thể</Label>
                <Input
                  id="street"
                  required
                  className="h-11 rounded-[14px] bg-background/50 focus:bg-background transition-colors"
                  value={formData.street}
                  onChange={e => setFormData({ ...formData, street: e.target.value })}
                />
              </div>
            </div>

            {!selectedAddressId && (
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <input
                  type="checkbox"
                  id="saveNewAddr"
                  checked={saveNewAddress}
                  onChange={e => setSaveNewAddress(e.target.checked)}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-primary cursor-pointer accent-primary"
                />
                <Label htmlFor="saveNewAddr" className="text-sm cursor-pointer text-muted-foreground font-medium">
                  Lưu địa chỉ mới này vào Sổ địa chỉ để mua sắm nhanh hơn lần sau
                </Label>
              </div>
            )}
          </div>

          {/* Phương thức thanh toán */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[24px] p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold border-b border-border/50 pb-4">Phương thức thanh toán</h2>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={v => setFormData({ ...formData, paymentMethod: v })}
              className="space-y-4"
            >
              <div
                className={`relative flex items-center space-x-3 border-2 p-4 rounded-[16px] transition-all duration-200 ${formData.paymentMethod === 'cod' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:bg-muted/50 hover:border-border'}`}
              >
                <RadioGroupItem value="cod" id="cod" className="mt-0.5 relative z-10" />
                <Label htmlFor="cod" className="cursor-pointer font-bold flex-1 text-[14.5px] after:absolute after:inset-0">
                  Thanh toán khi nhận hàng (COD)
                </Label>
              </div>
              <div
                className={`relative flex items-center space-x-3 border-2 p-4 rounded-[16px] transition-all duration-200 ${formData.paymentMethod === 'banking' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50 hover:bg-muted/50 hover:border-border'}`}
              >
                <RadioGroupItem value="banking" id="banking" className="mt-0.5 relative z-10" />
                <Label htmlFor="banking" className="cursor-pointer font-bold flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[14.5px] after:absolute after:inset-0">
                  <span>Chuyển khoản ngân hàng</span>
                  <span className="text-[11px] bg-primary/10 text-primary px-2.5 py-1 rounded-full font-bold shadow-sm w-fit relative z-10">Quét QR tự động</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div>
          {/* Tóm tắt đơn hàng */}
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[24px] p-6 sm:p-8 shadow-xl sticky top-28 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10 pointer-events-none" />
            <h2 className="text-xl font-bold mb-6">Đơn hàng của bạn</h2>

            <div className="space-y-4 max-h-[300px]  pr-2 mb-6 scrollbar-thin scrollbar-thumb-primary/10">
              {cartItems.map((item) => {
                const basePrice = Number(item.products?.price || 0);
                const discount = Number(item.products?.discount_percent || 0);
                const modifier = Number(item.product_variants?.price_modifier || 0);
                const price = basePrice - (basePrice * discount / 100) + modifier;

                return (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex gap-4">
                      <div className="relative shrink-0">
                        <Image
                          width={48}
                          height={48}
                          unoptimized
                          src={item.products?.image_url || "https://placehold.co/48x48"}
                          alt="img"
                          className="h-14 w-14 rounded-[12px] border border-border/50 object-cover shadow-sm"
                        />
                        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground font-bold shadow-sm">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-bold line-clamp-1 max-w-[150px]">{item.products?.name}</span>
                        {item.product_variants && <span className="text-xs text-muted-foreground mt-0.5">{item.product_variants.name}</span>}
                      </div>
                    </div>
                    <span className="font-bold self-center text-[14.5px]">{formatCurrency(price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            {/* Mã giảm giá */}
            <div className="mb-8 border-t border-border/50 pt-6">
              <Label htmlFor="coupon" className="mb-2 block font-semibold text-[13px] uppercase tracking-wider text-muted-foreground/80">Mã giảm giá</Label>
              <div className="flex gap-2">
                <Input
                  id="coupon"
                  placeholder="Nhập mã giảm giá..."
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                  className="h-11 rounded-[14px] bg-background/50 focus:bg-background"
                />
                {!appliedCoupon ? (
                  <Button type="button" variant="secondary" onClick={handleApplyCoupon} className="h-11 rounded-[14px] font-bold px-6 border border-border/50 hover:bg-muted">Áp dụng</Button>
                ) : (
                  <Button type="button" variant="destructive" onClick={handleRemoveCoupon} className="h-11 rounded-[14px] font-bold px-6">Hủy</Button>
                )}
              </div>
              {couponError && <p className="text-red-500 text-xs mt-2 font-medium pl-1">{couponError}</p>}
              {appliedCoupon && (
                <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-xl p-3 flex items-center gap-2">
                  <IconCheck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-green-600 text-sm font-bold">Đã áp dụng mã giảm {appliedCoupon.discount_percent}%</p>
                    <p className="text-green-600/80 text-xs font-medium mt-0.5">Tiết kiệm được {formatCurrency(getSubtotal() * appliedCoupon.discount_percent / 100)}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4 text-sm mb-8 border-t border-border/50 pt-6">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Tạm tính</span>
                <span className="font-bold text-base">{formatCurrency(getSubtotal())}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between items-center text-green-600">
                  <span className="font-medium">Giảm giá ({appliedCoupon.code})</span>
                  <span className="font-bold">-{formatCurrency(getSubtotal() * appliedCoupon.discount_percent / 100)}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Phí vận chuyển</span>
                <span className="font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md text-[11px] uppercase tracking-wide">Miễn phí</span>
              </div>

              <div className="border-t border-border/60 pt-6 mt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-base text-foreground/90">Tổng cộng</span>
                  <span className="text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">{formatCurrency(calculateTotal())}</span>
                </div>
              </div>
            </div>

            {role === "admin" || role === "staff" ? (
              <div className="space-y-3">
                <Button type="button" className="w-full h-14 text-base font-bold rounded-xl opacity-60 cursor-not-allowed shadow-md" size="lg" disabled>
                  Hoàn tất đặt hàng
                </Button>
                <p className="text-[12px] text-center text-amber-600 dark:text-amber-400 font-medium bg-amber-500/10 p-3 rounded-[14px] border border-amber-500/20">
                  * {role === "admin"
                    ? "Quản trị viên (Admin) không được tạo đơn hàng thanh toán cá nhân."
                    : "Nhân viên (Staff) vui lòng dùng tài khoản Khách hàng để thanh toán."}
                </p>
              </div>
            ) : (
              <Button type="submit" className="w-full h-14 text-base font-bold rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20 hover:scale-[1.02] duration-300" size="lg" disabled={submitting}>
                {submitting ? <IconLoader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {submitting ? "Đang xử lý..." : "Đặt hàng ngay"}
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
