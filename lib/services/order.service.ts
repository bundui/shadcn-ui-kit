import { supabase } from "../supabase/client";

export async function getOrders(
  search?: string,
  page: number = 1,
  pageSize: number = 10,
  options?: {
    status?: string;
    sort?: string;
    date?: string;
  }
) {
  let query = supabase
    .from("orders")
    .select("*, profiles(full_name, email, phone), addresses(full_name, street, city, phone), payments(payment_code, status, amount, expires_at)", { count: "exact" });

  if (search && search.trim()) {
    const cleanSearch = search.trim().toLowerCase();

    const { data: profiles } = await supabase
      .from("profiles")
      .select("id")
      .or(`full_name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%`);
    const matchedUserIds = new Set(profiles?.map((p) => p.id) || []);

    const { data: payments } = await supabase
      .from("payments")
      .select("order_id")
      .ilike("payment_code", `%${cleanSearch}%`);
    const matchedPaymentOrderIds = new Set(payments?.map((p) => p.order_id) || []);

    let allOrdersQuery = supabase.from("orders").select("id, user_id");
    if (options?.status && options.status !== "all") {
      allOrdersQuery = allOrdersQuery.eq("status", options.status);
    }
    const { data: allIds } = await allOrdersQuery;

    const matchedOrderIds = (allIds || [])
      .filter((o) => o.id.toLowerCase().includes(cleanSearch) || matchedUserIds.has(o.user_id) || matchedPaymentOrderIds.has(o.id))
      .map((o) => o.id);

    if (matchedOrderIds.length === 0) {
      return { data: [], total: 0, page, pageSize, totalPages: 1 };
    }

    query = query.in("id", matchedOrderIds);
  }

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  }

  // Date Filtering
  if (options?.date && options.date !== "all") {
    const now = new Date();
    if (options.date === "today") {
      const todayStart = new Date(now.setHours(0, 0, 0, 0)).toISOString();
      query = query.gte("created_at", todayStart);
    } else if (options.date === "7days") {
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte("created_at", sevenDaysAgo);
    } else if (options.date === "30days") {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
      query = query.gte("created_at", thirtyDaysAgo);
    }
  }

  // Sorting
  if (options?.sort === "amount_asc") {
    query = query.order("total_amount", { ascending: true });
  } else if (options?.sort === "amount_desc") {
    query = query.order("total_amount", { ascending: false });
  } else if (options?.sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else {
    // default: newest
    query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;
  
  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return {
    data,
    error,
    total: count || 0,
    page,
    pageSize,
    totalPages,
  };
}

export async function getOrderById(id: string) {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      profiles(full_name, email, phone),
      addresses(full_name, phone, street, city),
      coupons(code, discount_percent),
      payments(payment_code, status, amount, expires_at),
      order_items(
        id,
        quantity,
        price,
        products(id, name, image_url),
        product_variants(id, name, sku)
      )
    `)
    .eq("id", id)
    .single();

  return { data, error };
}

export async function updateOrderStatus(id: string, status: string) {
  const { data, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id)
    .select("*, profiles(full_name, email, phone), addresses(full_name, street, city, phone)")
    .single();

  if (!error) {
    try {
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        new BroadcastChannel("admin_orders_channel").postMessage({ type: "ORDER_UPDATED", id, status });
      }
      const channel = supabase.channel("global-admin-orders-notifier");
      await new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          supabase.removeChannel(channel);
          resolve();
        }, 500);
        channel.subscribe(async (st) => {
          if (st === "SUBSCRIBED") {
            await channel.send({
              type: "broadcast",
              event: "ORDER_UPDATED",
              payload: { id, status }
            });
            clearTimeout(timer);
            supabase.removeChannel(channel);
            resolve();
          }
        });
      });
    } catch (err) {}

    // Gửi email thông báo khi đơn hàng chuyển trạng thái "Đã giao hàng" (delivered)
    if (status === "delivered" && data) {
      try {
        const recipientEmail = data.profiles?.email;
        if (recipientEmail) {
          const emailPayload = {
            to: recipientEmail,
            orderId: data.id,
            fullName: data.profiles?.full_name || data.addresses?.full_name || "Quý khách",
            phone: data.addresses?.phone || data.profiles?.phone,
            address: data.addresses ? `${data.addresses.street}, ${data.addresses.city}` : "Đã nhận tại cửa hàng/đã giao",
            totalAmount: data.total_amount || 0,
            deliveredAt: new Date().toISOString(),
          };

          console.log("📤 [Order Service] Đang gửi yêu cầu email thông báo giao hàng đến:", recipientEmail);
          const res = await fetch("/api/email/order-delivered", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emailPayload),
          });

          const resData = await res.json().catch(() => ({}));
          if (!res.ok || !resData.success) {
            console.warn("⚠️ [Order Service] Không thể gửi email thông báo giao hàng:", resData.error || resData.warning || res.statusText);
          } else {
            console.log("✅ [Order Service] Đã gửi email thông báo giao hàng thành công!");
          }
        } else {
          console.warn("⚠️ [Order Service] Không tìm thấy email của khách hàng để gửi thông báo giao hàng.");
        }
      } catch (err) {
        console.error("❌ [Order Service] Ngoại lệ khi gọi API gửi email giao hàng:", err);
      }
    }
  }

  return { data, error };
}

export async function getMyOrders() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      payments(payment_code, status, amount, expires_at),
      order_items(
        id,
        product_id,
        quantity,
        price,
        products(id, name, image_url),
        product_variants(name)
      )
    `)
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function deleteOrderAdmin(id: string) {
  await supabase.from("order_items").delete().eq("order_id", id);
  const { error } = await supabase.from("orders").delete().eq("id", id);
  return { error };
}

