import { ParsedTransaction, BankTransactionRecord } from "./types.ts";

/**
 * Kiểm tra giao dịch từ Gmail Message ID đã từng được lưu vào database chưa.
 * Ngăn chặn xử lý trùng lặp (duplicate processing) nếu email được đọc lại nhiều lần.
 */
export async function checkTransactionExists(supabase: any, gmailMessageId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("bank_transactions")
      .select("id")
      .eq("gmail_message_id", gmailMessageId)
      .maybeSingle();

    if (error) {
      console.error(`❌ [Transaction Service] Lỗi khi kiểm tra gmail_message_id (${gmailMessageId}):`, error.message);
      return false;
    }

    return !!data;
  } catch (err) {
    console.error("❌ [Transaction Service] Ngoại lệ khi kiểm tra giao dịch:", err);
    return false;
  }
}

/**
 * Lưu bản ghi giao dịch ngân hàng mới vào bảng bank_transactions
 */
export async function saveBankTransaction(
  supabase: any,
  parsed: ParsedTransaction,
  matched: boolean = false
): Promise<BankTransactionRecord | null> {
  try {
    const payload: BankTransactionRecord = {
      gmail_message_id: parsed.gmailMessageId,
      sender_name: parsed.senderName || "Unknown",
      amount: parsed.amount,
      description: parsed.description,
      transaction_time: parsed.transactionTime,
      matched,
    };

    const { data, error } = await supabase
      .from("bank_transactions")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error("❌ [Transaction Service] Lỗi khi lưu bank_transaction:", error.message);
      return null;
    }

    console.log(`✅ [Transaction Service] Đã lưu giao dịch ${parsed.gmailMessageId} | Amount: ${parsed.amount} | Code: ${parsed.description}`);
    return data as BankTransactionRecord;
  } catch (err) {
    console.error("❌ [Transaction Service] Ngoại lệ khi lưu bank_transaction:", err);
    return null;
  }
}

/**
 * Cập nhật trạng thái matched cho giao dịch trong bảng bank_transactions
 */
export async function updateTransactionMatched(
  supabase: any,
  gmailMessageId: string,
  matched: boolean = true
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("bank_transactions")
      .update({ matched })
      .eq("gmail_message_id", gmailMessageId);

    if (error) {
      console.error(`❌ [Transaction Service] Lỗi cập nhật matched cho ${gmailMessageId}:`, error.message);
      return false;
    }

    return true;
  } catch (err) {
    console.error("❌ [Transaction Service] Ngoại lệ khi cập nhật matched:", err);
    return false;
  }
}
