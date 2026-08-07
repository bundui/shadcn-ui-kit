import { ParsedTransaction, MatchResult } from "./types.ts";
import { checkTransactionExists, saveBankTransaction, updateTransactionMatched } from "./transaction.service.ts";
import { findPendingPaymentByCode, markPaymentAsMatched } from "./payment.service.ts";

/**
 * Dịch vụ đối chiếu chính (Matcher Service):
 * 1. Kiểm tra lặp (message ID).
 * 2. Lưu giao dịch ngân hàng ban đầu với matched = false.
 * 3. Tìm Payment theo payment_code = description (LX-...).
 * 4. Kiểm tra điều kiện: payment.status == PENDING và payment.amount == parsed.amount.
 * 5. Cập nhật trạng thái MATCHED/paid và cập nhật lại bank_transaction.matched = true.
 */
export async function matchTransactionWithPayment(
  supabase: any,
  parsed: ParsedTransaction
): Promise<MatchResult> {
  try {
    console.log(`\n🔍 [Matcher] Đang kiểm tra đối chiếu cho MessageID: ${parsed.gmailMessageId}`);
    console.log(`➡️ [Matcher] Dữ liệu từ email: Amount = ${parsed.amount} | Description = "${parsed.description}" | Sender = "${parsed.senderName}"`);

    // 1. Kiểm tra trùng lặp giao dịch theo gmail_message_id
    const exists = await checkTransactionExists(supabase, parsed.gmailMessageId);
    if (exists) {
      console.log(`⚠️ [Matcher] Giao dịch với MessageID ${parsed.gmailMessageId} đã tồn tại trong DB, bỏ qua.`);
      return { success: false, matched: false, reason: "Duplicate gmail_message_id" };
    }

    // 2. Lưu thông tin giao dịch vào bảng bank_transactions (trạng thái ban đầu matched = false)
    const txRecord = await saveBankTransaction(supabase, parsed, false);
    if (!txRecord) {
      return { success: false, matched: false, reason: "Failed to save initial transaction record" };
    }

    // 3. Tìm Payment trong bảng payments khớp với payment_code
    if (!parsed.description) {
      console.log("⚠️ [Matcher] Email không trích xuất được mã thanh toán (description rỗng).");
      return { success: true, matched: false, transactionId: txRecord.id, reason: "Empty description/payment_code" };
    }

    const payment = await findPendingPaymentByCode(supabase, parsed.description);
    if (!payment) {
      console.log(`ℹ️ [Matcher] Không tìm thấy phiên thanh toán PENDING nào với mã "${parsed.description}".`);
      return {
        success: true,
        matched: false,
        transactionId: txRecord.id,
        reason: `No PENDING payment found for code "${parsed.description}"`,
      };
    }

    // 4. Kiểm tra chính xác số tiền (Exact amount verification)
    // Theo business rule: Khách chuyển sai số tiền -> Không xác nhận
    const expectedAmount = Number(payment.amount);
    const actualAmount = Number(parsed.amount);

    if (actualAmount !== expectedAmount) {
      console.warn(
        `⚠️ [Matcher] Số tiền không khớp! Mã ${parsed.description}: Cần ${expectedAmount} VNĐ nhưng khách chuyển ${actualAmount} VNĐ. KHÔNG xác nhận tự động.`
      );
      return {
        success: true,
        matched: false,
        transactionId: txRecord.id,
        paymentId: payment.id,
        orderId: payment.order_id,
        reason: `Amount mismatch: expected ${expectedAmount}, received ${actualAmount}`,
      };
    }

    // 5. Số tiền và mã đều khớp chính xác! Tiến hành cập nhật trạng thái
    console.log(`🎯 [Matcher] KHỚP HOÀN HẢO! Mã ${parsed.description} | Số tiền ${actualAmount} VNĐ.`);
    const updated = await markPaymentAsMatched(supabase, payment.id, payment.order_id);

    if (updated) {
      // Cập nhật lại bank_transaction.matched = true
      await updateTransactionMatched(supabase, parsed.gmailMessageId, true);
      console.log(`🎉 [Matcher] Hoàn tất khớp đơn cho Payment ${payment.id} và Order ${payment.order_id}!`);
      return {
        success: true,
        matched: true,
        transactionId: txRecord.id,
        paymentId: payment.id,
        orderId: payment.order_id,
      };
    } else {
      return {
        success: false,
        matched: false,
        transactionId: txRecord.id,
        paymentId: payment.id,
        orderId: payment.order_id,
        reason: "Database error while marking payment as matched",
      };
    }
  } catch (err: any) {
    console.error("❌ [Matcher] Ngoại lệ nghiêm trọng khi đối chiếu thanh toán:", err);
    return {
      success: false,
      matched: false,
      reason: err?.message || "Unknown matcher error",
    };
  }
}
