"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  RefreshCw,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Calendar,
  FileSpreadsheet,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { getDashboardStats, DashboardStats } from "@/lib/services/dashboard.service";
import { useAuth } from "@/components/providers/auth-provider";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface DashboardViewProps {
  initialStats: DashboardStats;
}

export function DashboardView({ initialStats }: DashboardViewProps) {
  const { role } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(initialStats);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRealData = useCallback(async () => {
    setIsRefreshing(true);
    const data = await getDashboardStats();
    setStats(data);
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      fetchRealData();
    });
  }, [fetchRealData]);

  const handleRefresh = () => {
    fetchRealData();
    router.refresh();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã thanh toán
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Hoàn thành
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <Clock className="w-3.5 h-3.5" /> Đang chuẩn bị
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <CheckCircle2 className="w-3.5 h-3.5" /> Đã giao hàng
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> Chờ xác nhận
          </span>
        );
      case "shipping":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 border border-purple-500/20">
            <Clock className="w-3.5 h-3.5" /> Đang giao
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-500/10 text-gray-600 border border-gray-500/20">
            {status || "Đã hủy"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-6 animate-in fade-in-50 duration-700 slide-in-from-bottom-4">
      {/* 1. Header & Nút thao tác */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[80px] pointer-events-none translate-x-1/3 -translate-y-1/3 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

        <div className="space-y-2 z-10 relative">

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground drop-shadow-sm">
            Tổng quan kinh doanh
          </h1>
          <p className="text-muted-foreground font-medium text-sm sm:text-base">
            Cập nhật số liệu thời gian thực và theo dõi dòng tiền hệ thống một cách trực quan nhất.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10 relative w-full sm:w-auto mt-2 sm:mt-0">
          <Button
            variant="secondary"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="rounded-2xl h-12 px-6 font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 bg-white text-primary dark:text-primary-foreground hover:bg-white/90 w-full sm:w-auto"
          >
            <RefreshCw
              className={cn("w-5 h-5 ", isRefreshing && "animate-spin")}
            />
            {isRefreshing ? "Đang tải..." : "Làm mới số liệu"}
          </Button>
        </div>
      </div>

      {/* 2. Các thông số chính (KPIs) */}
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 relative", role !== "admin" && " pointer-events-none")}>
        {role === "admin" ? (
          <>
            {/* Thẻ 1: Doanh thu */}
            <div className="p-5 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Doanh thu ròng</span>
                <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 text-emerald-600 flex items-center justify-center font-bold shadow-inner ring-1 ring-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Image src="/icons/revenue.png" alt="VNĐ" width={50} height={50} />
                </div>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-2xl sm:text-3xl xl:text-4xl font-black text-foreground tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-foreground to-foreground/70 truncate">
                  {formatCurrency(stats.totalRevenue)}
                </h3>
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                  (stats.revenueGrowth || 0) >= 0 ? "bg-emerald-500/5 text-emerald-600" : "bg-rose-500/5 text-rose-600"
                )}>
                  <TrendingUp className={cn("w-3.5 h-3.5", (stats.revenueGrowth || 0) < 0 && "rotate-180")} />
                  <span>
                    {(stats.revenueGrowth || 0) >= 0 ? `+${stats.revenueGrowth || 0}%` : `${stats.revenueGrowth}%`} so với 7 ngày trước
                  </span>
                </div>
              </div>
            </div>

            {/* Thẻ 2: Đơn hàng */}
            <div className="p-5 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tổng đơn hàng</span>
                <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-blue-400/10 to-blue-600/10 text-blue-600 flex items-center justify-center font-bold shadow-inner ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Image src="/icons/order.png" alt="VNĐ" width={50} height={50} />
                </div>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter flex items-baseline gap-1 truncate">
                  {stats.totalOrders} <span className="text-sm sm:text-base font-semibold text-muted-foreground">đơn</span>
                </h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/5 text-amber-600">
                  <Clock className="w-3.5 h-3.5 animate-pulse" />
                  <span>{stats.pendingOrders} đơn chờ duyệt</span>
                </div>
              </div>
            </div>

            {/* Thẻ 3: Khách hàng */}
            <div className="p-5 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Khách hàng VIP</span>
                <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-purple-400/10 to-purple-600/10 text-purple-600 flex items-center justify-center font-bold shadow-inner ring-1 ring-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Image src="/icons/customer.png" alt="VNĐ" width={50} height={50} />
                </div>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter flex items-baseline gap-1 truncate">
                  {stats.totalCustomers} <span className="text-sm sm:text-base font-semibold text-muted-foreground">tài khoản</span>
                </h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/5 text-purple-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cộng đồng mua sắm tích cực</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Thẻ Staff 1: Tổng đơn hàng */}
            <div className="p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Tổng đơn hàng</span>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400/20 to-blue-600/20 text-blue-600 flex items-center justify-center font-bold shadow-inner ring-1 ring-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                  <ShoppingCart className="w-7 h-7" />
                </div>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter flex items-baseline gap-1 truncate">
                  {stats.totalOrders} <span className="text-sm sm:text-base font-semibold text-muted-foreground">đơn</span>
                </h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600">
                  <span>Toàn bộ hệ thống</span>
                </div>
              </div>
            </div>

            {/* Thẻ Staff 2: Chờ xử lý */}
            <div className="p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Đơn chờ duyệt</span>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400/20 to-amber-600/20 text-amber-600 flex items-center justify-center font-bold shadow-inner ring-1 ring-amber-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Clock className="w-7 h-7 animate-pulse" />
                </div>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tighter flex items-baseline gap-1 truncate">
                  {stats.pendingOrders} <span className="text-sm sm:text-base font-semibold text-muted-foreground">đơn</span>
                </h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600">
                  <span>Cần xác nhận ngay</span>
                </div>
              </div>
            </div>

             {/* Thẻ 3: Khách hàng */}
            <div className="p-5 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 relative overflow-hidden group">
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Khách hàng VIP</span>
                <div className="w-15 h-15 rounded-2xl bg-gradient-to-br from-purple-400/10 to-purple-600/10 text-purple-600 flex items-center justify-center font-bold shadow-inner ring-1 ring-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                  <Image src="/icons/customer.png" alt="VNĐ" width={50} height={50} />
                </div>
              </div>
              <div className="space-y-2 relative z-10">
                <h3 className="text-3xl sm:text-4xl font-black text-foreground tracking-tighter flex items-baseline gap-1 truncate">
                  {stats.totalCustomers} <span className="text-sm sm:text-base font-semibold text-muted-foreground">tài khoản</span>
                </h3>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/5 text-purple-600">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Cộng đồng mua sắm tích cực</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Khu vực Biểu đồ & Đơn hàng mới nhất */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Biểu đồ (Chiếm 2 cột trên Desktop) */}
        {role === "admin" && (
          <div className="lg:col-span-2 flex flex-col">
            <div className="h-full p-5 sm:p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex flex-col relative overflow-hidden group">
              <div className="absolute -left-12 -top-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 relative z-10">
                <div className="space-y-1.5 w-full sm:w-auto">
                  <h2 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                    Biểu đồ doanh thu
                  </h2>
                  <p className="text-sm text-muted-foreground font-medium">Thống kê dòng tiền trong 7 ngày gần nhất</p>
                </div>

                <div className="flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-xl text-emerald-600 font-bold text-sm border border-emerald-500/20 shadow-sm w-full sm:w-auto justify-center">
                  <span className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Doanh thu (₫)
                  </span>
                </div>
              </div>

              <div className="w-full flex-1 min-h-[250px] sm:min-h-[300px] pt-4 relative z-10">
                {stats.chartData && stats.chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={stats.chartData}
                      margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="4 4" stroke="hsl(var(--muted-foreground))" opacity={0.2} vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 600 }}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis
                        tick={{ fill: '#a1a1aa', fontSize: 12, fontWeight: 600 }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                        dx={-10}
                      />
                      <Tooltip
                        formatter={(value: any) => [formatCurrency(Number(value || 0)), "Doanh thu"]}
                        labelStyle={{ fontWeight: "800", color: "hsl(var(--foreground))", marginBottom: "4px" }}
                        contentStyle={{
                          backgroundColor: "rgba(var(--card), 0.95)",
                          backdropFilter: "blur(12px)",
                          borderRadius: "16px",
                          border: "1px solid rgba(var(--border), 0.5)",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                          padding: "12px 16px",
                          color: "hsl(var(--foreground))"
                        }}
                        cursor={{ stroke: '#10b981', strokeWidth: 2, strokeDasharray: '4 4' }}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        strokeWidth={4}
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                        activeDot={{ r: 8, strokeWidth: 0, fill: '#10b981', style: { filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.8))' } }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/60 space-y-3">
                    <FileSpreadsheet className="w-12 h-12 opacity-20" />
                    <span className="text-sm font-semibold">Chưa có dữ liệu giao dịch gần đây</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Danh sách 5 đơn hàng mới nhất */}
        <div className={cn("h-full p-5 sm:p-6 rounded-[24px] bg-card/80 backdrop-blur-xl border border-border/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] flex flex-col justify-between space-y-6 relative overflow-hidden", role === "admin" ? "lg:col-span-1" : "lg:col-span-3")}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-foreground flex items-center gap-2">
                Đơn hàng mới nhất
              </h2>
              <Link
                href="/dashboard/orders"
                className="text-xs font-bold text-primary hover:text-primary-foreground hover:bg-primary border border-primary/20 transition-colors flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1.5 shadow-sm"
              >
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              Các giao dịch mới cần xử lý kịp thời
            </p>
          </div>

          <div className="space-y-3 relative z-10">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order: any) => {
                // thêm avatar
                const customerName =
                  order.profiles?.full_name || order.profiles?.email?.split("@")[0] || "Khách hàng";
                const avatarUrl = order.profiles?.avatar_url;

                return (
                  <div key={order.id} className="p-3 sm:p-4 rounded-[16px] bg-background/50 border border-border/40 hover:bg-muted/50 hover:border-border/80 transition-all group flex items-center justify-between gap-2 sm:gap-3">
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-[14px] bg-gradient-to-br from-primary/20 to-primary/5 text-primary font-black flex items-center justify-center shrink-0 uppercase text-base sm:text-lg shadow-inner ring-1 ring-primary/20 group-hover:scale-105 transition-transform overflow-hidden">
                        {avatarUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={avatarUrl} alt={customerName} className="w-full h-full object-cover" />
                        ) : (
                          customerName.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {customerName}
                        </p>
                        <p className="text-[10px] sm:text-xs font-medium text-muted-foreground truncate uppercase tracking-wider">
                          #{order.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0 flex flex-col items-end gap-1.5 sm:gap-2">
                      <p className="text-xs sm:text-sm font-black text-foreground">
                        {formatCurrency(Number(order.total_amount) || 0)}
                      </p>
                      <div>{getStatusBadge(order.status)}</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 bg-background/30 rounded-2xl border border-dashed border-border/60">
                <Package className="w-10 h-10 text-muted-foreground/30" />
                <span className="text-sm font-semibold text-muted-foreground/60">Chưa có đơn hàng nào</span>
              </div>
            )}
          </div>

          <Button asChild className="w-full rounded-2xl h-12 font-bold mt-auto shadow-md hover:shadow-lg transition-all" variant="default">
            <Link href="/dashboard/orders">Quản lý toàn bộ đơn hàng</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
