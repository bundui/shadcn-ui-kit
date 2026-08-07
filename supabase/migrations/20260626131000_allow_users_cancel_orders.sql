-- Cấp quyền UPDATE cho Users trên bảng orders (để khách hàng có thể tự hủy đơn mua của chính mình)
CREATE POLICY "Users can update own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
