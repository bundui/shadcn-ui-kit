"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { ArrowRight, Package } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getMyOrders } from "@/lib/services/order.service";
import { getWishlist } from "@/lib/services/wishlist.service";
import { getAddresses } from "@/lib/services/address.service";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" },
  paid: { label: "Đã thanh toán", color: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800 hover:bg-blue-100" },
  shipped: { label: "Đang giao", color: "bg-indigo-100 text-indigo-800 hover:bg-indigo-100" },
  delivered: { label: "Đã giao", color: "bg-green-100 text-green-800 hover:bg-green-100" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800 hover:bg-red-100" },
};

export default function AccountOverviewPage() {
  const { profile, user } = useAuth();
  
  const [stats, setStats] = useState({
    ordersCount: 0,
    wishlistCount: 0,
    addressCount: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        getMyOrders(),
        getWishlist(),
        getAddresses()
      ]).then(([ordersRes, wishlistRes, addressRes]) => {
        setStats({
          ordersCount: ordersRes.data?.length || 0,
          wishlistCount: wishlistRes.data?.length || 0,
          addressCount: addressRes.data?.length || 0,
        });
        
        if (ordersRes.data) {
          setRecentOrders(ordersRes.data.slice(0, 3));
        }
        setLoading(false);
      });
    }
  }, [user]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  return (
    <div className="space-y-8 pb-10 mt-2 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tổng quan tài khoản</h1>
        <p className="text-muted-foreground mt-1.5 text-sm sm:text-base">Quản lý mọi hoạt động mua sắm của bạn tại đây.</p>
      </div>
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-card/60 backdrop-blur-xl p-8 rounded-[24px] border border-border/50 shadow-sm group">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-medium text-foreground">
            Xin chào, <span className="font-bold text-primary">{profile?.full_name || user?.email?.split('@')[0]}</span>! 👋
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl leading-relaxed text-[15px]">
            Chào mừng bạn trở lại. Từ bảng điều khiển này, bạn có thể dễ dàng kiểm tra lịch sử mua hàng, quản lý địa chỉ giao nhận và cập nhật thông tin bảo mật của mình.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/account/orders" className="group relative bg-card/40 backdrop-blur-md rounded-[24px] border border-border/50 p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl hover:bg-card/80 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
            <Image src="/icons/cart.png" alt="Đơn hàng" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="font-bold text-[17px] text-foreground group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Đơn hàng</h3>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">
            {loading ? "Đang tải..." : `${stats.ordersCount} đơn hàng`}
          </p>
        </Link>

        <Link href="/account/wishlist" className="group relative bg-card/40 backdrop-blur-md rounded-[24px] border border-border/50 p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl hover:bg-card/80 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-pink-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-pink-50 dark:bg-pink-900/20 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-[-3deg] transition-transform duration-500 shadow-inner">
            <Image src="/icons/love.png" alt="Yêu thích" width={32} height={32} className="object-contain drop-shadow-sm" />
          </div>
          <h3 className="font-bold text-[17px] text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Yêu thích</h3>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">
            {loading ? "Đang tải..." : `${stats.wishlistCount} sản phẩm`}
          </p>
        </Link>

        <Link href="/account/addresses" className="group relative bg-card/40 backdrop-blur-md rounded-[24px] border border-border/50 p-6 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-xl hover:bg-card/80 hover:-translate-y-1 transition-all duration-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-inner">
            <Image src="/icons/location.png" alt="Địa chỉ" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="font-bold text-[17px] text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">Địa chỉ</h3>
          <p className="text-sm text-muted-foreground mt-1.5 font-medium">
            {loading ? "Đang tải..." : `${stats.addressCount} địa chỉ đã lưu`}
          </p>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="pt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold tracking-tight">Đơn hàng gần đây</h2>
          <Link href="/account/orders" className="text-[14px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center bg-primary/10 px-4 py-1.5 rounded-full">
            Xem tất cả <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </div>
        
        {loading ? (
          <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[24px] p-10 text-center flex flex-col items-center justify-center">
             <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
             <p className="text-muted-foreground font-medium">Đang tải dữ liệu đơn hàng...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-[24px] p-12 text-center flex flex-col items-center justify-center">
            <div className="size-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
              <Package className="size-10 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-bold text-foreground">Chưa có đơn hàng</h3>
            <p className="text-muted-foreground mt-1 mb-6 text-[15px]">Bạn chưa thực hiện giao dịch nào.</p>
            <Button asChild className="rounded-full px-8 shadow-md">
              <Link href="/products">Mua sắm ngay</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentOrders.map(order => (
              <Link href={`/account/orders`} key={order.id} className="block group">
                <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[20px] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group-hover:border-primary/50 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <Package className="size-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-[15px] text-foreground">
                        Đơn hàng <span className="font-mono text-primary ml-1">#{order.id.split('-')[0].toUpperCase()}</span>
                      </p>
                      <p className="text-[13.5px] text-muted-foreground mt-1">
                        Đặt ngày {format(new Date(order.created_at), "dd MMMM, yyyy", { locale: vi })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto mt-2 md:mt-0 pl-16 md:pl-0">
                    <div className="text-left md:text-right">
                      <p className="text-[13px] text-muted-foreground mb-1">Tổng tiền</p>
                      <span className="font-bold text-[16px] text-foreground">{formatCurrency(order.total_amount)}</span>
                    </div>
                    <Badge variant="secondary" className={cn("px-3 py-1 rounded-full border-0 font-medium whitespace-nowrap", STATUS_MAP[order.status]?.color || "")}>
                      {STATUS_MAP[order.status]?.label || order.status}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
