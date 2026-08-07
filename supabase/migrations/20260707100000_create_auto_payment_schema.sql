-- ====================================================================
-- MIGRATION: TẠO HỆ THỐNG THANH TOÁN CHUYỂN KHOẢN TỰ ĐỘNG (VIETQR + GMAIL API)
-- ====================================================================

-- 1. Tạo bảng payments (Lưu trữ các phiên thanh toán QR của đơn hàng)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    payment_code TEXT UNIQUE NOT NULL, -- Mã định danh duy nhất (vd: LX-8A29KQ)
    amount NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, MATCHED, FAILED, EXPIRED, MANUAL
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Thời gian hết hạn QR (10 phút)
    paid_at TIMESTAMP WITH TIME ZONE, -- Thời điểm xác nhận thanh toán thành công
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tạo bảng bank_transactions (Lưu lịch sử giao dịch từ Email Vietcombank gửi về)
CREATE TABLE IF NOT EXISTS public.bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gmail_message_id TEXT UNIQUE NOT NULL, -- ID email từ Gmail API, chống xử lý trùng lặp 100%
    sender_name TEXT, -- Tên người gửi tiền (nếu ngân hàng trả về)
    amount NUMERIC NOT NULL, -- Số tiền thực tế nhận được
    description TEXT NOT NULL, -- Nội dung chuyển khoản gốc (chứa mã LX-xxxxxx)
    transaction_time TIMESTAMP WITH TIME ZONE, -- Thời gian giao dịch trên email
    matched BOOLEAN DEFAULT FALSE, -- Đã khớp với đơn hàng nào chưa
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL, -- Trỏ đến payment thành công
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tạo chỉ mục (Indexes) tối ưu hóa truy vấn khi quét Regex và đối chiếu đơn
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_payment_code ON public.payments(payment_code);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_gmail_id ON public.bank_transactions(gmail_message_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_payment_id ON public.bank_transactions(payment_id);

-- ====================================================================
-- 4. BẬT ROW LEVEL SECURITY (RLS) VÀ THIẾT LẬP CHÍNH SÁCH
-- ====================================================================

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;

-- Xóa chính sách cũ nếu có (an toàn khi chạy lại migration)
DROP POLICY IF EXISTS "Users can view own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage all payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can manage all bank transactions" ON public.bank_transactions;

-- --- CHÍNH SÁCH BẢNG PAYMENTS ---
-- 4.1 Khách hàng chỉ được xem payment thuộc đơn hàng của chính mình, Admin xem tất cả
CREATE POLICY "Users can view own payments" 
ON public.payments 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = payments.order_id 
        AND user_id = auth.uid()
    ) 
    OR public.is_admin()
);

-- 4.2 Khách hàng được phép tạo payment cho đơn hàng của chính mình (Khi bấm chọn thanh toán)
CREATE POLICY "Users can insert own payments" 
ON public.payments 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_id 
        AND user_id = auth.uid()
    ) 
    OR public.is_admin()
);

-- 4.3 Chỉ Admin (hoặc Service Role từ Edge Function) mới được quyền sửa/xóa payment
CREATE POLICY "Admins can manage all payments" 
ON public.payments 
FOR ALL 
USING (public.is_admin());

-- --- CHÍNH SÁCH BẢNG BANK_TRANSACTIONS ---
-- 4.4 Chỉ Admin (hoặc Service Role từ Edge Function) mới được đọc/ghi lịch sử giao dịch ngân hàng
CREATE POLICY "Admins can manage all bank transactions" 
ON public.bank_transactions 
FOR ALL 
USING (public.is_admin());

-- ====================================================================
-- 5. BẬT SUPABASE REALTIME CHO BẢNG PAYMENTS
-- ====================================================================
-- Giúp giao diện Next.js tự động nhận tín hiệu ngay lập tức khi status đổi thành 'MATCHED'
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables 
        WHERE pubname = 'supabase_realtime' AND tablename = 'payments'
    ) THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.payments;
    END IF;
END $$;
