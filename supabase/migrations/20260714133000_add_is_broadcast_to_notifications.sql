-- ==============================================================================
-- Migration: Thêm cột is_broadcast vào bảng notifications
-- Date: 2026-07-14
-- Description: Thêm cờ is_broadcast để phân biệt chính xác 100% giữa thông báo
--              gửi cho toàn bộ (Broadcast) và thông báo gửi riêng cho từng cá nhân (Targeted)
-- ==============================================================================

-- 1. Thêm cột is_broadcast vào bảng notifications
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS is_broadcast boolean DEFAULT false;

-- 2. Cập nhật dữ liệu cũ: những thông báo được tạo cùng 1 thời điểm (batch >= 2 user) được đánh dấu là broadcast
UPDATE public.notifications n1
SET is_broadcast = true
WHERE EXISTS (
  SELECT 1
  FROM public.notifications n2
  WHERE n1.id <> n2.id
    AND n1.title = n2.title
    AND n1.message = n2.message
    AND DATE_TRUNC('minute', n1.created_at) = DATE_TRUNC('minute', n2.created_at)
);
