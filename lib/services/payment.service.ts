import { supabase } from "../supabase/client";

export interface Payment {
  id: string;
  order_id: string;
  payment_code: string;
  amount: number;
  status: 'PENDING' | 'MATCHED' | 'FAILED' | 'EXPIRED' | 'MANUAL';
  expires_at: string;
  paid_at?: string;
  created_at: string;
}

// Cấu hình ngân hàng mặc định (Có thể tùy chỉnh qua biến môi trường .env.local)
const BANK_ID = process.env.NEXT_PUBLIC_VIETQR_BANK_ID || "VPBANK";
const ACCOUNT_NO = process.env.NEXT_PUBLIC_VIETQR_ACCOUNT_NO || "0779461536";
const ACCOUNT_NAME = process.env.NEXT_PUBLIC_VIETQR_ACCOUNT_NAME || "TRAN QUANG DUNG";
const QR_TEMPLATE = process.env.NEXT_PUBLIC_VIETQR_TEMPLATE || "compact2";

/**
 * Tạo URL ảnh QR động từ dịch vụ VietQR chính thức (img.vietqr.io)
 */
export function getVietQRUrl({ amount, paymentCode, addInfo }: { amount: number; paymentCode: string; addInfo?: string }): string {
  const encodedName = encodeURIComponent(ACCOUNT_NAME);
  const encodedInfo = encodeURIComponent(addInfo || paymentCode);
  return `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-${QR_TEMPLATE}.png?amount=${amount}&addInfo=${encodedInfo}&accountName=${encodedName}`;
}

/**
 * Sinh mã thanh toán độc nhất dạng LX-XXXXXX
 * (Loại bỏ các ký tự dễ nhầm lẫn như 0, O, 1, I khi khách hàng tự nhập tay)
 */
function generatePaymentCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomStr = "";
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `LX${randomStr}`;
}

/**
 * Tạo phiên thanh toán mới cho đơn hàng (Hết hạn sau 10 phút = 600 giây)
 */
export async function createPayment(orderId: string, amount: number) {
  let paymentCode = generatePaymentCode();
  
  // Kiểm tra trùng lặp mã code trong DB (Để đảm bảo tính duy nhất tuyệt đối)
  let isUnique = false;
  let attempts = 0;
  while (!isUnique && attempts < 5) {
    const { data: existing } = await supabase
      .from("payments")
      .select("id")
      .eq("payment_code", paymentCode)
      .maybeSingle();
    
    if (!existing) {
      isUnique = true;
    } else {
      paymentCode = generatePaymentCode();
      attempts++;
    }
  }

  // Thời gian hết hạn: đúng 10 phút từ thời điểm tạo
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const { data: payment, error } = await supabase
    .from("payments")
    .insert({
      order_id: orderId,
      payment_code: paymentCode,
      amount: amount,
      status: "PENDING",
      expires_at: expiresAt
    })
    .select()
    .single();

  if (error) {
    console.error("❌ [Payment Service] Lỗi tạo payment:", error);
    return { data: null, error };
  }

  return { data: payment as Payment, error: null };
}

/**
 * Lấy thông tin thanh toán mới nhất của một đơn hàng
 */
export async function getPaymentByOrderId(orderId: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return { data: data as Payment | null, error };
}

/**
 * Lấy chi tiết thông tin thanh toán theo ID payment
 */
export async function getPaymentById(paymentId: string) {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  return { data: data as Payment | null, error };
}

/**
 * Trả về thông tin cấu hình tài khoản thụ hưởng hiện tại
 */
export function getBankConfig() {
  return {
    bankId: BANK_ID,
    accountNo: ACCOUNT_NO,
    accountName: ACCOUNT_NAME,
    template: QR_TEMPLATE
  };
}
