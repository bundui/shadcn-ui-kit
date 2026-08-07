"use client";

import { useEffect, useState, useRef, use, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { getPaymentByOrderId, createPayment, getVietQRUrl, getBankConfig, Payment } from "@/lib/services/payment.service";
import { getOrderById } from "@/lib/services/order.service";
import { Button } from "@/components/ui/button";
import {
  IconLoader2,
  IconCheck,
  IconCopy,
  IconClock,
  IconAlertCircle,
  IconArrowLeft,
  IconBuildingBank,
  IconQrcode,
  IconSparkles,
  IconRefresh,
  IconX,
  IconArrowBackUp,
  IconShoppingCart
} from "@tabler/icons-react";
import { toast } from "sonner";

/**
 * Hiệu ứng pháo giấy chúc mừng bằng HTML5 Canvas nguyên bản (0 dependencies)
 */
function CanvasConfetti() {
  useEffect(() => {
    const canvas = document.getElementById("payment-confetti") as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ["#10B981", "#3B82F6", "#F59E0B", "#EC4899", "#8B5CF6", "#06B6D4", "#EAB308"];

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.8) * 18 - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 12,
        gravity: 0.35
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = false;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.vr;
        if (p.y < canvas.height + 50) active = true;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
      if (active) {
        animationId = requestAnimationFrame(animate);
      }
    };
    animate();

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas id="payment-confetti" className="fixed inset-0 pointer-events-none z-50" />;
}

/**
 * Phát âm thanh chúc mừng bằng Web Audio API
 */
function playSuccessSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    const freqs = [523.25, 659.25, 783.99, 1046.50]; // Hợp âm C Major (Đô - Mi - Sol - Đô cao)
    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.18, now + idx * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.5);
    });
  } catch (err) {
    console.error("Audio error:", err);
  }
}

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.orderId;
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [payment, setPayment] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [status, setStatus] = useState<"PENDING" | "SUCCESS" | "EXPIRED">("PENDING");
  const [refreshing, setRefreshing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const bankConfig = getBankConfig();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const successPlayedRef = useRef(false);
  const emailSentRef = useRef(false);
  const orderRef = useRef<any>(null);

  /**
   * Tạo nội dung chuyển khoản chuẩn theo ý tưởng: Tên-SĐT-MãGD
   * Ví dụ: DUNG-0123456789-LX123456
   */
  const getCustomTransferNote = () => {
    if (!payment) return "";
    const fullName = order?.addresses?.full_name || order?.shipping_address?.full_name || order?.full_name || "";
    const phoneStr = (order?.addresses?.phone || order?.shipping_address?.phone || order?.phone || "").replace(/\D/g, "");

    // Trích xuất từ cuối cùng trong Họ và Tên (Chỉ lấy tên, viết không dấu uppercase)
    let firstName = "KH";
    if (fullName) {
      const noAccent = fullName
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/Đ/g, "D")
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .trim()
        .toUpperCase();
      const words = noAccent.split(/\s+/).filter(Boolean);
      if (words.length > 0) {
        firstName = words[words.length - 1];
      }
    }

    const codeWithoutDash = payment.payment_code.replace(/^LX-/i, "LX");
    if (firstName !== "KH" && phoneStr) {
      return `${firstName}-${phoneStr}-${codeWithoutDash}`;
    }
    return codeWithoutDash;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã sao chép ${label}!`, {
      description: text
    });
  };

  const triggerSuccessEmail = useCallback(async (orderObj: any, payObj: Payment) => {
    if (emailSentRef.current || !orderObj || !payObj) return;
    emailSentRef.current = true;
    try {
      let email = orderObj.profiles?.email || orderObj.email;
      if (!email) {
        const { data: authData } = await supabase.auth.getUser();
        email = authData.user?.email;
      }
      if (!email) {
        console.warn("⚠️ [QR Page] Không tìm thấy email khách hàng để gửi thông báo.");
        return;
      }

      const emailPayload = {
        to: email,
        orderId: orderObj.id,
        fullName: orderObj.profiles?.full_name || orderObj.addresses?.full_name || orderObj.full_name || "Quý khách",
        phone: orderObj.profiles?.phone || orderObj.addresses?.phone || orderObj.phone || "",
        address: orderObj.addresses ? `${orderObj.addresses.street || ""}, ${orderObj.addresses.city || ""}` : "",
        items: (orderObj.order_items || []).map((item: any) => ({
          name: item.products?.name || "Sản phẩm",
          quantity: item.quantity || 1,
          price: Number(item.price || item.products?.price || 0),
          variant: item.product_variants?.name || undefined,
          imageUrl: item.products?.image_url || undefined,
        })),
        totalAmount: orderObj.total_amount,
        paymentMethod: `Chuyển khoản VietQR (${payObj.payment_code} - Đã thanh toán)`,
        createdAt: orderObj.created_at || new Date().toISOString(),
      };

      console.log("📤 [QR Page] Đang gửi yêu cầu email xác nhận thanh toán đến:", email);
      await fetch("/api/email/order-confirmation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailPayload),
      });
      console.log("✅ [QR Page] Đã yêu cầu gửi email xác nhận thành công!");
    } catch (err) {
      console.error("❌ [QR Page] Lỗi khi gửi email:", err);
    }
  }, []);

  const checkStatusAndExpiry = useCallback((payData: Payment, currentOrder?: any) => {
    if (payData.status === "MATCHED" || payData.status === "MANUAL") {
      setStatus("SUCCESS");
      if (!successPlayedRef.current) {
        successPlayedRef.current = true;
        playSuccessSound();
      }
      const targetOrder = currentOrder || orderRef.current;
      if (targetOrder) {
        triggerSuccessEmail(targetOrder, payData);
        if (typeof window !== "undefined" && window.BroadcastChannel) {
          try {
            new BroadcastChannel("admin_orders_channel").postMessage({
              type: "NEW_ORDER",
              order: { ...targetOrder, status: "paid" }
            });
          } catch {}
        }
      }
      return;
    }

    const expiresAtMs = new Date(payData.expires_at).getTime();
    const remainingSeconds = Math.floor((expiresAtMs - Date.now()) / 1000);

    if (remainingSeconds <= 0 || payData.status === "EXPIRED") {
      setStatus("EXPIRED");
      setTimeLeft(0);
    } else {
      setStatus("PENDING");
      setTimeLeft(remainingSeconds);
    }
  }, [triggerSuccessEmail]);

  // 1. Tải thông tin đơn hàng và phiên thanh toán
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Lấy thông tin đơn hàng đầy đủ (kèm order_items, profile email, address)
      const { data: orderData, error: orderErr } = await getOrderById(orderId);

      if (orderErr || !orderData) {
        toast.error("Không tìm thấy đơn hàng!");
        router.push("/account/orders");
        return;
      }
      orderRef.current = orderData;
      setOrder(orderData);

      // Lấy hoặc tạo payment
      const { data: payData } = await getPaymentByOrderId(orderId);
      
      let shouldCreateNew = false;
      if (!payData) {
        shouldCreateNew = true;
      } else {
        const expiresAtMs = new Date(payData.expires_at).getTime();
        const isExpired = expiresAtMs <= Date.now() || payData.status === "EXPIRED";
        if (isExpired && (payData.status === "PENDING" || payData.status === "EXPIRED")) {
          shouldCreateNew = true;
        }
      }

      if (!shouldCreateNew && payData) {
        setPayment(payData);
        checkStatusAndExpiry(payData, orderData);
      } else {
        // Nếu chưa có payment hoặc payment cũ đã hết hạn, tự động tạo mới
        const { data: newPay, error: payErr } = await createPayment(orderId, orderData.total_amount);
        if (payErr || !newPay) {
          toast.error("Lỗi khởi tạo cổng thanh toán!");
          if (payData) {
            setPayment(payData);
            checkStatusAndExpiry(payData, orderData);
          }
        } else {
          setPayment(newPay);
          checkStatusAndExpiry(newPay, orderData);
        }
      }
    } catch (err) {
      console.error("Lỗi tải trang thanh toán:", err);
    } finally {
      setLoading(false);
    }
  }, [orderId, router, checkStatusAndExpiry]);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]); // CHỈ CHẠY 1 LẦN KHI orderId THAY ĐỔI, ngăn chặn triệt để lặp vô tận (infinite loop)!

  // 2. Đồng hồ đếm ngược 10 phút
  useEffect(() => {
    if (status !== "PENDING" || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setStatus("EXPIRED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status, timeLeft]);

  // 3. Supabase Realtime Listener (Lắng nghe khi đơn chuyển sang MATCHED)
  useEffect(() => {
    if (!payment?.id) return;

    console.log("📡 [Realtime] Đang kết nối kênh lắng nghe thanh toán QR:", payment.id);
    const channel = supabase
      .channel(`qr-payment-${payment.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "payments",
          filter: `id=eq.${payment.id}`,
        },
        (payload) => {
          console.log("🔔 [Realtime] Nhận tín hiệu cập nhật payment:", payload);
          const newPay = payload.new as Payment;
          setPayment(newPay);
          if (newPay.status === "MATCHED" || newPay.status === "MANUAL") {
            setStatus("SUCCESS");
            if (!successPlayedRef.current) {
              successPlayedRef.current = true;
              playSuccessSound();
              toast.success("🎉 Thanh toán đã được xác nhận thành công!");
            }
            if (orderRef.current) {
              triggerSuccessEmail(orderRef.current, newPay);
            }
          } else if (newPay.status === "EXPIRED") {
            setStatus("EXPIRED");
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [payment?.id, triggerSuccessEmail]);

  // 4. Hàm làm mới mã QR khi hết hạn
  const handleRegenerateQR = async () => {
    if (!order) return;
    setRefreshing(true);
    const { data: newPay, error } = await createPayment(order.id, order.total_amount);
    setRefreshing(false);
    if (error || !newPay) {
      toast.error("Không thể tạo mã mới, vui lòng thử lại sau.");
    } else {
      setPayment(newPay);
      setStatus("PENDING");
      const expiresAtMs = new Date(newPay.expires_at).getTime();
      setTimeLeft(Math.floor((expiresAtMs - Date.now()) / 1000));
      toast.success("Đã tạo mã thanh toán mới!");
    }
  };

  // 5. Hàm hủy thanh toán & hoàn lại sản phẩm vào giỏ hàng (hoặc quay lại bước trước)
  const handleCancelAndRestore = async (redirectTo: "/checkout" | "/cart" = "/checkout") => {
    if (!order) return;
    setCancelling(true);
    try {
      // 1. Cập nhật trạng thái đơn hàng thành cancelled
      await supabase.from("orders").update({ status: "cancelled" }).eq("id", order.id);

      // 2. Cập nhật trạng thái payment thành EXPIRED
      if (payment?.id) {
        await supabase.from("payments").update({ status: "EXPIRED" }).eq("id", payment.id);
      }

      // 3. Lấy lại danh sách sản phẩm trong đơn hàng để hoàn vào giỏ
      const { data: orderItems } = await supabase
        .from("order_items")
        .select("product_id, variant_id, quantity")
        .eq("order_id", order.id);

      if (orderItems && orderItems.length > 0) {
        const { data: userData } = await supabase.auth.getUser();
        const userId = userData.user?.id || order.user_id;

        if (userId) {
          const restorePayload = orderItems.map((item: any) => ({
            user_id: userId,
            product_id: item.product_id,
            variant_id: item.variant_id || null,
            quantity: item.quantity
          }));
          await supabase.from("cart_items").insert(restorePayload);

          // Kích hoạt sự kiện để Header/Navbar cập nhật lại huy hiệu số lượng giỏ hàng
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("cart-updated"));
          }
        }
      }

      if (redirectTo === "/checkout") {
        toast.info("Đã quay lại bước đặt hàng!", {
          description: "Các sản phẩm đã được giữ nguyên để bạn chọn lại phương thức thanh toán."
        });
      } else {
        toast.info("Đã hủy thanh toán & Hoàn giỏ hàng!", {
          description: "Toàn bộ sản phẩm đã được trả lại giỏ hàng của bạn."
        });
      }
      router.push(redirectTo);
    } catch (err) {
      console.error("Lỗi khi hủy đơn & hoàn giỏ hàng:", err);
      toast.error("Có lỗi xảy ra khi hủy thanh toán.");
      setCancelling(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <IconLoader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Đang kết nối cổng thanh toán VietQR...</p>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-8 px-4 md:px-6 mx-auto animate-in fade-in-50 duration-500">
      {status === "SUCCESS" && <CanvasConfetti />}

      {/* Nút quay lại bước trước & Hủy thanh toán */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        {status === "PENDING" ? (
          <button
            type="button"
            onClick={() => handleCancelAndRestore("/checkout")}
            disabled={cancelling}
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 cursor-pointer"
          >
            {cancelling ? <IconLoader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <IconArrowLeft className="w-4 h-4 mr-1.5" />}
            Quay lại bước trước (Chọn địa chỉ & thanh toán)
          </button>
        ) : (
          <Link href="/account/orders" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <IconArrowLeft className="w-4 h-4 mr-1" /> Quay lại danh sách đơn hàng
          </Link>
        )}
        {status === "PENDING" && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCancelAndRestore("/cart")}
            disabled={cancelling}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 font-semibold text-xs md:text-sm cursor-pointer hidden sm:flex"
          >
            {cancelling ? <IconLoader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <IconArrowBackUp className="w-4 h-4 mr-1.5" />}
            Hủy thanh toán & Về giỏ hàng
          </Button>
        )}
      </div>

      {/* STATUS HERO BANNER: Trạng thái & Thời gian đếm ngược rõ ràng, trực quan */}
      {status === "PENDING" && (
        <div className="mb-6 p-5 sm:p-6 rounded-[32px] bg-card/60 backdrop-blur-xl border border-amber-500/30 shadow-lg relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-primary/5 to-green-500/5 pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center gap-4 text-center sm:text-left z-10">
            <div className="relative flex items-center justify-center shrink-0">
              <span className="absolute size-14 rounded-full bg-green-500/50 animate-ping -z-100" />
              <div className="size-16 rounded-[20px] bg-background text-white flex items-center justify-center shadow-inner">
                <Image src="/icons/card.png" alt="Logo" width={44} height={44} />
              </div>
            </div>
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 tracking-tight">
                  Đang chờ thanh toán...
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md">
                Quét mã QR bên dưới hoặc chuyển khoản theo đúng thông tin. Màn hình sẽ thông báo <strong className="text-green-500 font-bold">Thành công</strong> sau khi nhận được tiền!
              </p>
            </div>
          </div>

          {/* ĐỒNG HỒ ĐẾM NGƯỢC RÕ RÀNG VÀ NỔI BẬT */}
          <div className="flex flex-col items-center w-full sm:w-fit sm:items-end shrink-0 bg-background/80 backdrop-blur-md px-5 py-3 rounded-[20px] border border-border/50 shadow-sm z-10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">Thời gian giữ đơn</span>
            <div className="flex items-center justify-center gap-2 mt-0.5 font-mono font-black text-3xl text-amber-600 dark:text-amber-400 tracking-tight drop-shadow-sm">
              <Image src="/icons/time.png" alt="Logo" width={25} height={25} />
              <div className="w-[3em] text-center">{formatTime(timeLeft)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* CỘT TRÁI: MÃ QR RỘNG HƠN & HƯỚNG DẪN TRỰC QUAN */}
        <div className="md:col-span-7 bg-card/80 backdrop-blur-xl border border-border/50 rounded-[32px] p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col items-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10 pointer-events-none" />
          <div className="w-full flex items-center justify-between border-b border-border/50 pb-4 mb-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary flex items-center justify-center shrink-0 shadow-inner">
                <IconQrcode className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-foreground">Quét Mã VietQR Tự Động</h1>
                <p className="text-xs text-muted-foreground mt-0.5">Hỗ trợ tất cả ứng dụng Ngân hàng & MoMo</p>
              </div>
            </div>
            {/* <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Napas 24/7</span>
            </div> */}
          </div>

          {status === "SUCCESS" ? (
            /* TRẠNG THÁI THÀNH CÔNG */
            <div className="py-16 text-center space-y-6 animate-in fade-in zoom-in duration-500 relative overflow-hidden bg-green-500/5 rounded-3xl border border-green-500/20 w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              <div className="w-24 h-24 bg-green-500/10 text-green-600 dark:text-green-400 rounded-[24px] flex items-center justify-center mx-auto shadow-inner relative z-10">
                <IconCheck className="w-12 h-12 stroke-[3]" />
              </div>
              <div className="space-y-3 relative z-10 px-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-400 flex items-center justify-center gap-2">
                  <span>Thanh toán thành công!</span>
                </h2>
                <p className="text-base text-muted-foreground max-w-md mx-auto">
                  Hệ thống đã xác thực giao dịch tự động thành công. Đơn hàng <strong className="text-foreground">#{order?.id.split("-")[0].toUpperCase()}</strong> của bạn đã được xác nhận và đang chuyển sang bộ phận đóng gói!
                </p>
              </div>
              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center relative z-10 px-4">
                <Button asChild size="lg" className="rounded-xl font-bold shadow-lg shadow-green-500/20 bg-green-600 hover:bg-green-700 hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  <Link href="/account/orders">Xem chi tiết đơn hàng</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-xl font-bold hover:scale-105 transition-transform duration-300 w-full sm:w-auto">
                  <Link href="/">Tiếp tục mua sắm</Link>
                </Button>
              </div>
            </div>
          ) : status === "EXPIRED" ? (
            /* TRẠNG THÁI HẾT HẠN */
            <div className="py-16 text-center space-y-6 animate-in fade-in duration-300 relative overflow-hidden bg-destructive/5 rounded-3xl border border-destructive/20 w-full">
              <div className="absolute inset-0 bg-gradient-to-br from-destructive/10 via-transparent to-transparent opacity-50 pointer-events-none" />
              <div className="w-24 h-24 bg-destructive/10 text-destructive rounded-[24px] flex items-center justify-center mx-auto shadow-inner relative z-10">
                <IconAlertCircle className="w-12 h-12 stroke-[2]" />
              </div>
              <div className="space-y-3 relative z-10 px-4">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-destructive to-destructive/70">Mã thanh toán đã hết hạn</h2>
                <p className="text-base text-muted-foreground max-w-sm mx-auto">
                  Phiên làm việc 10 phút đã kết thúc để đảm bảo an toàn giao dịch. Bạn vui lòng tạo mã mới để tiếp tục.
                </p>
              </div>
              <div className="pt-4 relative z-10 px-4">
                <Button onClick={handleRegenerateQR} size="lg" disabled={refreshing} className="rounded-xl font-bold shadow-lg shadow-destructive/20 bg-destructive hover:bg-destructive/90 hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                  {refreshing ? <IconLoader2 className="w-5 h-5 mr-2 animate-spin" /> : <IconRefresh className="w-5 h-5 mr-2" />}
                  Tạo lại mã thanh toán mới
                </Button>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center space-y-6 relative z-10">
              {/* Ảnh QR Code RỘNG HƠN & RÕ RÀNG HƠN */}
              <div className="w-full bg-white p-4 sm:p-6 rounded-[24px] border border-border/50 flex flex-col items-center justify-center shadow-sm relative group max-w-md mx-auto">
                {payment && (
                  <Image
                    width={380}
                    height={380}
                    unoptimized
                    src={getVietQRUrl({ amount: payment.amount, paymentCode: payment.payment_code, addInfo: getCustomTransferNote() })}
                    alt="VietQR Chuyển khoản"
                    className="w-[300px] h-[300px] sm:w-[360px] sm:h-[360px] object-contain transition-transform group-hover:scale-[1.02] duration-300"
                  />
                )}
              </div>

              {/* Hướng dẫn 3 bước ngắn gọn, trực quan, không nhiều chữ */}
              <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 pt-2">
                <div className="bg-muted/40 rounded-2xl p-3 text-center border">
                  <div className="size-7 rounded-full bg-primary/10 text-primary font-black text-xs flex items-center justify-center mx-auto mb-1.5">1</div>
                  <p className="text-xs font-bold text-foreground">Quét mã QR</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Mở App Ngân hàng</p>
                </div>
                <div className="bg-muted/40 rounded-2xl p-3 text-center border">
                  <div className="size-7 rounded-full bg-amber-500/10 text-amber-600 font-black text-xs flex items-center justify-center mx-auto mb-1.5">2</div>
                  <p className="text-xs font-bold text-foreground">Kiểm tra thông tin</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Số tiền & Nội dung</p>
                </div>
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-3 text-center">
                  <div className="size-7 rounded-full bg-emerald-500/20 text-emerald-600 font-black text-xs flex items-center justify-center mx-auto mb-1.5">3</div>
                  <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Tự động duyệt</p>
                  <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">Xong trong 30s</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CỘT PHẢI: CHI TIẾT TÀI KHOẢN & ĐƠN HÀNG */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-[32px] p-6 sm:p-8 shadow-sm space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -z-10 translate-x-10 -translate-y-10 pointer-events-none" />
            <p className="text-md text-muted-foreground border-b border-border/50 font-semibold pb-3 text-foreground flex items-center justify-between relative z-10">
              <span>Ngân hàng thụ hưởng</span>
              <span className="text-lg font-extrabold text-green-700 dark:text-green-500 tracking-wide">{bankConfig.bankId}</span>
            </p>

            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Chủ tài khoản:</span>
                <span className="font-bold uppercase text-foreground">{bankConfig.accountName}</span>
              </div>

              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-xl border">
                <div>
                  <span className="text-xs text-muted-foreground block">Số tài khoản:</span>
                  <span className="font-mono font-bold text-base text-foreground tracking-wider">{bankConfig.accountNo}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 rounded-lg text-xs font-semibold bg-background hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                  onClick={() => handleCopy(bankConfig.accountNo, "Số tài khoản")}
                >
                  <IconCopy className="w-3.5 h-3.5 mr-1" /> Copy
                </Button>
              </div>

              <div className="flex justify-between items-center bg-muted/50 p-3 rounded-xl border">
                <div>
                  <span className="text-xs text-muted-foreground block">Số tiền cần chuyển:</span>
                  <span className="font-bold text-lg text-primary">{payment ? formatCurrency(payment.amount) : "0 ₫"}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 rounded-lg text-xs font-semibold bg-background hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
                  onClick={() => handleCopy((payment?.amount || 0).toString(), "Số tiền")}
                >
                  <IconCopy className="w-3.5 h-3.5 mr-1" /> Copy
                </Button>
              </div>

              {/* Nội dung chuyển khoản: Hiển thị trọn vẹn 100% trên 1 hàng (whitespace-nowrap), KHÔNG có thanh cuộn, KHÔNG bị cắt chữ */}
              <div className="bg-amber-500/10 border-2 border-amber-500/30 p-4 sm:p-4.5 rounded-2xl space-y-2.5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold  tracking-wider text-gray-800 dark:text-gray-300 flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                    Nội dung chuyển khoản (Bắt buộc):
                  </span>
                </div>

                {/* Khung chứa mã: Kích thước text-sm sm:text-base tracking-tight giúp 25 ký tự nằm gọn trên đúng 1 hàng ngang mà KHÔNG cần thanh cuộn hay overflow */}
                <div className="w-full bg-background dark:bg-card px-3 py-2.5 rounded-xl border border-amber-500/35 shadow-inner flex items-center justify-center">
                  <span className="font-mono font-extrabold text-sm sm:text-base text-amber-600 dark:text-amber-400 tracking-tight  select-all">
                    {getCustomTransferNote() || "..."}
                  </span>
                </div>

                {/* Nút copy xuống hàng bên dưới với chiều ngang trọn vẹn w-full để dễ bấm trên mọi thiết bị */}
                <Button
                  variant="default"
                  size="sm"
                  className="h-9 w-full rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  onClick={() => handleCopy(getCustomTransferNote(), "Nội dung chuyển khoản")}
                >
                  <IconCopy className="w-4 h-4 shrink-0" />
                  Sao chép 
                </Button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                <span>Mã đơn hàng:</span>
                <span className="font-mono font-bold text-foreground">#{order?.id.split("-")[0].toUpperCase()}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground items-center">
                <span>Trạng thái thanh toán:</span>
                <span className={`font-bold px-2 py-0.5 rounded-full ${status === "SUCCESS" ? "bg-green-500/10 text-green-600" : status === "EXPIRED" ? "bg-destructive/10 text-destructive" : "bg-amber-500/10 text-amber-600 animate-pulse"}`}>
                  {status === "SUCCESS" ? "✓ Đã thanh toán" : status === "EXPIRED" ? "❌ Hết hạn" : "🕒 Đang chờ thanh toán..."}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-xs space-y-1.5 flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div className="space-y-1">
              <p className="font-bold text-amber-800 dark:text-amber-300">Lưu ý quan trọng:</p>
              <p className="text-amber-700 dark:text-amber-400 leading-relaxed">
                Vui lòng nhập dúng<strong> Nội dung chuyển khoản</strong> là <strong className="font-mono bg-amber-500/20 px-1.5 py-0.5 rounded text-foreground">{getCustomTransferNote()}</strong> để hệ thống tự động xác nhận giao dịch trong 30 giây!
              </p>
            </div>
          </div>

          {status === "PENDING" && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => handleCancelAndRestore("/cart")}
              disabled={cancelling}
              className="w-full rounded-2xl border-destructive/30 text-destructive hover:bg-destructive hover:text-white font-bold shadow-sm transition-all h-12 cursor-pointer flex sm:hidden"
            >
              {cancelling ? <IconLoader2 className="w-5 h-5 mr-2 animate-spin" /> : <IconShoppingCart className="w-5 h-5 mr-2" />}
              Hủy thanh toán & Hoàn lại giỏ hàng
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
