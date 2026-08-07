-- Thêm cột variant_id vào bảng cart_items
ALTER TABLE public.cart_items 
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE;

-- Đảm bảo UNIQUE trên (user_id, product_id, variant_id) thay vì chỉ (user_id, product_id)
-- Vì một user có thể mua cùng 1 sản phẩm nhưng khác biến thể (ví dụ: Áo Đỏ Size L và Áo Xanh Size M)
ALTER TABLE public.cart_items DROP CONSTRAINT IF EXISTS cart_items_user_id_product_id_key;

CREATE UNIQUE INDEX IF NOT EXISTS cart_items_unique_user_product_variant 
ON public.cart_items (user_id, product_id, COALESCE(variant_id, '00000000-0000-0000-0000-000000000000'::uuid));
