"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { getMyOrders, updateOrderStatus } from "@/lib/services/order.service";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/components/providers/auth-provider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { IconLoader2, IconPackage, IconX } from "@tabler/icons-react";
import { LuxeLoading } from "@/components/storefront/luxe-loading";
import { Clock, Package, PackageCheck, MapPinned, Truck, CheckCircle2, CircleCheckBig, AlertTriangle, CreditCard, Star, Search, SearchX, Calendar, RotateCcw, Filter, CheckCheck, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductReviewModal, ReviewItemData } from "@/components/storefront/product-review-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { toast } from "sonner";

function OrderCountdown({ createdAt }: { createdAt: string }) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const createdTime = new Date(createdAt).getTime();
      const expirationTime = createdTime + 24 * 60 * 60 * 1000;
      const now = new Date().getTime();
      const difference = expirationTime - now;

      if (difference <= 0) {
        setTimeLeft("Đã quá hạn");
        return;
      }

      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [createdAt]);

  if (!timeLeft) return null;

  return (
    <span className="text-[12px] text-gray-400 font-bold tracking-wider flex items-center justify-center gap-1  px-3 py-1.5 rounded-full border border-rose-500 shadow-sm ">
      <Clock className="w-3 h-3 animate-pulse" /> Còn lại: <span className="text-red-500">{timeLeft}</span>
    </span>
  );
}

function OrderTimeline({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 py-2 px-4 sm:px-6 bg-rose-500 dark:border-b-2  dark:border-white text-white text-xs font-bold">
        <Image src="/icons/cancel_order.png" alt="ic-cancel" width={30} height={30} />
        <span>Đơn hàng này đã bị hủy.</span>
      </div>
    );
  }

  const steps = [
    { key: "pending", label: "Chờ xử lý", icon: Clock },
    { key: "paid", label: "Đã xác nhận", icon: PackageCheck },
    { key: "shipping", label: "Đang giao", icon: Truck },
    { key: "delivered", label: "Đã giao", icon: MapPinned },
    { key: "completed", label: "Đã nhận hàng", icon: CircleCheckBig },
  ];

  // Chuẩn hóa trạng thái (đồng bộ hoàn toàn với danh sách trạng thái trong Admin)
  const normalized = status === "processing" ? "paid" : status === "shipped" ? "shipping" : status;
  const currentStepIndex = steps.findIndex((s) => s.key === normalized);
  const activeIndex = currentStepIndex === -1 ? 0 : currentStepIndex;

  return (
    <>
      {/* Mobile view (< 640px): Compact Stepper with exact dot alignment */}
      <div className="flex sm:hidden flex-col gap-3.5 py-4 px-4 border-b border-border/50 bg-muted/10">
        <div className="flex items-center justify-between text-xs font-semibold px-1">
          <div className="flex items-center gap-2.5 text-primary">
            {(() => {
              const CurrentIcon = steps[activeIndex]?.icon || Clock;
              return <CurrentIcon className="size-4.5 text-primary shrink-0" />;
            })()}
            <span className="text-foreground font-bold tracking-tight">
              Bước {activeIndex + 1}/{steps.length}: <span className="text-primary">{steps[activeIndex]?.label}</span>
            </span>
          </div>
          <span className="text-[10px] uppercase font-extrabold tracking-wider text-muted-foreground shrink-0 bg-muted px-2 py-1 rounded-md">
            {activeIndex === steps.length - 1 ? "Hoàn tất" : "Đang tiến hành"}
          </span>
        </div>

        {/* Unified Step Track: Connecting line stops EXACTLY at the center of the active dot */}
        <div className="relative flex items-center justify-between w-full px-2 py-1.5 mt-1">
          {/* Background line connecting center of first dot to center of last dot */}
          <div className="absolute top-1/2 -translate-y-1/2 left-[16px] right-[16px] h-[3px] bg-border/60 -z-0 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 ease-out rounded-full shadow-[0_0_8px_rgba(var(--primary),0.5)]"
              style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {/* 5 mini dots directly positioned on the track line */}
          {steps.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            return (
              <div
                key={step.key}
                className="relative z-10 flex flex-col items-center justify-center"
              >
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center transition-all duration-500 ease-out ${isCompleted
                    ? "bg-primary text-primary-foreground shadow-[0_0_10px_rgba(0,0,0,0.1)] scale-110"
                    : isCurrent
                      ? "bg-background border-2 border-primary ring-4 ring-primary/20 shadow-md scale-125"
                      : "bg-muted border border-border/80"
                    }`}
                >
                  {isCompleted && <Check className="size-2.5 stroke-[3]" />}
                  {isCurrent && <div className="size-1.5 rounded-full bg-primary animate-pulse" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop & Tablet view (>= 640px): Horizontal Circles Timeline */}
      <div className="hidden sm:block py-5 px-4 md:px-8 border-b border-border/50 bg-gradient-to-b from-muted/5 to-transparent overflow-hidden">
        <div className="relative flex items-start justify-between w-full max-w-2xl mx-auto">
          {/* Connecting line stopping EXACTLY at center of circle (w-9 = 36px -> center at 18px) */}
          <div className="absolute top-[17px] left-[45px] right-[45px] h-[3px] bg-border/60 -z-0 rounded-full">
            <div
              className="h-full bg-gradient-to-r from-primary to-primary/80 transition-all duration-700 ease-out shadow-[0_0_8px_rgba(var(--primary),0.4)] rounded-full"
              style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
            />
          </div>

          {steps.map((step, idx) => {
            const isCompleted = idx < activeIndex;
            const isCurrent = idx === activeIndex;
            const StepIcon = step.icon;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center flex-1 max-w-[100px]">
                <div
                  className={`size-9 rounded-full flex items-center justify-center border transition-all duration-500 ease-out shrink-0 ${isCompleted
                    ? "bg-primary border-primary text-primary-foreground shadow-md scale-110"
                    : isCurrent
                      ? "bg-background border-[2.5px] border-primary text-primary ring-[5px] ring-primary/15 font-bold shadow-lg scale-125"
                      : "bg-muted border-border/80 text-muted-foreground/70"
                    }`}
                >
                  <StepIcon className={`size-4 ${isCompleted ? 'stroke-[2.5]' : isCurrent ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                <span
                  className={`mt-3 text-[11px] sm:text-xs text-center transition-colors duration-500 leading-tight break-words px-0.5 ${isCurrent
                    ? "text-primary font-extrabold tracking-tight"
                    : isCompleted
                      ? "text-foreground font-semibold"
                      : "text-muted-foreground font-medium"
                    }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  paid: { label: "Đã thanh toán", color: "bg-blue-100 text-blue-800 border-blue-200" },
  processing: { label: "Đang xử lý", color: "bg-blue-100 text-blue-800 border-blue-200" },
  shipping: { label: "Đang giao", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  shipped: { label: "Đang giao", color: "bg-indigo-100 text-indigo-800 border-indigo-200" },
  delivered: { label: "Chờ xác nhận", color: "bg-cyan-100 text-cyan-800 border-cyan-200" },
  completed: { label: "Đã nhận hàng", color: "bg-green-100 text-green-800 border-green-200" },
  cancelled: { label: "Đã hủy", color: "bg-red-100 text-red-800 border-red-200" },
};

const STATUS_GROUPS: Record<string, string[]> = {
  pending: ["pending", "processing", "paid"],
  shipping: ["shipping", "shipped"],
  delivered: ["delivered"],
  completed: ["completed"],
  cancelled: ["cancelled"],
};

const TIME_RANGE_DAYS: Record<string, number> = {
  "30days": 30,
  "90days": 90,
  "180days": 180,
};

const matchStatus = (orderStatus: string, filterKey: string): boolean => {
  if (filterKey === "all") return true;
  return (STATUS_GROUPS[filterKey] || [filterKey]).includes(orderStatus);
};

const matchTimeRange = (createdAt: string, filterKey: string, currentTime: number): boolean => {
  if (filterKey === "all" || !TIME_RANGE_DAYS[filterKey]) return true;
  return new Date(createdAt).getTime() >= currentTime - TIME_RANGE_DAYS[filterKey] * 24 * 60 * 60 * 1000;
};

const matchSearchQuery = (order: any, query: string): boolean => {
  if (!query) return true;
  const q = query.toLowerCase();
  const shortId = order.id.split("-")[0].toLowerCase();

  if (order.id.toLowerCase().includes(q) || shortId.includes(q) || `#${shortId}`.includes(q)) return true;

  const paymentObj = Array.isArray(order.payments) ? order.payments[0] : order.payments;
  if (paymentObj?.payment_code?.toLowerCase().includes(q)) return true;

  return Boolean(
    order.order_items?.some((item: any) =>
      (item.products?.name?.toLowerCase() || "").includes(q) ||
      (item.product_variants?.name?.toLowerCase() || "").includes(q)
    )
  );
};

export default function MyOrdersPage() {
  const { user, role } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("all");
  const [currentTime] = useState(() => Date.now());

  // Modal state
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  // Confirm receive state
  const [confirmReceiveModalOpen, setConfirmReceiveModalOpen] = useState(false);
  const [orderToReceive, setOrderToReceive] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  // Review modal state
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [itemToReview, setItemToReview] = useState<ReviewItemData | null>(null);
  const [reviewedProductIds, setReviewedProductIds] = useState<Set<string>>(new Set());

  const handleConfirmReceivedOrder = async () => {
    if (!orderToReceive) return;
    setConfirmingId(orderToReceive);
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: "completed" })
        .eq("id", orderToReceive)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast.success("Đã xác nhận nhận được hàng. Cảm ơn quý khách đã mua sắm!");

      setOrders(prev =>
        prev.map(o => (o.id === orderToReceive ? { ...o, status: "completed" } : o))
      );
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        new BroadcastChannel("admin_orders_channel").postMessage({
          type: "ORDER_UPDATED",
          id: orderToReceive,
          status: "completed",
        });
      }

      // Tự động mở popup đánh giá sản phẩm sau khi xác nhận đã nhận hàng
      const confirmedOrder = orders.find(o => o.id === orderToReceive);
      if (confirmedOrder?.order_items && confirmedOrder.order_items.length > 0) {
        const unreviewedItem = confirmedOrder.order_items.find((item: any) => {
          const pid = item.product_id || item.products?.id;
          return pid && !reviewedProductIds.has(pid);
        }) || confirmedOrder.order_items[0];

        const pid = unreviewedItem.product_id || unreviewedItem.products?.id;
        if (pid && orderToReceive) {
          const targetOrderId = orderToReceive;
          setTimeout(() => {
            setItemToReview({
              productId: pid,
              productName: unreviewedItem.products?.name || "Sản phẩm",
              productImage: unreviewedItem.products?.image_url,
              variantName: unreviewedItem.product_variants?.name,
              price: unreviewedItem.price,
              orderId: targetOrderId
            });
            setReviewModalOpen(true);
          }, 350);
        }
      }
    } catch (err: any) {
      console.error("Lỗi xác nhận nhận hàng:", err);
      toast.error(err.message || "Không thể xác nhận nhận hàng. Vui lòng thử lại sau.");
    } finally {
      setConfirmingId(null);
      setOrderToReceive(null);
      setConfirmReceiveModalOpen(false);
    }
  };

  // Filtered orders using declarative helper predicates (No nested if/else ladders)
  const filteredOrders = useMemo(() => {
    const trimmedQuery = searchQuery.trim();
    return orders.filter(
      (order) =>
        matchStatus(order.status, selectedStatus) &&
        matchTimeRange(order.created_at, selectedTimeRange, currentTime) &&
        matchSearchQuery(order, trimmedQuery)
    );
  }, [orders, selectedStatus, selectedTimeRange, searchQuery, currentTime]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0, pending: 0, shipping: 0, delivered: 0, completed: 0, cancelled: 0 };
    const trimmedQuery = searchQuery.trim();

    orders.forEach((order) => {
      if (!matchTimeRange(order.created_at, selectedTimeRange, currentTime) || !matchSearchQuery(order, trimmedQuery)) {
        return;
      }
      counts.all++;
      for (const [groupKey, statuses] of Object.entries(STATUS_GROUPS)) {
        if (statuses.includes(order.status)) {
          counts[groupKey] = (counts[groupKey] || 0) + 1;
          break;
        }
      }
    });
    return counts;
  }, [orders, selectedTimeRange, searchQuery, currentTime]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus("all");
    setSelectedTimeRange("all");
  };

  const fetchOrders = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setTimeout(() => setLoading(true), 0);
    }
    const { data, error } = await getMyOrders();
    if (!error && data) {
      setOrders(data);
    }

    if (user?.id) {
      const { data: myReviews } = await supabase
        .from("product_reviews")
        .select("product_id")
        .eq("user_id", user.id);
      if (myReviews) {
        setReviewedProductIds(new Set(myReviews.map((r) => r.product_id)));
      }
    }

    if (showLoading) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    } else {
      setTimeout(() => {
        fetchOrders(true);
      }, 0);

      // 1. Đồng bộ qua BroadcastChannel (khi Admin mở cùng trình duyệt cập nhật trạng thái)
      let bc: BroadcastChannel | null = null;
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        bc = new BroadcastChannel("admin_orders_channel");
        bc.onmessage = (event) => {
          if (event.data?.type === "ORDER_UPDATED") {
            fetchOrders(false);
          }
        };
      }

      // 2. Đồng bộ Realtime trực tiếp từ Supabase Postgres
      const channel = supabase
        .channel(`customer-orders-${user.id}`)
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "orders", filter: `user_id=eq.${user.id}` },
          () => {
            fetchOrders(false);
          }
        )
        .subscribe();

      // 3. Tự động làm mới ngầm khi người dùng quay lại tab (focus) mà không reload UI
      const handleFocus = () => fetchOrders(false);
      window.addEventListener("focus", handleFocus);

      return () => {
        if (bc) bc.close();
        supabase.removeChannel(channel);
        window.removeEventListener("focus", handleFocus);
      };
    }
  }, [user, router, fetchOrders]);

  const confirmCancel = (id: string) => {
    setOrderToCancel(id);
    setCancelModalOpen(true);
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;
    const id = orderToCancel;

    setCancellingId(id);
    const { error } = await updateOrderStatus(id, "cancelled");
    setCancellingId(null);
    setOrderToCancel(null);

    if (error) {
      toast.error("Lỗi khi hủy đơn hàng: " + error.message);
    } else {
      toast.success("Đã hủy đơn hàng thành công");
      setOrders(orders.map(o => o.id === id ? { ...o, status: "cancelled" } : o));
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(val);
  };

  if (loading) {
    return <LuxeLoading label="Đang truy xuất Đơn hàng của bạn..." />;
  }

  if (role === "admin" || role === "staff") {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-card/50 backdrop-blur-xl border border-border/50 rounded-[32px] mx-auto max-w-2xl my-10 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
        <div className="h-24 w-24 bg-primary/10 rounded-[24px] flex items-center justify-center mb-4 shadow-inner">
          <Image src="/icons/infor.png" alt="Info" width={56} height={56} className="object-contain drop-shadow-sm" />
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 relative z-10 text-center mb-3">
          Tài khoản {role === "admin" ? "Quản trị viên (Admin)" : "Nhân viên (Staff)"}
        </h2>
        <p className="text-muted-foreground text-[15px] relative z-10 text-center max-w-lg leading-relaxed mb-6">
          {role === "admin"
            ? "Tài khoản Quản trị viên (Admin) không có lịch sử đơn hàng cá nhân để đảm bảo tính trung thực về dữ liệu kinh doanh."
            : "Tài khoản Nhân viên (Staff) là tài khoản vận hành nội bộ, không sử dụng để đặt hàng mua sắm."}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row gap-4 w-full justify-center relative z-10">
          <Button onClick={() => router.push("/dashboard/orders")} className="w-full sm:w-auto font-bold rounded-full px-8 shadow-md shadow-primary/20 h-11 transition-all hover:scale-105">
            Quản lý Đơn hàng
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full sm:w-auto rounded-full px-8 font-bold hover:bg-muted/50 h-11 transition-all border-border/50 hover:border-foreground/20">
            Về Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto py-20 text-center space-y-4 min-h-[50vh] flex flex-col items-center justify-center px-4">
        <IconPackage className="h-16 w-16 text-muted-foreground/50 mx-auto" />
        <h2 className="text-2xl font-bold">Chưa có đơn hàng nào</h2>
        <p className="text-muted-foreground">Bạn chưa thực hiện bất kỳ đơn đặt hàng nào.</p>
        <Button onClick={() => router.push("/products")} className="mt-4">
          Bắt đầu mua sắm
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 md:px-0">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Lịch sử Mua hàng</h1>

      {/* Search & Filter Header (Redesigned) */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col gap-4 bg-card/60 backdrop-blur-xl p-3 sm:p-4 rounded-[24px] border border-border/50 shadow-sm">
          
          {/* Status Segmented Control */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none w-full mask-fade-right">
            {[
              { key: "all", label: "Tất cả", icon: Package },
              { key: "pending", label: "Chờ xử lý", icon: Clock },
              { key: "shipping", label: "Đang giao", icon: Truck },
              { key: "delivered", label: "Chờ xác nhận", icon: CheckCircle2 },
              { key: "completed", label: "Đã nhận hàng", icon: CheckCheck },
              { key: "cancelled", label: "Đã hủy", icon: AlertTriangle },
            ].map((tab) => {
              const isActive = selectedStatus === tab.key;
              const count = statusCounts[tab.key] || 0;
              const TabIcon = tab.icon;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setSelectedStatus(tab.key)}
                  className={`relative flex items-center gap-2 px-4 py-2 m-1 rounded-[14px] text-[13px] font-semibold transition-all duration-300 shrink-0 ${
                    isActive
                      ? "bg-background shadow-sm text-foreground ring-1 ring-border/80"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <TabIcon className={`size-4 ${isActive ? "text-primary" : ""}`} />
                  <span>{tab.label}</span>
                  <span
                    className={`ml-1 px-2 py-0.5 text-[10px] rounded-md font-bold transition-colors ${
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="w-full h-px bg-border/50" />

          {/* Search & Time Range */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full">
            {/* Search Box */}
            <div className="relative flex-1 sm:min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Tìm mã đơn, mã thanh toán..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-10 text-[13px] bg-background/50 border-border/60 hover:bg-background focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary rounded-xl w-full transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted"
                  title="Xóa từ khóa"
                >
                  <IconX className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {/* Time Range Selector */}
              <div className="flex items-center gap-1.5 bg-muted/40 p-1.5 rounded-xl border border-border/40 overflow-x-auto scrollbar-none">
                {[
                  { key: "all", label: "Tất cả" },
                  { key: "30days", label: "30 ngày" },
                  { key: "90days", label: "3 tháng" },
                  { key: "180days", label: "6 tháng" },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setSelectedTimeRange(t.key)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all shrink-0 ${
                      selectedTimeRange === t.key
                        ? "bg-background text-foreground shadow-sm ring-1 ring-border/50"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {(searchQuery || selectedStatus !== "all" || selectedTimeRange !== "all") && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={resetFilters}
                  className="h-10 w-10 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 rounded-xl shrink-0 transition-colors"
                  title="Xóa bộ lọc"
                >
                  <RotateCcw className="size-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filtered Orders List or Empty State */}
      {filteredOrders.length === 0 ? (
        <div className="bg-card/40 border border-dashed rounded-2xl py-16 px-4 text-center flex flex-col items-center justify-center space-y-3 my-4 animate-in fade-in duration-300">
          <div className="size-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
            <SearchX className="size-6" />
          </div>
          <h3 className="text-base font-semibold text-foreground">Không tìm thấy đơn hàng phù hợp</h3>
          <p className="text-xs text-muted-foreground max-w-sm">
            Không có đơn hàng nào khớp với bộ lọc trạng thái, khoảng thời gian hoặc từ khóa tìm kiếm của bạn.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="mt-2 text-xs h-8 px-4 font-medium"
          >
            <RotateCcw className="size-3.5 mr-1.5" />
            Xóa bộ lọc & xem tất cả ({orders.length} đơn)
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map(order => {
            const paymentObj = Array.isArray(order.payments) ? (order.payments.length > 0 ? order.payments[0] : null) : order.payments;
            const isBanking = order.payment_method === "banking" || (order.payment_method !== "cod" && !!paymentObj);
            const payStatus = paymentObj?.status;

            return (
              <Card key={order.id} className="overflow-hidden gap-0 border-0 rounded-2xl shadow-sm hover:shadow-md transition-shadow bg-card/60 backdrop-blur-xl ring-1 ring-border/50">
                <CardHeader className="bg-gradient-to-r from-muted/30 to-muted/10 py-4 px-5 sm:px-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base sm:text-lg font-mono font-extrabold text-foreground tracking-tight">
                        #{order.id.split('-')[0].toUpperCase()}
                      </CardTitle>
                      <Badge variant="outline" className={`text-[11px] px-2 py-0.5 font-bold uppercase tracking-wider border-0 shadow-sm ${STATUS_MAP[order.status]?.color || "bg-gray-100 text-gray-800"}`}>
                        {STATUS_MAP[order.status]?.label || order.status}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-3.5" />
                      Ngày đặt: {format(new Date(order.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                    </CardDescription>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto p-3 sm:p-0 bg-background/50 sm:bg-transparent rounded-xl sm:rounded-none border sm:border-0 border-border/50">
                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between w-full">
                      <span className="text-[10px] text-muted-foreground sm:block font-bold uppercase tracking-widest mb-0.5">Tổng tiền</span>
                      <span className="font-extrabold text-lg sm:text-xl text-primary">{formatCurrency(order.total_amount)}</span>
                    </div>
                  </div>
                </CardHeader>

                <OrderTimeline status={order.status} />

                <CardContent className="pt-5 pb-5 px-5 sm:px-6 space-y-6">
                  {/* Thông tin phương thức thanh toán gọn nhẹ, rõ ràng */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-background border border-border/50 shadow-sm text-xs">
                    <div className="flex items-center gap-3 min-w-0 flex-wrap">
                      <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                         <Image src="/icons/payment_method2.png" alt="Banking" width={30} height={30}  />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider flex items-center">
                          Phương thức thanh toán
                          
                        </span>
                        <div className="flex items-center gap-2">
                          <strong className="font-bold text-foreground text-[13px]">
                            {isBanking ? "Chuyển khoản VietQR" : "Thanh toán khi nhận hàng (COD)"}
                          </strong>
                          {isBanking && paymentObj?.payment_code && (
                            <span className="font-mono font-bold text-[12px] px-2 py-0.5 rounded-md bg-muted  text-primary">
                              {paymentObj.payment_code}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row w-full sm:w-auto items-center justify-between sm:justify-end gap-2.5 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                      <span className="w-full sm:w-auto text-center">
                        {isBanking && (payStatus === 'PENDING' || payStatus === 'CREATED') && order.status === 'pending' && (
                            <OrderCountdown createdAt={order.created_at} />
                          )}
                      </span>
                      <span className={`text-[11px] font-bold px-3 py-1.5 rounded-full border shadow-sm w-full sm:w-auto text-center ${
                        order.status === 'cancelled' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' :
                        isBanking
                          ? (payStatus === 'MATCHED' ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                            : payStatus === 'MANUAL' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' 
                            : payStatus === 'EXPIRED' ? 'bg-rose-500/10 text-rose-600 border-rose-500/20' 
                            : 'bg-amber-500/10 text-amber-600 border-amber-500/20')
                          : ((order.status === 'delivered' || order.status === 'completed') ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-muted text-muted-foreground')
                      }`}>
                        {order.status === 'cancelled' ? 'Đã hủy thanh toán' : 
                          isBanking ? (
                            payStatus === 'MATCHED' ? 'Đã chuyển khoản' : payStatus === 'MANUAL' ? 'Đã xác nhận' : payStatus === 'EXPIRED' ? 'Hết hạn' : 'Chờ chuyển khoản'
                          ) : (
                            (order.status === 'delivered' || order.status === 'completed') ? 'Đã thu tiền (COD)' : 'Thanh toán khi nhận'
                          )
                        }
                      </span>
                      {isBanking && (payStatus === 'PENDING' || payStatus === 'CREATED') && order.status === 'pending' && (
                        <Button asChild size="sm" className="h-8 px-4 text-xs font-bold w-full sm:w-auto text-center bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md rounded-full">
                          <Link href={`/checkout/payment/${order.id}`}>
                            Thanh toán QR
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Product List */}
                  <div className="flex flex-col gap-3">
                    {order.order_items?.map((item: any) => {
                      const productId = item.product_id || item.products?.id;
                      return (
                        <div key={item.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group/item rounded-xl hover:bg-muted/40 transition-colors border border-transparent hover:border-border/50">
                          <div className="flex gap-4 items-start sm:items-center min-w-0 flex-1">
                            <Link
                              href={productId ? `/product/${productId}` : "#"}
                              className="shrink-0 block overflow-hidden rounded-xl border bg-background shadow-sm"
                              title="Xem chi tiết sản phẩm"
                            >
                              <Image
                                width={80}
                                height={80}
                                unoptimized
                                src={item.products?.image_url || "https://placehold.co/80x80"}
                                alt={item.products?.name || "product"}
                                className="h-20 w-20 object-cover transition-transform duration-500 group-hover/item:scale-110"
                              />
                            </Link>
                            <div className="flex-1 min-w-0">
                              <Link
                                href={productId ? `/product/${productId}` : "#"}
                                className="font-bold text-sm sm:text-base line-clamp-2 hover:text-primary transition-colors block mb-1.5"
                              >
                                {item.products?.name || "Sản phẩm không xác định"}
                              </Link>
                              {item.product_variants && (
                                <p className="text-[11px] text-muted-foreground mb-2 font-medium">
                                  Phân loại: <span className="font-semibold text-foreground/80 bg-background px-2 py-0.5 rounded-md border shadow-sm ml-1">{item.product_variants.name}</span>
                                </p>
                              )}
                              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 text-xs">
                                <span className="text-muted-foreground font-medium">Số lượng: <strong className="text-foreground">x{item.quantity}</strong></span>
                                <div className="hidden sm:block w-1 h-1 rounded-full bg-border" />
                                <span className="font-extrabold text-sm text-primary">{formatCurrency(item.price)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Nút Xem chi tiết / Mua lại & Đánh giá dành riêng cho từng sản phẩm */}
                          {productId && (
                            <div className="flex items-center justify-end gap-2.5 sm:shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-border/40 mt-1 sm:mt-0">
                              <Button
                                asChild
                                size="sm"
                                variant="outline"
                                className="h-9 px-4 text-xs font-bold rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm bg-background"
                              >
                                <Link href={`/product/${productId}`}>
                                  Mua lại
                                </Link>
                              </Button>

                              {/* Nút Đánh giá sản phẩm khi đơn hàng đã giao hoặc hoàn tất (delivered / completed) */}
                              {(order.status === "completed") && (
                                reviewedProductIds.has(productId) ? (
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled
                                    className="h-9 px-4 text-xs font-bold rounded-full text-green-600 bg-green-500/10 border-green-500/20"
                                  >
                                    <CheckCircle2 className="size-4 mr-1.5" /> Đã đánh giá
                                  </Button>
                                ) : (
                                  <Button
                                    type="button"
                                    size="sm"
                                    onClick={() => {
                                      setItemToReview({
                                        productId: productId,
                                        productName: item.products?.name || "Sản phẩm",
                                        productImage: item.products?.image_url,
                                        variantName: item.product_variants?.name,
                                        price: item.price,
                                        orderId: order.id
                                      });
                                      setReviewModalOpen(true);
                                    }}
                                    className="h-9 px-5 text-xs font-bold rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md transition-all hover:scale-105 active:scale-95 border-0"
                                  >
                                    <Star className="size-4 mr-1.5 fill-white text-white animate-pulse" /> Đánh giá
                                  </Button>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Action */}
                  {order.status === "pending" && (
                    <div className="pt-4 border-t border-border/50 flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full sm:w-auto text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 h-10 px-6 rounded-full border border-red-500 shadow-sm text-sm font-bold transition-colors"
                        disabled={cancellingId === order.id}
                        onClick={() => confirmCancel(order.id)}
                      >
                        {cancellingId === order.id ? (
                          <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <IconX className="mr-2 h-4 w-4" />
                        )}
                        Hủy đơn hàng
                      </Button>
                    </div>
                  )}

                  {order.status === "delivered" && (
                    <div className="pt-4 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 text-[13px] text-cyan-700 dark:text-cyan-400 font-medium bg-cyan-500/10 p-3.5 rounded-xl border border-cyan-500/20">
                        <CheckCircle2 className="size-5 shrink-0 text-cyan-600 dark:text-cyan-400 animate-pulse" />
                        <span>Đơn hàng đã được giao. Vui lòng xác nhận khi bạn đã nhận được sản phẩm!</span>
                      </div>
                      <Button
                        type="button"
                        size="lg"
                        disabled={confirmingId === order.id}
                        onClick={() => {
                          setOrderToReceive(order.id);
                          setConfirmReceiveModalOpen(true);
                        }}
                        className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold h-11 px-6 rounded-full shadow-lg shrink-0 cursor-pointer transition-all hover:scale-105 active:scale-95 border-0"
                      >
                        {confirmingId === order.id ? (
                          <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                        ) : (
                          <CheckCheck className="mr-2 h-5 w-5" />
                        )}
                        Xác nhận đã nhận hàng
                      </Button>
                    </div>
                  )}

                  {order.status === "completed" && (
                    <div className="pt-4 border-t border-border/50 flex items-center justify-between gap-3 text-[13px] text-green-700 dark:text-green-400 font-medium bg-green-500/10 p-3.5 rounded-xl border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <CheckCheck className="size-5 shrink-0" />
                        <span>Bạn đã xác nhận nhận hàng và hoàn tất đơn đặt hàng này. Cảm ơn quý khách!</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <AlertDialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
        <AlertDialogContent className="animate__animated animate__bounceIn">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Đóng lại</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
              className="bg-destructive text-white dark:text-black hover:bg-destructive/90"
            >
              Chắc chắn hủy
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmReceiveModalOpen} onOpenChange={setConfirmReceiveModalOpen}>
        <AlertDialogContent className="animate__animated animate__bounceIn">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận đã nhận được hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              Vui lòng xác nhận bạn đã nhận đủ sản phẩm, nguyên vẹn và hài lòng với đơn hàng này. Sau khi xác nhận, trạng thái đơn hàng sẽ chuyển sang Đã nhận hàng.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Chưa, tôi kiểm tra thêm</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmReceivedOrder}
              disabled={!!confirmingId}
              className="bg-green-600 hover:bg-green-700 text-white font-bold"
            >
              {confirmingId ? "Đang xử lý..." : "Xác nhận đã nhận hàng"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal đánh giá sản phẩm hiện đại, chuyên nghiệp */}
      <ProductReviewModal
        isOpen={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        item={itemToReview}
        onSuccess={(reviewedProductId) => {
          setReviewedProductIds((prev) => new Set(prev).add(reviewedProductId));
        }}
      />
    </div>
  );
}
