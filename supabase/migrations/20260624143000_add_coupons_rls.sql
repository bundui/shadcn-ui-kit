-- RLS policies cho bảng coupons
CREATE POLICY "Admins can manage all coupons" ON public.coupons
    FOR ALL USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role_id = (SELECT id FROM public.roles WHERE name = 'admin')));
