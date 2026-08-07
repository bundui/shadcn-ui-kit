import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * API Route: Nhận webhook từ n8n khi phát hiện giao dịch ngân hàng mới.
 * Đối chiếu mã thanh toán (LX-xxxxxx) + số tiền → cập nhật trạng thái MATCHED.
 *
 * Luồng:
 *   n8n phát hiện email ngân hàng → Parse dữ liệu → POST tới endpoint này
 *   → Xác thực secret → Đối chiếu payment → Cập nhật DB → Supabase Realtime → Frontend
 */

const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

interface WebhookPayload {
  parsed?: boolean;
  emailId?: string;
  subject?: string;
  amount?: number;
  txnId?: string;
  invoiceCode?: string;
  date?: string;
  from?: string;
  bank?: string;
  raw?: string;
}

/**
 * Trích xuất mã thanh toán LX-xxxxxx từ nội dung chuyển khoản.
 * Hỗ trợ các dạng: LX8A29KQ, LX-8A29KQ, L X 8A29KQ, lx8a29kq
 */
function extractPaymentCode(description: string): string[] {
  const cleaned = description.toUpperCase().trim();
  const candidates: string[] = [];

  const lxMatch = cleaned.match(/L\s*X\s*-?\s*([A-Z0-9]{4,15})/i);
  if (lxMatch && lxMatch[1]) {
    const codePart = lxMatch[1].toUpperCase();
    candidates.push(`LX${codePart}`);
    candidates.push(`LX-${codePart}`);
  }

  if (candidates.length === 0) {
    candidates.push(cleaned);
  }

  return candidates;
}

/**
 * Xử lý chuỗi thời gian do n8n gửi về (có thể dạng "HH:mm DD/MM/YYYY" hoặc ISO)
 */
function parseTransactionTime(dateStr?: string): string {
  if (!dateStr) return new Date().toISOString();
  
  // Thử parse chuẩn ISO
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString();

  // Thử parse định dạng "14:07 21/06/2026"
  const match = dateStr.match(/^(\d{2}):(\d{2})\s+(\d{2})\/(\d{2})\/(\d{4})$/);
  if (match) {
    const [_, hh, mm, DD, MM, YYYY] = match;
    const customDate = new Date(`${YYYY}-${MM}-${DD}T${hh}:${mm}:00+07:00`);
    if (!isNaN(customDate.getTime())) return customDate.toISOString();
  }

  // Fallback nếu không parse được
  return new Date().toISOString();
}

export async function POST(req: Request) {
  try {
    // 1. Xác thực webhook secret
    const secret = req.headers.get("x-webhook-secret");
    if (!WEBHOOK_SECRET || secret !== WEBHOOK_SECRET) {
      console.warn("⚠️ [Webhook] Từ chối: secret key không hợp lệ.");
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    // 2. Parse body
    const body: WebhookPayload = await req.json();
    let { amount, invoiceCode, from, emailId, txnId, date, parsed, raw } = body;
    
    // Nếu n8n gửi sang nhưng bị lỗi parse (parsed: false) và có raw text, ta sẽ TỰ PARSE
    if (parsed === false && raw) {
      console.log("⚠️ [Webhook] n8n không parse được email, hệ thống tự động parse raw text...");
      // Parse số tiền (VD: SD tăng: +29,992,500 VND)
      const amountMatch = raw.match(/(?:SD tăng|Số tiền|Giao dịch|So tien|PS CÓ)[^\d]*\+?([\d,\.]+)/i);
      if (amountMatch) {
        amount = Number(amountMatch[1].replace(/,/g, "").replace(/\./g, ""));
      }

      // Parse Nội dung
      const descMatch = raw.match(/(?:Nội dung|ND|NDGD|Noi dung|Chi tiết)\s*:\s*([^\n]+)/i);
      if (descMatch) {
        invoiceCode = descMatch[1].trim();
      } else {
        // Quét mù tìm mã LX
        const lxMatch = raw.match(/L\s*X\s*-?\s*[A-Z0-9]{4,15}/i);
        if (lxMatch) invoiceCode = lxMatch[0];
      }

      // Parse thời gian
      const dateMatch = raw.match(/(?:Thời gian|Ngày|Date|Time)\s*:\s*([0-9\/\s:-]+)/i);
      if (dateMatch) date = dateMatch[1].trim();

      // Parse người gửi
      const senderMatch = raw.match(/(?:Người gửi|Từ|From|TK chuyển)\s*:\s*([^\n]+)/i);
      if (senderMatch) from = senderMatch[1].trim();
    }

    // Ánh xạ các trường từ n8n sang logic hiện tại
    const description = invoiceCode || "";
    const sender_name = `[n8n] ${from || "Khách"}`;
    const transaction_id = txnId || emailId;
    const transaction_time = parseTransactionTime(date);

    if (!amount || !description) {
      console.error("❌ [Webhook] Bó tay, không thể trích xuất amount và invoiceCode từ raw data.");
      return NextResponse.json(
        { success: false, error: "Missing required fields: amount, invoiceCode" },
        { status: 400 }
      );
    }

    console.log(`📥 [Webhook] Nhận giao dịch: ${amount} VNĐ | Nội dung: "${description}" | Người gửi: "${sender_name || "N/A"}"`);

    // 3. Tạo Supabase client với Service Role Key (bypass RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 4. Kiểm tra trùng lặp bằng transaction_id
    const txId = transaction_id || `n8n_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const { data: existingTx } = await supabase
      .from("bank_transactions")
      .select("id")
      .eq("gmail_message_id", txId)
      .maybeSingle();

    if (existingTx) {
      console.log(`⚠️ [Webhook] Giao dịch ${txId} đã tồn tại, bỏ qua.`);
      return NextResponse.json({
        success: true,
        matched: false,
        reason: "Duplicate transaction_id",
      });
    }

    // 5. Lưu giao dịch vào bank_transactions (matched = false ban đầu)
    const { data: savedTx, error: txError } = await supabase
      .from("bank_transactions")
      .insert({
        gmail_message_id: txId,
        sender_name: sender_name || "Webhook n8n",
        amount: Number(amount),
        description: description,
        transaction_time: transaction_time || new Date().toISOString(),
        matched: false,
      })
      .select()
      .single();

    if (txError) {
      console.error("❌ [Webhook] Lỗi lưu bank_transaction:", txError.message);
      return NextResponse.json(
        { success: false, error: "Failed to save transaction", details: txError.message },
        { status: 500 }
      );
    }

    // 6. Trích xuất mã thanh toán LX-xxxxxx từ description
    const paymentCodes = extractPaymentCode(description);
    console.log(`🔎 [Webhook] Tìm kiếm payment PENDING với mã:`, paymentCodes);

    // 7. Tìm payment PENDING khớp mã
    const { data: payment, error: payError } = await supabase
      .from("payments")
      .select("*")
      .in("payment_code", paymentCodes)
      .eq("status", "PENDING")
      .maybeSingle();

    if (payError || !payment) {
      console.log(`ℹ️ [Webhook] Không tìm thấy payment PENDING cho mã ${paymentCodes.join(", ")}.`);
      return NextResponse.json({
        success: true,
        matched: false,
        transactionId: savedTx.id,
        reason: `No PENDING payment found for codes: ${paymentCodes.join(", ")}`,
      });
    }

    // 8. Kiểm tra số tiền chính xác
    const expectedAmount = Number(payment.amount);
    const actualAmount = Number(amount);

    if (actualAmount !== expectedAmount) {
      console.warn(`⚠️ [Webhook] Số tiền không khớp! Mã ${paymentCodes[0]}: Cần ${expectedAmount}, nhận ${actualAmount}.`);
      return NextResponse.json({
        success: true,
        matched: false,
        transactionId: savedTx.id,
        paymentId: payment.id,
        orderId: payment.order_id,
        reason: `Amount mismatch: expected ${expectedAmount}, received ${actualAmount}`,
      });
    }

    // 9. KHỚP HOÀN HẢO! Cập nhật payment → MATCHED
    console.log(`🎯 [Webhook] KHỚP! Mã ${paymentCodes[0]} | Số tiền ${actualAmount} VNĐ.`);
    const now = new Date().toISOString();

    const { error: updatePayError } = await supabase
      .from("payments")
      .update({ status: "MATCHED", paid_at: now })
      .eq("id", payment.id);

    if (updatePayError) {
      console.error("❌ [Webhook] Lỗi cập nhật payment:", updatePayError.message);
      return NextResponse.json(
        { success: false, error: "Failed to update payment status" },
        { status: 500 }
      );
    }

    // 10. Cập nhật order → paid
    if (payment.order_id) {
      const { error: updateOrderError } = await supabase
        .from("orders")
        .update({ status: "paid" })
        .eq("id", payment.order_id);

      if (updateOrderError) {
        console.error("❌ [Webhook] Lỗi cập nhật order:", updateOrderError.message);
      } else {
        console.log(`✅ [Webhook] Order ${payment.order_id} → paid`);
      }
    }

    // 11. Cập nhật bank_transaction → matched = true
    await supabase
      .from("bank_transactions")
      .update({ matched: true, payment_id: payment.id })
      .eq("id", savedTx.id);

    // 12. Gửi email xác nhận thanh toán thành công
    try {
      const { data: fullOrder } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*), product_variants(*)), profiles(email, full_name, phone), addresses(*)")
        .eq("id", payment.order_id)
        .maybeSingle();

      const recipientEmail = fullOrder?.profiles?.email;
      if (fullOrder && recipientEmail) {
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        await fetch(`${siteUrl}/api/email/order-confirmation`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: recipientEmail,
            orderId: fullOrder.id,
            fullName: fullOrder.profiles?.full_name || fullOrder.addresses?.full_name || "Quý khách",
            phone: fullOrder.profiles?.phone || fullOrder.addresses?.phone || "",
            address: fullOrder.addresses ? `${fullOrder.addresses.street || ""}, ${fullOrder.addresses.city || ""}` : "",
            items: (fullOrder.order_items || []).map((item: Record<string, unknown>) => ({
              name: (item.products as Record<string, unknown>)?.name || "Sản phẩm",
              quantity: item.quantity || 1,
              price: Number(item.price || (item.products as Record<string, unknown>)?.price || 0),
              variant: (item.product_variants as Record<string, unknown>)?.name || undefined,
              imageUrl: (item.products as Record<string, unknown>)?.image_url || undefined,
            })),
            totalAmount: fullOrder.total_amount,
            paymentMethod: "VietQR (Đã xác nhận chuyển khoản tự động)",
            createdAt: fullOrder.created_at || now,
          }),
        });
        console.log(`📤 [Webhook] Đã gửi email xác nhận tới ${recipientEmail}`);
      }
    } catch (emailErr) {
      console.warn("⚠️ [Webhook] Lỗi gửi email xác nhận:", emailErr);
    }

    console.log(`🎉 [Webhook] Hoàn tất! Payment ${payment.id} → MATCHED | Order ${payment.order_id} → paid`);

    return NextResponse.json({
      success: true,
      matched: true,
      transactionId: savedTx.id,
      paymentId: payment.id,
      orderId: payment.order_id,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ [Webhook] Ngoại lệ:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
