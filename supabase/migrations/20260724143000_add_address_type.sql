-- Thêm cột type vào bảng addresses để phân loại địa chỉ (home, office, other)
ALTER TABLE public.addresses ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'home';
