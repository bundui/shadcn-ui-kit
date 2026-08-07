"use client";

import { useEffect, useRef, useCallback } from "react";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ShoppingBag, AlertTriangle, ArrowRight, RefreshCw } from "lucide-react";

export function AdminRealtimeNotifier() {
  const router = useRouter();
  const notifiedIds = useRef(new Set<string>());
  const notifiedUpdates = useRef(new Map<string, number>());
  const audioCtxRef = useRef<any>(null);

  // Mở khóa AudioContext khi Admin có bất kỳ thao tác click/phím nào để lách luật chặn âm thanh
  const getAudioCtx = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) audioCtxRef.current = new AudioCtx();
    }
    // đánh thức phòng thu hoạt động trở lại khi bị ngủ đông
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playSingleChime = useCallback((delaySec: number) => {
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      const t = ctx.currentTime + delaySec;
      osc.type = "square"; // Sóng vuông 8-bit tạo âm thanh Mario Coin
      osc.frequency.setValueAtTime(987.77, t);
      osc.frequency.setValueAtTime(1318.51, t + 0.08);

      // Khởi tạo từ 0 rồi tăng mượt lên 0.25 trong 10ms (chống hiện tượng vỡ tiếng pop/crackle của loa)
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.25, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);

      osc.start(t);
      osc.stop(t + 0.5);
    } catch (err) {
      console.warn("Lỗi phát âm thanh:", err);
    }
  }, []);

  // Phát chuông báo 2 tiếng liên tiếp (Ting Ting... Ting Ting)
  const playCashChime = useCallback(() => {
    playSingleChime(0);
    playSingleChime(0.55);
    playSingleChime(1.1);
  }, [playSingleChime]);

  const triggerOrderNotification = useCallback((order: any) => {
    if (!order?.id || notifiedIds.current.has(order.id)) return;

    // Nếu là đơn thanh toán tự động (banking / VietQR / non-cod) mà trạng thái vẫn là "pending" (chưa thanh toán xong)
    // -> Tuyệt đối không phát tiếng chuông Đơn mới và thông báo cho Admin!
    const isBanking = order.payment_method === "banking" || order.payment_method?.includes("VietQR") || (order.payment_method && order.payment_method !== "cod");
    if (isBanking && order.status === "pending") {
      return;
    }

    notifiedIds.current.add(order.id);

    playCashChime();

    // Kiểm tra code chạy trên client-side để tránh lỗi
    if (typeof window !== "undefined") {
      try {
        const unread = JSON.parse(localStorage.getItem("admin_unread_order_ids") || "[]");
        if (!unread.includes(order.id)) {
          unread.push(order.id);
          localStorage.setItem("admin_unread_order_ids", JSON.stringify(unread));
        }
      } catch { }
      window.dispatchEvent(new CustomEvent("ADMIN_LOCAL_NEW_ORDER", { detail: order }));
    }

    const shortId = order.id ? order.id.split("-")[0].toUpperCase() : "";
    const amountStr = order.total_amount ? Number(order.total_amount).toLocaleString("vi-VN") + " đ" : "Đơn mới";
    const isPaidBanking = isBanking && (order.status === "paid" || order.status === "completed");

    toast.custom((t) => (
      <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-emerald-500/30 bg-background/95 backdrop-blur-xl shadow-2xl shadow-emerald-500/10 w-full max-w-[330px] transition-all animate-in fade-in zoom-in-95">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shrink-0 shadow-md shadow-emerald-500/20">
            <ShoppingBag className="w-4 h-4 animate-bounce" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[11px] tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                {isPaidBanking ? "Đã thanh toán!" : "Đơn mới!"}
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">#{shortId}</span>
            </div>
            <p className="text-xs font-extrabold truncate text-foreground mt-0.5">{amountStr}</p>
            {isPaidBanking && (
              <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate mt-0.5">Khách đã chuyển khoản VietQR thành công</p>
            )}
          </div>
        </div>
        <button
          onClick={() => {
            toast.dismiss(t);
            router.push("/dashboard/orders");
          }}
          className="shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold transition-all shadow active:scale-95 cursor-pointer"
        >
          <span>Xem</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>
    ), { duration: 10000 });
  }, [router, playCashChime]);

  const triggerUpdateNotification = useCallback((data: { id: string; status: string }) => {
    if (!data?.id) return;
    const key = `${data.id}_${data.status}`;
    const now = Date.now();
    const lastNotified = notifiedUpdates.current.get(key) || 0;
    if (now - lastNotified < 2000) return; // Chống trùng lặp thông báo trong 2 giây
    notifiedUpdates.current.set(key, now);

    playSingleChime(0);

    const shortId = data.id.split("-")[0].toUpperCase();
    if (data.status === "cancelled") {
      toast.custom((t) => (
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-rose-500/30 bg-background/95 backdrop-blur-xl shadow-2xl shadow-rose-500/10 w-full max-w-[330px] transition-all animate-in fade-in zoom-in-95">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 text-white shrink-0 shadow-md shadow-rose-500/20">
              <AlertTriangle className="w-4 h-4 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[11px] tracking-wider uppercase text-rose-600 dark:text-rose-400">Đã hủy!</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">#{shortId}</span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate mt-0.5">Đơn hàng vừa bị huỷ!</p>
            </div>
          </div>
          <button
            onClick={() => {
              toast.dismiss(t);
              router.push("/dashboard/orders");
            }}
            className="shrink-0 px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-bold transition-all shadow active:scale-95 cursor-pointer"
          >
            Kiểm tra
          </button>
        </div>
      ), { duration: 8000 });
    } else {
      toast.custom((t) => (
        <div className="relative overflow-hidden flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-white/20 dark:border-white/10 bg-background/70 backdrop-blur-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] w-full max-w-[340px] group animate__animated animate__zoomIn animate__faster">
          {/* Subtle animated background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent opacity-50 pointer-events-none" />
          
          <div className="relative flex items-center gap-3 min-w-0 flex-1">
            <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 text-white shrink-0 shadow-lg shadow-sky-500/30 group-hover:scale-110 transition-transform duration-500">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-[13px] font-extrabold text-foreground truncate tracking-tight">
                Cập nhật đơn #{shortId}
              </p>
              <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                </span>
                <span className="truncate">
                  {{
                    'pending': 'Chờ xử lý',
                    'processing': 'Đang xử lý',
                    'delivering': 'Đang giao hàng',
                    'shipping': 'Đang giao hàng',
                    'completed': 'Đã nhận hàng',
                    'delivered': 'Đã giao  hàng',
                    'cancelled': 'Đã huỷ',
                    'paid': 'Đã thanh toán',
                    'unpaid': 'Chưa thanh toán',
                    'refunded': 'Đã hoàn tiền'
                  }[data.status?.toLowerCase()] || data.status}
                </span>
              </p>
            </div>
          </div>

          <button 
            onClick={() => {
              toast.dismiss(t);
              router.push(`/dashboard/orders`);
            }}
            className="relative z-10 shrink-0 px-3 py-1.5 rounded-lg bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-foreground text-[11px] font-bold transition-all border border-black/5 dark:border-white/10 active:scale-95"
          >
            Chi tiết
          </button>
        </div>
      ), { duration: 5000 });
    }
  }, [router, playSingleChime]);

  // Sử dụng ref để đảm bảo Hot Reload luôn nhận được code âm thanh mới nhất mà không bị cache closure cũ
  const triggerOrderRef = useRef(triggerOrderNotification);
  const triggerUpdateRef = useRef(triggerUpdateNotification);

  useEffect(() => {
    triggerOrderRef.current = triggerOrderNotification;
    triggerUpdateRef.current = triggerUpdateNotification;
  }, [triggerOrderNotification, triggerUpdateNotification]);

  useEffect(() => {
    const unlock = () => {
      const ctx = getAudioCtx();
      if (ctx && ctx.state === "suspended") ctx.resume();
    };
    window.addEventListener("click", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && window.BroadcastChannel) {
      bc = new BroadcastChannel("admin_orders_channel");
      bc.onmessage = (event) => {
        if (event.data?.type === "NEW_ORDER" && event.data.order) {
          triggerOrderRef.current(event.data.order);
        } else if (event.data?.type === "ORDER_UPDATED") {
          triggerUpdateRef.current(event.data);
        }
      };
    }

    const existingChannels = supabase.getChannels().filter(c => c.topic === "realtime:global-admin-orders-notifier" || c.topic === "global-admin-orders-notifier");
    existingChannels.forEach(c => supabase.removeChannel(c));

    const channel = supabase
      .channel("global-admin-orders-notifier")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        triggerOrderRef.current(payload.new);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders" }, (payload) => {
        const newOrder = payload.new as any;
        const isBanking = newOrder?.payment_method === "banking" || newOrder?.payment_method?.includes("VietQR") || (newOrder?.payment_method && newOrder?.payment_method !== "cod");
        if (isBanking && (newOrder.status === "paid" || newOrder.status === "completed") && !notifiedIds.current.has(newOrder.id)) {
          triggerOrderRef.current(newOrder);
          return;
        }
        triggerUpdateRef.current(newOrder);
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "payments" }, async (payload) => {
        const newPay = payload.new as any;
        if ((newPay?.status === "MATCHED" || newPay?.status === "MANUAL") && newPay?.order_id && !notifiedIds.current.has(newPay.order_id)) {
          const { data: orderData } = await supabase.from("orders").select("*").eq("id", newPay.order_id).maybeSingle();
          if (orderData && !notifiedIds.current.has(orderData.id)) {
            triggerOrderRef.current({ ...orderData, status: "paid" });
          }
        }
      })
      .on("broadcast", { event: "NEW_ORDER" }, (payload) => {
        if (payload.payload) triggerOrderRef.current(payload.payload);
      })
      .on("broadcast", { event: "ORDER_UPDATED" }, (payload) => {
        if (payload.payload) triggerUpdateRef.current(payload.payload);
      })
      .subscribe();

    return () => {
      window.removeEventListener("click", unlock);
      window.removeEventListener("keydown", unlock);
      if (bc) bc.close();
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
