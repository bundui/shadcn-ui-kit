import { supabase } from "../supabase/client";

export interface DashboardStats {
  totalRevenue: number;
  revenueGrowth: number;
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: any[];
  chartData: { date: string; revenue: number; orders: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // 1. Lấy tổng số khách hàng (profiles) với role 'user' và tổng số sản phẩm (products)
    const { data: userRole } = await supabase.from('roles').select('id').eq('name', 'customer').single();
    
    const [customersRes, productsRes, allOrdersRes, recentOrdersRes] = await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role_id", userRole?.id),
      supabase.from("products").select("id", { count: "exact", head: true }),
      supabase.from("orders").select("id, total_amount, status, payment_method, created_at"),
      supabase
        .from("orders")
        .select("id, total_amount, status, payment_method, created_at, profiles(full_name, email, avatar_url)")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

    const totalCustomers = customersRes.count || 0;
    const totalProducts = productsRes.count || 0;
    const allOrders = allOrdersRes.data || [];
    const recentOrders = recentOrdersRes.data || [];

    // Hàm kiểm tra xem đơn hàng có đủ điều kiện ghi nhận doanh thu hay không
    const isOrderCountedInRevenue = (order: any): boolean => {
      if (!order || order.status === "cancelled" || order.status === "pending") return false;
      const status = order.status;
      const isBanking =
        order.payment_method === "banking" ||
        order.payment_method?.includes("VietQR") ||
        (order.payment_method && order.payment_method !== "cod");

      if (isBanking) {
        // Thanh toán tự động (VietQR/Banking): Ghi nhận ngay khi thanh toán xong (paid) & các bước tiếp theo (processing, shipping, delivered, completed)
        return status === "paid" || status === "processing" || status === "shipping" || status === "delivered" || status === "completed";
      } else {
        // Thanh toán COD: Ghi nhận khi bưu tá đã giao (delivered) hoặc khách xác nhận đã nhận hàng (completed) hay đã thu tiền (paid)
        return status === "delivered" || status === "completed" || status === "paid";
      }
    };

    // 2. Tính toán các chỉ số đơn hàng & doanh thu
    const totalOrders = allOrders.length;
    let pendingOrders = 0;
    let processingOrders = 0;
    let totalRevenue = 0;
    let thisWeekRevenue = 0;
    let lastWeekRevenue = 0;
    const nowTime = new Date().getTime();

    allOrders.forEach((order) => {
      if (order.status === "pending") {
        pendingOrders++;
      }
      if (order.status === "processing" || order.status === "shipping" || order.status === "paid") {
        processingOrders++;
      }
      if (isOrderCountedInRevenue(order)) {
        const amount = Number(order.total_amount) || 0;
        totalRevenue += amount;

        if (order.created_at) {
          const orderDate = new Date(order.created_at);
          const diffDays = (nowTime - orderDate.getTime()) / (1000 * 3600 * 24);
          if (diffDays <= 7) {
            thisWeekRevenue += amount;
          } else if (diffDays <= 14) {
            lastWeekRevenue += amount;
          }
        }
      }
    });

    let revenueGrowth = 0;
    if (lastWeekRevenue === 0) {
      revenueGrowth = thisWeekRevenue > 0 ? 100 : 0;
    } else {
      revenueGrowth = Number((((thisWeekRevenue - lastWeekRevenue) / lastWeekRevenue) * 100).toFixed(1));
    }

    // 3. Chuẩn bị dữ liệu biểu đồ 7 ngày gần nhất
    // "21/06": { revenue: 0, orders: 0 },
    const daysMap: Record<string, { revenue: number; orders: number }> = {};
    const today = new Date();

    // Khởi tạo 7 ngày gần nhất với giá trị 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
      daysMap[dateStr] = { revenue: 0, orders: 0 };
    }

    // Gộp số liệu từ các đơn hàng vào ngày tương ứng
    allOrders.forEach((order) => {
      if (!order.created_at) return;
      const orderDate = new Date(order.created_at);
      const diffTime = today.getTime() - orderDate.getTime();
      const diffDays = diffTime / (1000 * 3600 * 24);

      if (diffDays <= 7) {
        const dateStr = orderDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
        if (daysMap[dateStr]) {
          daysMap[dateStr].orders += 1;
          if (isOrderCountedInRevenue(order)) {
            daysMap[dateStr].revenue += Number(order.total_amount) || 0;
          }
        }
      }
    });

    const chartData = Object.entries(daysMap).map(([date, data]) => ({
      date,
      revenue: data.revenue,
      orders: data.orders,
    }));

    return {
      totalRevenue,
      revenueGrowth,
      totalOrders,
      pendingOrders,
      processingOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      chartData,
    };
  } catch (error) {
    console.error("Lỗi khi tải số liệu dashboard:", error);
    return {
      totalRevenue: 0,
      revenueGrowth: 0,
      totalOrders: 0,
      pendingOrders: 0,
      processingOrders: 0,
      totalCustomers: 0,
      totalProducts: 0,
      recentOrders: [],
      chartData: [],
    };
  }
}
