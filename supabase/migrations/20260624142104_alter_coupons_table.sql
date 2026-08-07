-- Thêm các cột cho module quản lý Coupons
ALTER TABLE public.coupons 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS title TEXT;
