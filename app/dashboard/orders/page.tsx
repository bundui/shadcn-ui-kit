"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import RoleGuard from "@/components/guards/role-guard";
import { useAuth } from "@/components/providers/auth-provider";
import { getOrders, updateOrderStatus, getOrderById, deleteOrderAdmin } from "@/lib/services/order.service";
import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BellRing, ExternalLink } from "lucide-react";
import {
  IconSearch,
  IconLoader2,
  IconReceipt,
  IconEye,
  IconPackage,
  IconTrash,
  IconFilter,
  IconCalendar,
  IconArrowsSort,
  IconX,
  IconCreditCard,
  IconTruckDelivery,
} from "@tabler/icons-react";
import { format } from "date-fns";

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  pending: { label: "Chờ xử lý", color: "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20" },
  paid: { label: "Đã thanh toán", color: "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 border-blue-500/20" },
  shipping: { label: "Đang giao", color: "bg-indigo-500/10 text-indigo-600 hover:bg-indigo-500/20 border-indigo-500/20" },
  delivered: { label: "Đã giao", color: "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border-emerald-500/20" },
  completed: { label: "Đã nhận hàng", color: "bg-green-500/10 text-green-600 hover:bg-green-500/20 border-green-500/20 font-bold" },
  cancelled: { label: "Đã hủy", color: "bg-red-500/10 text-red-600 hover:bg-red-500/20 border-red-500/20" },
};

function OrdersContent() {
  const { role } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSearch = searchParams.get("search") || "";
  const currentPage = Number(searchParams.get("page")) || 1;
  const currentStatus = searchParams.get("status") || "all";
  const currentSort = searchParams.get("sort") || "newest";
  const currentDate = searchParams.get("date") || "all";

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState(currentSearch);

  // Detail Dialog State
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper đọc unread ids từ localStorage
  const getUnreadFromStorage = () => {
    if (typeof window === "undefined") return new Set<string>();
    try {
      const list = JSON.parse(localStorage.getItem("admin_unread_order_ids") || "[]");
      return new Set<string>(list);
    } catch {
      return new Set<string>();
    }
  };

  // Live Glowing Pool cho các đơn mới nổ trong phiên làm việc (bền vững qua F5)
  const [liveOrderIds, setLiveOrderIds] = useState<Set<string>>(getUnreadFromStorage);

  const [activeTab, setActiveTab] = useState("orders-list");
  const [orderAlerts, setOrderAlerts] = useState<any[]>([]);
  const [loadingOrderAlerts, setLoadingOrderAlerts] = useState(false);
  const [orderAlertSearch, setOrderAlertSearch] = useState("");

  const fetchOrderAlerts = useCallback(async () => {
    setLoadingOrderAlerts(true);
    const { data } = await getOrders("", 1, 50);
    if (data) setOrderAlerts(data);
    setLoadingOrderAlerts(false);
  }, []);

  const filteredOrderAlerts = orderAlerts.filter((o) => {
    if (!orderAlertSearch.trim()) return true;
    const q = orderAlertSearch.toLowerCase();
    const shortId = o.id ? o.id.split("-")[0].toLowerCase() : "";
    const name = (o.profiles?.full_name || o.addresses?.full_name || o.profiles?.email?.split("@")[0] || "").toLowerCase();
    const phone = (o.addresses?.phone || o.profiles?.phone || "").toLowerCase();
    return shortId.includes(q) || name.includes(q) || phone.includes(q);
  });

  const loadOrders = useCallback(async () => {
    setTimeout(() => setLoading(true), 0);
    const { data, total, totalPages, error } = await getOrders(
      currentSearch,
      currentPage,
      10,
      { status: currentStatus, sort: currentSort, date: currentDate }
    );
    if (!error && data) {
      setOrders(data);
      setTotal(total);
      setTotalPages(totalPages);
    }

    // Lọc bỏ các ID đơn hàng unread đã bị xóa khỏi CSDL
    const unreadList = Array.from(getUnreadFromStorage());
    if (unreadList.length > 0) {
      const { data: existingOrders } = await supabase
        .from("orders")
        .select("id")
        .in("id", unreadList);
      if (existingOrders) {
        const validIds = new Set(existingOrders.map((o) => o.id));
        const cleanedList = unreadList.filter((id) => validIds.has(id));
        if (cleanedList.length !== unreadList.length) {
          try {
            localStorage.setItem("admin_unread_order_ids", JSON.stringify(cleanedList));
          } catch { }
        }
        setLiveOrderIds(validIds);
      } else {
        setLiveOrderIds(getUnreadFromStorage());
      }
    } else {
      setLiveOrderIds(new Set());
    }
    setLoading(false);
    fetchOrderAlerts();
  }, [currentSearch, currentPage, currentStatus, currentSort, currentDate, fetchOrderAlerts]);

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all" && value !== "newest" && value !== "") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    router.push(pathname);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadOrders();

    const channel = supabase
      .channel("dashboard-orders-table-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders" }, (payload) => {
        if (payload.new?.id) {
          setLiveOrderIds((prev) => new Set(prev).add(payload.new.id));
        }
        loadOrders();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        loadOrders();
      })
      .on("broadcast", { event: "NEW_ORDER" }, (payload) => {
        if (payload.payload?.id) {
          setLiveOrderIds((prev) => new Set(prev).add(payload.payload.id));
        }
        loadOrders();
      })
      .on("broadcast", { event: "ORDER_UPDATED" }, () => {
        loadOrders();
      })
      .subscribe();

    const handleLocalOrder = (event: any) => {
      if (event.detail?.id) {
        try {
          const list = JSON.parse(localStorage.getItem("admin_unread_order_ids") || "[]");
          if (!list.includes(event.detail.id)) {
            list.push(event.detail.id);
            localStorage.setItem("admin_unread_order_ids", JSON.stringify(list));
          }
        } catch { }
        setLiveOrderIds(getUnreadFromStorage());
        loadOrders();
      }
    };
    window.addEventListener("ADMIN_LOCAL_NEW_ORDER", handleLocalOrder);

    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && window.BroadcastChannel) {
      bc = new BroadcastChannel("admin_orders_channel");
      bc.onmessage = (event) => {
        if (event.data?.type === "NEW_ORDER" && event.data.order?.id) {
          try {
            const list = JSON.parse(localStorage.getItem("admin_unread_order_ids") || "[]");
            if (!list.includes(event.data.order.id)) {
              list.push(event.data.order.id);
              localStorage.setItem("admin_unread_order_ids", JSON.stringify(list));
            }
          } catch { }
          setLiveOrderIds(getUnreadFromStorage());
        }
        loadOrders();
      };
    }

    return () => {
      window.removeEventListener("ADMIN_LOCAL_NEW_ORDER", handleLocalOrder);
      supabase.removeChannel(channel);
      if (bc) bc.close();
    };
  }, [loadOrders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchInput) params.set("search", searchInput);
    else params.delete("search");
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const { error } = await updateOrderStatus(id, newStatus);
    if (error) {
      alert("Lỗi khi cập nhật trạng thái");
    } else {
      loadOrders(); // Reload sau khi đổi trạng thái
    }
  };

  const handleDeleteOrder = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    const { error } = await deleteOrderAdmin(deleteId);
    setIsDeleting(false);
    setDeleteId(null);
    if (error) {
      toast.error("Lỗi khi xóa đơn hàng!");
    } else {
      try {
        const unread = JSON.parse(localStorage.getItem("admin_unread_order_ids") || "[]");
        const next = unread.filter((item: string) => item !== deleteId);
        localStorage.setItem("admin_unread_order_ids", JSON.stringify(next));
      } catch { }
      setLiveOrderIds((prev) => {
        const next = new Set(prev);
        if (deleteId) next.delete(deleteId);
        return next;
      });
      toast.success("Đã xóa đơn hàng thành công!");
      loadOrders();
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      const unread = JSON.parse(localStorage.getItem("admin_unread_order_ids") || "[]");
      const next = unread.filter((item: string) => item !== id);
      localStorage.setItem("admin_unread_order_ids", JSON.stringify(next));
    } catch { }
    setLiveOrderIds(getUnreadFromStorage());
    setDetailOpen(true);
    setLoadingDetail(true);
    const { data, error } = await getOrderById(id);
    if (!error && data) {
      setSelectedOrder(data);
    }
    setLoadingDetail(false);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="space-y-6 pb-8 animate-fade-in">
      {/* Header */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_10px_40px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[60px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-[60px] pointer-events-none -translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mb-1">Quản lý Đơn hàng</h1>
          <p className="text-sm font-medium text-muted-foreground mt-1">Theo dõi và cập nhật trạng thái đơn hàng của hệ thống.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="flex w-full overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-auto p-1.5 gap-2 justify-start sm:grid sm:grid-cols-2 sm:max-w-md bg-muted/50 rounded-full border border-border/50 shadow-inner">
          <TabsTrigger value="orders-list" className="gap-2 shrink-0 px-4 py-2.5 text-xs sm:text-sm font-bold flex-1 cursor-pointer rounded-full data-[state=active]:bg-background data-[state=active]:shadow-md data-[state=active]:text-foreground transition-all">
            <IconReceipt className="size-4 shrink-0" />
            <span>Danh sách Đơn hàng</span>
          </TabsTrigger>
          <TabsTrigger value="order-logs" onClick={fetchOrderAlerts} className="gap-2 shrink-0 px-4 py-2.5 text-xs sm:text-sm font-bold flex-1 relative text-emerald-600 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md rounded-full transition-all cursor-pointer">
            <BellRing className="size-4 shrink-0" />
            <span>Nhật ký</span>
            {liveOrderIds.size > 0 && (
              <span className="flex h-2 w-2 relative ml-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders-list" className="space-y-6">
          <div className="bg-card/50 backdrop-blur-xl border border-border/50 shadow-sm rounded-[24px] overflow-hidden p-6 space-y-6">
            {/* Bộ lọc Nhanh dạng Thẻ Trạng Thái (Status Quick Tabs) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none border-b border-border/50">
              <button
                onClick={() => updateFilter("status", "all")}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-xs shrink-0 transition-all cursor-pointer ${currentStatus === "all"
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/50"
                  }`}
              >
                <IconFilter className="w-3.5 h-3.5" /> Tất cả đơn hàng
              </button>
              {Object.entries(STATUS_MAP).map(([key, info]) => {
                const isActive = currentStatus === key;
                return (
                  <button
                    key={key}
                    onClick={() => updateFilter("status", key)}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full font-bold text-xs shrink-0 transition-all cursor-pointer border ${isActive
                      ? `${info.color} shadow-md font-extrabold ring-2 ring-primary/20 scale-[1.02]`
                      : "bg-background/50 text-muted-foreground border-border/50 hover:bg-muted hover:text-foreground"
                      }`}
                  >
                    {info.label}
                  </button>
                );
              })}
            </div>

            {/* Thanh Bộ Lọc Kết Hợp (Search + Date + Sort + Reset) */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2 w-full sm:min-w-[260px]">
                <div className="relative w-full sm:max-w-md group">
                  <Image src="/icons/search.png" alt="Search" width={20} height={20} className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <Input
                    placeholder="Tìm theo Mã, tên khách, email..."
                    className="pl-10 rounded-full h-11 bg-background/50 border-border/50 hover:bg-secondary transition-colors focus-visible:ring-primary/30 shadow-md text-sm w-full"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </div>
                <Button type="submit" variant="secondary" className="h-11 px-6 rounded-full font-bold shrink-0 cursor-pointer shadow-md border border-border/50 hover:bg-secondary w-full sm:w-auto">
                  Tìm kiếm
                </Button>
              </form>

              <div className="flex flex-wrap items-center gap-3">
                {/* Bộ lọc thời gian */}
                <div className="flex items-center">
                  <Select value={currentDate} onValueChange={(val) => updateFilter("date", val)}>
                    <SelectTrigger className="w-[160px] h-11 rounded-full bg-background/50 border-border/50 hover:bg-secondary transition-colors font-semibold text-xs shadow-md focus:ring-primary/30">
                      <div className="flex items-center gap-2 truncate">
                        <IconCalendar className="w-4 h-4 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="Thời gian" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 shadow-xl">
                      <SelectItem value="all" className="rounded-xl cursor-pointer">Mọi thời điểm</SelectItem>
                      <SelectItem value="today" className="rounded-xl cursor-pointer">Hôm nay</SelectItem>
                      <SelectItem value="7days" className="rounded-xl cursor-pointer">7 ngày qua</SelectItem>
                      <SelectItem value="30days" className="rounded-xl cursor-pointer">30 ngày qua</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Sắp xếp */}
                <div className="flex items-center">
                  <Select value={currentSort} onValueChange={(val) => updateFilter("sort", val)}>
                    <SelectTrigger className="w-[170px] h-11 rounded-full bg-background/50 border-border/50 hover:bg-secondary transition-colors font-semibold text-xs shadow-md focus:ring-primary/30">
                      <div className="flex items-center gap-2 truncate">
                        <IconArrowsSort className="w-4 h-4 text-muted-foreground shrink-0" />
                        <SelectValue placeholder="Sắp xếp" />
                      </div>
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-border/50 shadow-xl">
                      <SelectItem value="newest" className="rounded-xl cursor-pointer">Mới nhất trước</SelectItem>
                      <SelectItem value="oldest" className="rounded-xl cursor-pointer">Cũ nhất trước</SelectItem>
                      <SelectItem value="amount_desc" className="rounded-xl cursor-pointer">Giá trị cao nhất</SelectItem>
                      <SelectItem value="amount_asc" className="rounded-xl cursor-pointer">Giá trị thấp nhất</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Nút xóa bộ lọc */}
                {(currentStatus !== "all" || currentDate !== "all" || currentSort !== "newest" || currentSearch !== "") && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-11 px-4 rounded-full text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1.5 shrink-0 cursor-pointer transition-all border border-transparent hover:border-red-200 dark:hover:border-red-900"
                  >
                    <IconX className="w-4 h-4" /> Xóa bộ lọc
                  </Button>
                )}
              </div>
            </div>

            {/* Floating Explosion Banner khi có nhiều đơn hàng mới nổ trong phiên */}
            {liveOrderIds.size > 0 && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 rounded-[20px] border border-emerald-500/30 bg-emerald-500/15 backdrop-blur-xl shadow-lg shadow-emerald-500/10 animate-in slide-in-from-top-2 duration-500 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-emerald-400/20 rounded-full blur-[40px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
                <div className="flex items-center gap-3 text-emerald-800 dark:text-emerald-300 relative z-10">
                  <span className="relative flex h-3.5 w-3.5 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                  </span>
                  <span className="text-sm font-bold">
                    ✨ Có {liveOrderIds.size} đơn hàng mới vừa được đặt mua! Vui lòng kiểm tra các đơn hàng được đánh dấu bên dưới!
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    try { localStorage.removeItem("admin_unread_order_ids"); } catch { }
                    setLiveOrderIds(new Set());
                  }}
                  className="h-9 border-emerald-500/50 hover:bg-emerald-500 hover:text-white text-xs font-bold shrink-0 cursor-pointer transition-all shadow-sm rounded-full px-5 relative z-10 bg-background/50 backdrop-blur-sm"
                >
                  Đánh dấu đã đọc tất cả
                </Button>
              </div>
            )}

            <div className="bg-background/30 rounded-[24px] border border-border/50 overflow-hidden shadow-sm flex flex-col">
              <div className="overflow-x-auto">
                <Table className="min-w-[800px]">
                <TableHeader className="bg-muted/30">
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead className="w-[110px] font-bold text-foreground h-12">Mã đơn</TableHead>
                    <TableHead className="font-bold text-foreground h-12">Khách hàng</TableHead>
                    <TableHead className="w-[160px] font-bold text-foreground h-12">Thanh toán</TableHead>
                    <TableHead className="font-bold text-foreground h-12">Ngày đặt</TableHead>
                    <TableHead className="font-bold text-foreground h-12">Tổng tiền</TableHead>
                    <TableHead className="font-bold text-foreground h-12">Trạng thái</TableHead>
                    <TableHead className="text-right font-bold text-foreground h-12">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center">
                        <IconLoader2 className="mx-auto h-8 w-8 animate-spin text-muted-foreground/50" />
                      </TableCell>
                    </TableRow>
                  ) : orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                        Không tìm thấy đơn hàng nào.
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => {
                      const isLiveNew = liveOrderIds.has(order.id);
                      const paymentObj = Array.isArray((order as any).payments) ? ((order as any).payments.length > 0 ? (order as any).payments[0] : null) : (order as any).payments;
                      const isBanking = order.payment_method === "banking" || (order.payment_method !== "cod" && !!paymentObj);
                      const paymentCode = paymentObj?.payment_code;
                      const payStatus = paymentObj?.status;

                      return (
                        <TableRow
                          key={order.id}
                          className={`border-border/50 transition-colors duration-300 hover:bg-muted/30 ${isLiveNew
                            ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-l-4 border-l-emerald-500"
                            : ""
                            }`}
                        >
                          <TableCell className="font-mono font-bold text-xs uppercase" title={order.id}>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {isLiveNew && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-emerald-500 text-white animate-pulse shadow-sm shrink-0">
                                  MỚI
                                </span>
                              )}
                              <span>#{order.id.split("-")[0]}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-semibold text-sm">{order.profiles?.full_name || "Chưa xác định tên"}</div>
                            <div className="text-xs text-muted-foreground mt-0.5">{order.profiles?.email}</div>
                          </TableCell>
                          <TableCell>
                            {isBanking ? (
                              <div className="flex flex-col gap-1.5 items-start">
                                <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500 gap-1.5 px-2 rounded-lg font-semibold shadow-sm">
                                  <Image src="/icons/card2.png" alt="VietQR" width={16} height={16} /> VietQR
                                </Badge>
                                <div className="flex items-center gap-1.5 pl-0.5">
                                  {order.status === "cancelled" ? (
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-red-600 dark:text-red-400">
                                      <span className="size-1.5 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"></span>
                                      Đã hủy
                                    </span>
                                  ) : payStatus === "MATCHED" || payStatus === "MANUAL" ? (
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                      <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                                      Đã thanh toán
                                    </span>
                                  ) : payStatus === "EXPIRED" ? (
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-red-600 dark:text-red-400">
                                      <span className="size-1.5 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"></span>
                                      Hết hạn
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400" title={`Chuyển khoản VietQR: ${paymentCode || "Chờ tạo mã"}`}>
                                      <span className="size-1.5 rounded-full bg-amber-500 animate-pulse shadow-[0_0_4px_rgba(245,158,11,0.5)]"></span>
                                      Chờ chuyển khoản
                                    </span>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex flex-col gap-1.5 items-start">
                                <Badge variant="outline" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500 gap-1.5 px-2 rounded-lg font-semibold shadow-sm">
                                  <Image src="/icons/cash-on-delivery.png" alt="COD" width={16} height={16} /> 
                                  Thu hộ (COD)
                                </Badge>
                                <div className="flex items-center gap-1.5 pl-0.5">
                                  {order.status === "cancelled" ? (
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-red-600 dark:text-red-400">
                                      <span className="size-1.5 rounded-full bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"></span>
                                      Đã hủy
                                    </span>
                                  ) : (order.status === "delivered" || order.status === "completed") ? (
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                                      <span className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_rgba(16,185,129,0.5)]"></span>
                                      Đã thu tiền
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                                      <span className="size-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_4px_rgba(59,130,246,0.5)]"></span>
                                      Khi nhận hàng
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {format(new Date(order.created_at), "dd/MM/yyyy HH:mm")}
                          </TableCell>
                          <TableCell className="font-bold text-primary text-sm">
                            {formatCurrency(order.total_amount)}
                          </TableCell>
                          <TableCell>
                            <Select
                              value={order.status}
                              onValueChange={(val) => handleStatusChange(order.id, val)}
                            >
                              <SelectTrigger className={`h-8 rounded-full text-xs font-semibold ${STATUS_MAP[order.status]?.color} border-0 shadow-sm w-[130px]`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-border/50">
                                {Object.entries(STATUS_MAP).map(([key, info]) => (
                                  <SelectItem key={key} value={key} className="rounded-lg text-xs font-medium cursor-pointer">
                                    {info.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => handleViewDetails(order.id)} title="Xem chi tiết" className="h-8 w-8 rounded-full hover:bg-blue-500/10 hover:text-blue-600 transition-colors">
                                <IconEye className="h-4 w-4" />
                              </Button>
                              {role === "admin" && (
                                <Button variant="ghost" size="icon" onClick={() => setDeleteId(order.id)} title="Xóa đơn hàng" className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-600 transition-colors">
                                  <IconTrash className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 pt-6 pb-4 border-t border-border/50">
                  <div className="text-sm font-medium text-muted-foreground bg-secondary/50 px-4 py-1.5 rounded-full border border-border/50 w-full sm:w-auto text-center">
                    Trang {currentPage} / {totalPages}
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto justify-center sm:justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage <= 1}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set("page", String(currentPage - 1));
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                      className="rounded-full px-4 border-border/50 hover:bg-secondary shadow-sm"
                    >
                      Trang trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentPage >= totalPages}
                      onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set("page", String(currentPage + 1));
                        router.push(`${pathname}?${params.toString()}`);
                      }}
                      className="rounded-full px-4 border-border/50 hover:bg-secondary shadow-sm"
                    >
                      Trang sau
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="order-logs" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-xl border border-border/50 shadow-sm rounded-[24px] overflow-hidden">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 border-b border-border/50 bg-muted/20">
              <div>
                <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-lg sm:text-xl font-extrabold">
                  <BellRing className="size-5 shrink-0" /> Nhật Ký Đơn Hàng & Cảnh Báo
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm mt-1">
                  Toàn bộ lịch sử các thông báo đơn hàng mới được đẩy Realtime tới Admin.
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-72 shrink-0 group">
                <IconSearch className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <Input
                  placeholder="Tìm mã đơn, tên khách, SĐT..."
                  value={orderAlertSearch}
                  onChange={(e) => setOrderAlertSearch(e.target.value)}
                  className="pl-10 h-11 rounded-full bg-background/80 border-border/50 focus-visible:ring-emerald-500/30 text-xs sm:text-sm shadow-sm"
                />
              </div>
            </CardHeader>
            <CardContent className="px-6 bg-background/30">
              {loadingOrderAlerts ? (
                <div className="flex justify-center py-12">
                  <IconLoader2 className="size-8 animate-spin text-emerald-500/50" />
                </div>
              ) : filteredOrderAlerts.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm font-medium">
                  {orderAlertSearch ? "Không tìm thấy đơn hàng nào khớp từ khóa." : "Chưa có đơn hàng nào được ghi nhận."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrderAlerts.map((o) => {
                    const shortId = o.id ? o.id.split("-")[0].toUpperCase() : "ORD";
                    const isCancelled = o.status === "cancelled";
                    const isLiveNew = liveOrderIds.has(o.id);
                    return (
                      <div key={o.id} className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-300 shadow-sm hover:shadow-md ${isLiveNew ? "bg-emerald-500/10 dark:bg-emerald-500/15 border-emerald-500/50" : "bg-card/80 hover:bg-muted/50 border-border/50 hover:border-emerald-500/30"
                        }`}>
                        <div className="flex items-start sm:items-center gap-4">
                          <div className={`p-3 rounded-full shrink-0 shadow-sm ${isCancelled ? "bg-red-500/10 text-red-600 dark:text-red-400" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                            <BellRing className="size-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              {isLiveNew && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white animate-pulse shadow-sm shrink-0">
                                  MỚI
                                </span>
                              )}
                              <span className="font-bold text-sm">#{shortId}</span>
                              <Badge variant={isCancelled ? "destructive" : "secondary"} className="text-[10px] h-5 rounded-full px-2 shadow-sm font-semibold">
                                {isCancelled ? "Đã hủy đơn" : STATUS_MAP[o.status]?.label || "Đơn mới nhận"}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">
                              Khách hàng: <span className="font-semibold text-foreground">{o.profiles?.full_name || o.addresses?.full_name || o.profiles?.email?.split("@")[0] || "Khách mua"}</span>
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                              Số điện thoại: <span className="font-semibold text-foreground">{o.addresses?.phone || o.profiles?.phone || "Chưa cập nhật SĐT"}</span>
                            </p>
                            <p className="text-[11px] text-muted-foreground/80 mt-1.5 font-medium">
                              {o.created_at ? format(new Date(o.created_at), "dd/MM/yyyy HH:mm:ss") : ""}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:items-end justify-between sm:justify-center gap-3 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-border/50">
                          <span className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                            +{Number(o.total_amount || 0).toLocaleString("vi-VN")} đ
                          </span>
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 w-full sm:w-auto">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleViewDetails(o.id)}
                              className="gap-1.5 text-xs h-9 rounded-full px-4 shrink-0 cursor-pointer border-border/50 hover:bg-blue-500/10 hover:text-blue-600 transition-colors shadow-sm w-full sm:w-auto"
                            >
                              <IconEye className="size-4" /> Xem chi tiết
                            </Button>
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => {
                                setActiveTab("orders-list");
                                updateFilter("search", o.id.split("-")[0]);
                              }}
                              className="gap-1.5 text-xs h-9 rounded-full px-4 shrink-0 bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20 cursor-pointer transition-all w-full sm:w-auto"
                            >
                              Mở trong bảng
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={detailOpen} onOpenChange={setDetailOpen} >
        <DialogContent className="sm:max-w-2xl md:max-w-4xl max-h-[90vh] overflow-hidden p-0 bg-card/95 backdrop-blur-2xl border-border/50 shadow-2xl rounded-[24px] flex flex-col animate__animated animate__zoomIn">
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
            <DialogHeader className="pr-12 text-left">
              <DialogTitle className="flex items-start sm:items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl font-extrabold text-foreground min-w-0">
                <IconReceipt className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-500 shrink-0 mt-0.5 sm:mt-0" />
                <span className="truncate flex-1">Chi tiết Đơn hàng #{selectedOrder?.id?.split("-")[0].toUpperCase()}</span>
              </DialogTitle>
            </DialogHeader>

            {loadingDetail ? (
              <div className="flex justify-center py-12">
                <IconLoader2 className="h-10 w-10 animate-spin text-emerald-500/50" />
              </div>
            ) : selectedOrder ? (
              <div className="flex flex-col gap-6 min-w-0 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
                  <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 sm:p-5 shadow-sm flex flex-col">
                    <h3 className="font-bold mb-3 sm:mb-4 text-sm md:text-base flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-blue-500 rounded-full shrink-0"></span> Thông tin Khách hàng
                    </h3>
                    <div className="space-y-2.5 sm:space-y-3 text-[13px] md:text-sm mt-auto">
                      <p className="flex justify-between gap-3"><span className="text-muted-foreground font-medium shrink-0">Tên:</span> <span className="font-semibold text-right break-words line-clamp-2">{selectedOrder.profiles?.full_name}</span></p>
                      <p className="flex justify-between gap-3"><span className="text-muted-foreground font-medium shrink-0">Email:</span> <span className="font-semibold text-right break-all line-clamp-2">{selectedOrder.profiles?.email}</span></p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/50 bg-muted/20 p-4 sm:p-5 shadow-sm flex flex-col">
                    <h3 className="font-bold mb-3 sm:mb-4 text-sm md:text-base flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-purple-500 rounded-full shrink-0"></span> Địa chỉ Giao hàng
                    </h3>
                    {selectedOrder.addresses ? (
                      <div className="space-y-2.5 sm:space-y-3 text-[13px] md:text-sm mt-auto">
                        <p className="flex justify-between gap-3"><span className="text-muted-foreground font-medium shrink-0">Người nhận:</span> <span className="font-semibold text-right break-words line-clamp-2">{selectedOrder.addresses.full_name || selectedOrder.profiles?.full_name}</span></p>
                        <p className="flex justify-between gap-3"><span className="text-muted-foreground font-medium shrink-0">SĐT:</span> <span className="font-semibold text-right">{selectedOrder.addresses.phone}</span></p>
                        <p className="flex justify-between gap-3"><span className="text-muted-foreground font-medium shrink-0">Địa chỉ:</span> <span className="font-semibold text-right break-words line-clamp-3" title={`${selectedOrder.addresses.street}, ${selectedOrder.addresses.city}`}>{selectedOrder.addresses.street}, {selectedOrder.addresses.city}</span></p>
                      </div>
                    ) : (
                      <p className="text-[13px] md:text-sm text-muted-foreground font-medium mt-auto">Không có dữ liệu địa chỉ.</p>
                    )}
                  </div>
                </div>

                {(() => {
                  const detailPaymentObj = Array.isArray(selectedOrder.payments) ? (selectedOrder.payments.length > 0 ? selectedOrder.payments[0] : null) : selectedOrder.payments;
                  const isDetailBanking = selectedOrder.payment_method === "banking" || (selectedOrder.payment_method !== "cod" && !!detailPaymentObj);
                  const isCancelled = selectedOrder.status === 'cancelled';

                  if (isDetailBanking) {
                    return (
                      <div className="rounded-2xl border-4 border-amber-600 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                        <div>
                          <h3 className="font-extrabold text-amber-700 dark:text-amber-400 text-sm flex items-center gap-2">
                            <span>💳 Chuyển khoản VietQR</span>
                          </h3>
                          <p className="text-xs font-medium text-amber-700/80 dark:text-amber-400/80 mt-1.5">
                            Mã đối chiếu: <strong className="font-mono text-amber-900 dark:text-amber-200 text-sm bg-amber-500/10 px-2 py-0.5 rounded-full ml-1">{detailPaymentObj?.payment_code || "Chờ tạo mã"}</strong>
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase shadow-sm ${
                            isCancelled
                              ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400'
                              : detailPaymentObj?.status === 'MATCHED' || detailPaymentObj?.status === 'MANUAL'
                              ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                              : detailPaymentObj?.status === 'EXPIRED'
                                ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400'
                                : 'bg-amber-500/20 text-amber-700 dark:text-amber-400'
                            }`}>
                            {isCancelled ? '✕ Đã hủy' : detailPaymentObj?.status === 'MATCHED' ? '✓ Đã nhận tiền' : detailPaymentObj?.status === 'MANUAL' ? '✓ Xác nhận thủ công' : detailPaymentObj?.status === 'EXPIRED' ? '✕ Hết hạn' : '🕒 Chờ thanh toán'}
                          </span>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div className="rounded-2xl border border-border/80 bg-background/50 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                      <div>
                        <h3 className="font-extrabold text-foreground text-sm flex items-center gap-2">
                          <span>📦 Thanh toán khi nhận hàng (COD)</span>
                        </h3>
                        <p className="text-xs font-medium text-muted-foreground mt-1.5">
                          Thu tiền mặt khi Shipper giao hàng thành công.
                        </p>
                      </div>
                      <div className="text-left sm:text-right">
                        <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase shadow-sm ${
                          isCancelled
                            ? 'bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                            : (selectedOrder.status === 'delivered' || selectedOrder.status === 'completed')
                            ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                            : 'bg-muted border border-border text-foreground'
                          }`}>
                          {isCancelled ? '✕ Đã hủy' : (selectedOrder.status === 'delivered' || selectedOrder.status === 'completed') ? '✓ Đã thu tiền' : '🕒 Chờ thu tiền'}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <div>
                  <h3 className="font-extrabold mb-4 flex items-center gap-2 text-sm md:text-base">
                    <Image src={"/icons/product_black.png"} alt="box" width={20} height={20} className="w-5 h-5 text-primary shrink-0 dark:hidden" /> 
                    <Image src={"/icons/product_white.png"} alt="box" width={20} height={20} className="w-5 h-5 text-primary shrink-0 hidden dark:block" /> 
                    Danh sách sản phẩm
                  </h3>
                  <div className="rounded-[16px] border border-border/50 overflow-hidden shadow-sm bg-background/30 flex flex-col min-w-0 w-full">
                    <div className="overflow-x-auto w-full">
                      <Table className="min-w-[600px] w-full">
                      <TableHeader className="bg-muted/30">
                        <TableRow className="hover:bg-transparent border-border/50">
                          <TableHead className="font-bold text-foreground h-12">Sản phẩm</TableHead>
                          <TableHead className="font-bold text-foreground h-12">Biến thể</TableHead>
                          <TableHead className="text-right font-bold text-foreground h-12">Đơn giá</TableHead>
                          <TableHead className="text-center font-bold text-foreground h-12">SL</TableHead>
                          <TableHead className="text-right font-bold text-foreground h-12">Thành tiền</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.order_items?.map((item: any) => (
                          <TableRow key={item.id} className="border-border/50 hover:bg-muted/30 transition-colors">
                            <TableCell className="flex items-center gap-4">
                              <Image width={40} height={40} unoptimized src={item.products?.image_url || "https://placehold.co/100x100"} alt="img" className="h-12 w-12 rounded-sm p-1 object-cover border border-border/50 shadow-sm shrink-0" />
                              <span className="font-semibold line-clamp-2">{item.products?.name}</span>
                            </TableCell>
                            <TableCell className="text-xs md:text-sm text-muted-foreground font-medium">
                              {Array.isArray(item.product_variants) 
                                ? item.product_variants[0]?.name || "-"
                                : item.product_variants?.name || "-"}
                            </TableCell>
                            <TableCell className="text-right text-xs md:text-sm font-semibold text-muted-foreground whitespace-nowrap">
                              {formatCurrency(item.price)}
                            </TableCell>
                            <TableCell className="text-center text-xs md:text-sm font-bold bg-muted/20">
                              x{item.quantity}
                            </TableCell>
                            <TableCell className="text-right text-xs md:text-sm font-extrabold text-primary whitespace-nowrap">
                              {formatCurrency(item.price * item.quantity)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <div className="w-full sm:w-72 space-y-3 bg-muted/20 p-5 rounded-2xl border border-border/50 shadow-sm text-sm">
                      {selectedOrder.coupons && (
                        <div className="flex justify-between text-emerald-600 font-semibold">
                          <span>Giảm giá ({selectedOrder.coupons.code}):</span>
                          <span>-{selectedOrder.coupons.discount_percent}%</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-border/50 pt-3 font-extrabold text-lg md:text-xl items-center">
                        <span>Tổng:</span>
                        <span className="text-primary">{formatCurrency(selectedOrder.total_amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      {role === "admin" && (
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)] rounded-[24px] animate__animated animate__bounceIn">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl text-red-600 flex items-center gap-2">
                <IconTrash className="size-6" />
                Xóa đơn hàng
              </AlertDialogTitle>
              <AlertDialogDescription className="text-sm font-medium">
                Hành động này sẽ xóa vĩnh viễn đơn hàng <strong className="text-foreground">#{deleteId?.split("-")[0].toUpperCase()}</strong> cùng tất cả danh sách sản phẩm bên trong khỏi cơ sở dữ liệu và không thể khôi phục.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 mt-4">
              <AlertDialogCancel disabled={isDeleting} className="rounded-full border-border/50 hover:bg-secondary h-11 px-6 font-semibold">
                Hủy
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteOrder}
                disabled={isDeleting}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full h-11 px-6 shadow-lg shadow-red-600/20 transition-all font-semibold"
              >
                {isDeleting ? (
                  <>
                    <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa vĩnh viễn"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <RoleGuard allowedRoles={["admin", "staff"]}>
      <Suspense fallback={<div>Loading orders...</div>}>
        <OrdersContent />
      </Suspense>
    </RoleGuard>
  );
}
