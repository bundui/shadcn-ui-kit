-- Thêm cột variant_id vào bảng order_items
ALTER TABLE public.order_items 
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL;

-- Cấp quyền ALL cho Admin trên bảng order_items
CREATE POLICY "Admins can manage all order_items" ON public.order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role_id = (SELECT id FROM public.roles WHERE name = 'admin')
        )
    );

-- (Bổ sung thêm) Cấp quyền INSERT cho Users để khách hàng có thể tự đặt hàng trong tương lai
CREATE POLICY "Users can insert own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders 
            WHERE id = order_items.order_id AND user_id = auth.uid()
        )
    );
