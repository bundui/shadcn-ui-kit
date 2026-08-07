import { supabase } from "../supabase/client";
import { getCart } from "./cart.service";
import { createPayment } from "./payment.service";

export interface CheckoutData {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  paymentMethod: string;
  couponId?: string;
  selectedAddressId?: string;
  saveToAddressBook?: boolean;
}

export async function placeOrder(checkoutData: CheckoutData) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const userId = userData.user.id;

  // 1. Get current cart items
  const { data: cartItems, error: cartError } = await getCart();
  if (cartError || !cartItems || cartItems.length === 0) {
    return { data: null, error: new Error("Cart is empty or could not be loaded") };
  }

  // Calculate total amount
  let totalAmount = 0;
  for (const item of cartItems as any[]) {
    const basePrice = Number(item.products?.price || 0);
    const discount = Number(item.products?.discount_percent || 0);
    const modifier = Number(item.product_variants?.price_modifier || 0);
    const discountedBase = basePrice - (basePrice * discount / 100);
    const finalPrice = discountedBase + modifier;
    totalAmount += finalPrice * item.quantity;
  }

  // 1.5 Handle Coupon
  if (checkoutData.couponId) {
    const { data: coupon, error: couponError } = await supabase
      .from("coupons")
      .select("*")
      .eq("id", checkoutData.couponId)
      .eq("is_active", true)
      .single();
    
    if (!couponError && coupon) {
      if (new Date(coupon.valid_until) >= new Date() && 
          (!coupon.usage_limit || coupon.used_count < coupon.usage_limit)) {
        totalAmount = totalAmount - (totalAmount * coupon.discount_percent / 100);
        
        // increment used_count
        await supabase.from("coupons").update({ used_count: coupon.used_count + 1 }).eq("id", coupon.id);
      } else {
        // If coupon invalid at checkout time, we simply ignore or error out. For simplicity, just ignore.
        checkoutData.couponId = undefined;
      }
    } else {
      checkoutData.couponId = undefined;
    }
  }

  // 2. Create or find Address
  let addressId = checkoutData.selectedAddressId;

  if (!addressId) {
    // Tìm xem khách đã có địa chỉ nào trùng khớp SĐT và Đường cụ thể chưa
    const { data: existing } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", userId)
      .eq("phone", checkoutData.phone.trim())
      .ilike("street", checkoutData.street.trim())
      .maybeSingle();

    if (existing) {
      addressId = existing.id;
    } else {
      const { count } = await supabase.from("addresses").select("*", { count: "exact", head: true }).eq("user_id", userId);
      const isFirst = (count === 0);

      const { data: newAddr, error: addressError } = await supabase
        .from("addresses")
        .insert({
          user_id: userId,
          full_name: checkoutData.fullName,
          phone: checkoutData.phone,
          street: checkoutData.street,
          city: checkoutData.city,
          is_default: isFirst
        })
        .select("id")
        .single();
      if (addressError) return { data: null, error: addressError };
      addressId = newAddr.id;
    }
  }

  // 3. Create Order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      status: "pending",
      total_amount: totalAmount,
      shipping_address_id: addressId,
      payment_method: checkoutData.paymentMethod,
      coupon_id: checkoutData.couponId || null,
    })
    .select()
    .single();

  if (orderError) return { data: null, error: orderError };

  // 4. Move Cart Items to Order Items
  const orderItemsPayload = (cartItems as any[]).map(item => {
    const basePrice = Number(item.products?.price || 0);
    const discount = Number(item.products?.discount_percent || 0);
    const modifier = Number(item.product_variants?.price_modifier || 0);
    const finalPrice = basePrice - (basePrice * discount / 100) + modifier;

    const payload: any = {
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: finalPrice,
    };
    if (item.variant_id) payload.variant_id = item.variant_id;
    return payload;
  });

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItemsPayload);

  if (itemsError) {
    // If this fails, the order is created but empty. In a real system we'd use a postgres function with transactions.
    return { data: null, error: itemsError };
  }

  // 5. Clear the Cart
  await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", userId);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cart-updated"));
  }

  // 6. Phát tín hiệu Realtime tức thời cho Admin Dashboard (Chỉ phát ngay với COD; Nếu là Banking thì hoãn chờ thanh toán thành công mới báo Admin)
  if (checkoutData.paymentMethod !== "banking" && !checkoutData.paymentMethod?.includes("VietQR")) {
    try {
      if (typeof window !== "undefined" && window.BroadcastChannel) {
        new BroadcastChannel("admin_orders_channel").postMessage({ type: "NEW_ORDER", order });
      }
      const channel = supabase.channel("global-admin-orders-notifier");
      await new Promise<void>((resolve) => {
        const timer = setTimeout(() => {
          supabase.removeChannel(channel);
          resolve();
        }, 500);
        channel.subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.send({
              type: "broadcast",
              event: "NEW_ORDER",
              payload: order
            });
            clearTimeout(timer);
            supabase.removeChannel(channel);
            resolve();
          }
        });
      });
    } catch (err) {}
  } else {
    console.log("⏸️ [Checkout Service] Đơn hàng thanh toán qua VietQR (banking), tạm hoãn báo động âm thanh cho Admin cho đến khi thanh toán thành công!");
  }

  // 7. Gửi email xác nhận đơn hàng (Chỉ gửi ngay với COD; Nếu là Banking thì hoãn chờ thanh toán thành công mới gửi)
  if (checkoutData.paymentMethod !== "banking") {
    try {
      let recipientEmail = userData.user?.email;
      if (!recipientEmail) {
        const { data: profileData } = await supabase.from("profiles").select("email").eq("id", userId).single();
        recipientEmail = profileData?.email;
      }

      if (recipientEmail) {
        const emailPayload = {
          to: recipientEmail,
          orderId: order.id,
          fullName: checkoutData.fullName || userData.user?.user_metadata?.full_name || "Quý khách",
          phone: checkoutData.phone,
          address: `${checkoutData.street}, ${checkoutData.city}`,
          items: (cartItems as any[]).map(item => {
            const basePrice = Number(item.products?.price || 0);
            const discount = Number(item.products?.discount_percent || 0);
            const modifier = Number(item.product_variants?.price_modifier || 0);
            const finalPrice = basePrice - (basePrice * discount / 100) + modifier;
            return {
              name: item.products?.name || "Sản phẩm",
              quantity: item.quantity,
              price: finalPrice,
              variant: item.product_variants?.name || undefined,
              imageUrl: item.products?.image_url || undefined,
            };
          }),
          totalAmount: order.total_amount || totalAmount,
          paymentMethod: checkoutData.paymentMethod,
          createdAt: order.created_at || new Date().toISOString(),
        };

        console.log("📤 [Checkout Service] Đang gửi yêu cầu email xác nhận (COD) đến:", recipientEmail);
        const res = await fetch("/api/email/order-confirmation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(emailPayload),
        });

        const resData = await res.json().catch(() => ({}));
        if (!res.ok || !resData.success) {
          console.warn("⚠️ [Checkout Service] Không thể gửi email xác nhận (Đơn hàng vẫn đặt thành công):", resData.error || resData.warning || res.statusText);
        } else {
          console.log("✅ [Checkout Service] Đã gửi email xác nhận đặt hàng (COD) thành công!");
        }
      } else {
        console.warn("⚠️ [Checkout Service] Không tìm thấy địa chỉ email của khách hàng để gửi thông báo.");
      }
    } catch (err) {
      console.error("❌ [Checkout Service] Ngoại lệ khi gọi API gửi email:", err);
    }
  } else {
    console.log("⏸️ [Checkout Service] Đơn hàng thanh toán qua VietQR (banking), tạm hoãn gửi email xác nhận cho đến khi khớp lệnh thanh toán!");
  }

  // 8. Tự động khởi tạo phiên thanh toán chuyển khoản (Nếu khách chọn chuyển khoản ngân hàng)
  let payment = null;
  if (checkoutData.paymentMethod === "banking") {
    console.log("💳 [Checkout Service] Khách hàng chọn Chuyển khoản, đang sinh mã thanh toán...");
    const { data: createdPayment, error: payError } = await createPayment(order.id, order.total_amount);
    if (payError) {
      console.error("❌ [Checkout Service] Lỗi khi tạo phiên thanh toán:", payError);
    } else {
      payment = createdPayment;
      console.log("✅ [Checkout Service] Đã tạo phiên thanh toán:", payment?.payment_code);
    }
  }

  return { data: order, payment, error: null };
}


