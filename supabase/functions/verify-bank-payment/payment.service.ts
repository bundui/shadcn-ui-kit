import { PaymentRecord } from "./types.ts";

/**
 * Tìm kiếm phiên thanh toán (payment) đang ở trạng thái PENDING theo mã thanh toán (payment_code)
 */
export async function findPendingPaymentByCode(supabase: any, paymentCode: string): Promise<PaymentRecord | null> {
  if (!paymentCode) return null;
  try {
    const cleanInput = paymentCode.toUpperCase().trim();
    const candidates: string[] = [cleanInput];

    // Bóc tách mã LX(...) nếu tìm thấy (hỗ trợ cả có dấu gạch nối và không có dấu gạch nối)
    const lxMatch = cleanInput.match(/L\s*X\s*-?\s*([A-Z0-9]{4,15})/i);
    if (lxMatch && lxMatch[1]) {
      const codePart = lxMatch[1].toUpperCase();
      const withHyphen = `LX-${codePart}`;
      const withoutHyphen = `LX${codePart}`;
      if (!candidates.includes(withHyphen)) candidates.push(withHyphen);
      if (!candidates.includes(withoutHyphen)) candidates.push(withoutHyphen);
    }

    console.log(`🔎 [Payment Service] Tìm kiếm phiên thanh toán PENDING trong DB cho các mã:`, candidates);

    const { data, error } = await supabase
      .from("payments")
      .select("*")
      .in("payment_code", candidates)
      .eq("status", "PENDING")
      .maybeSingle();

    if (error) {
      console.error(`❌ [Payment Service] Lỗi khi truy vấn payment_code (${candidates.join(", ")}):`, error.message);
      return null;
    }

    return data as PaymentRecord | null;
  } catch (err) {
    console.error("❌ [Payment Service] Ngoại lệ khi truy vấn payment:", err);
    return null;
  }
}

/**
 * Cập nhật trạng thái phiên thanh toán thành MATCHED và đơn hàng thành paid.
 * Khi payment status đổi sang MATCHED, Supabase Realtime sẽ phát sự kiện về Frontend
 * để trang thanh toán QR tự động đổi sang trạng thái thành công (SUCCESS) và phát nhạc!
 */
export async function markPaymentAsMatched(
  supabase: any,
  paymentId: string,
  orderId: string
): Promise<boolean> {
  try {
    const now = new Date().toISOString();

    // 1. Cập nhật bảng payments -> MATCHED, paid_at = now
    const { error: payError } = await supabase
      .from("payments")
      .update({
        status: "MATCHED",
        paid_at: now,
      })
      .eq("id", paymentId);

    if (payError) {
      console.error(`❌ [Payment Service] Lỗi khi cập nhật status MATCHED cho payment ${paymentId}:`, payError.message);
      return false;
    }

    // 2. Cập nhật bảng orders -> paid
    if (orderId) {
      const { error: orderError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", orderId);

      if (orderError) {
        console.error(`❌ [Payment Service] Lỗi khi cập nhật status paid cho order ${orderId}:`, orderError.message);
        // Không return false vì payment đã được update thành công
      } else {
        console.log(`✅ [Payment Service] Đã cập nhật order ${orderId} sang trạng thái paid!`);

        // 3. Tự động gửi email xác nhận & thông báo thanh toán chuyển khoản thành công
        try {
          const { data: fullOrder } = await supabase
            .from("orders")
            .select("*, order_items(*, products(*), product_variants(*)), profiles(email, full_name, phone), addresses(*)")
            .eq("id", orderId)
            .maybeSingle();

          const recipientEmail = fullOrder?.profiles?.email || fullOrder?.email;
          if (fullOrder && recipientEmail) {
            const siteUrl = Deno.env.get("NEXT_PUBLIC_SITE_URL") || Deno.env.get("NEXT_PUBLIC_APP_URL") || "http://localhost:3000";
            
            const emailPayload = {
              to: recipientEmail,
              orderId: fullOrder.id,
              fullName: fullOrder.profiles?.full_name || fullOrder.addresses?.full_name || fullOrder.full_name || "Quý khách",
              phone: fullOrder.profiles?.phone || fullOrder.addresses?.phone || fullOrder.phone || "",
              address: fullOrder.addresses ? `${fullOrder.addresses.street || ""}, ${fullOrder.addresses.city || ""}` : "",
              items: (fullOrder.order_items || []).map((item: any) => ({
                name: item.products?.name || "Sản phẩm",
                quantity: item.quantity || 1,
                price: Number(item.price || item.products?.price || 0),
                variant: item.product_variants?.name || undefined,
                imageUrl: item.products?.image_url || undefined,
              })),
              totalAmount: fullOrder.total_amount,
              paymentMethod: "VietQR (Đã xác nhận chuyển khoản)",
              createdAt: fullOrder.created_at || now,
            };

            if (siteUrl.includes("localhost")) {
              console.warn(`⚠️ [Payment Service] Cảnh báo: NEXT_PUBLIC_SITE_URL đang là "${siteUrl}". Edge Function trên Supabase Cloud không thể gọi HTTP về localhost máy cá nhân. (Hệ thống sẽ gửi qua trình duyệt khách khi test local)`);
            }

            console.log(`📤 [Payment Service] Đang gửi email xác nhận thanh toán thành công tới: ${recipientEmail} qua ${siteUrl}/api/email/order-confirmation`);
            fetch(`${siteUrl}/api/email/order-confirmation`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(emailPayload),
            }).then(async (res) => {
              if (res.ok) {
                console.log(`✅ [Payment Service] Đã gửi email xác nhận thành công cho đơn hàng ${orderId}!`);
              } else {
                const text = await res.text().catch(() => "");
                console.warn(`⚠️ [Payment Service] API gửi mail trả về lỗi (${res.status}): ${text}`);
              }
            }).catch((err) => console.warn("⚠️ [Payment Service] Lỗi khi gọi API gửi mail:", err.message));
          } else {
            console.warn(`ℹ️ [Payment Service] Không tìm thấy email của khách hàng cho đơn hàng ${orderId} để gửi thông báo.`);
          }
        } catch (mailErr: any) {
          console.warn("⚠️ [Payment Service] Ngoại lệ khi chuẩn bị gửi mail:", mailErr?.message || mailErr);
        }
      }
    }

    console.log(`🎉 [Payment Service] Phiên thanh toán ${paymentId} đã xác nhận MATCHED thành công!`);
    return true;
  } catch (err: any) {
    console.error("❌ [Payment Service] Ngoại lệ khi cập nhật trạng thái thanh toán:", err?.message || err);
    return false;
  }
}
