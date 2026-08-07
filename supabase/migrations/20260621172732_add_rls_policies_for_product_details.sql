-- Bổ sung quyền INSERT cho Authenticated (Admins)
CREATE POLICY "authenticated_can_insert_product_images" ON public.product_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_can_insert_product_variants" ON public.product_variants FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "authenticated_can_insert_product_specs" ON public.product_specs FOR INSERT TO authenticated WITH CHECK (true);

-- Bổ sung quyền UPDATE cho Authenticated
CREATE POLICY "authenticated_can_update_product_images" ON public.product_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_can_update_product_variants" ON public.product_variants FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "authenticated_can_update_product_specs" ON public.product_specs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Bổ sung quyền DELETE cho Authenticated để có thể xóa Products (Cascade)
CREATE POLICY "authenticated_can_delete_product_images" ON public.product_images FOR DELETE TO authenticated USING (true);
CREATE POLICY "authenticated_can_delete_product_variants" ON public.product_variants FOR DELETE TO authenticated USING (true);
CREATE POLICY "authenticated_can_delete_product_specs" ON public.product_specs FOR DELETE TO authenticated USING (true);
CREATE POLICY "authenticated_can_delete_product_reviews" ON public.product_reviews FOR DELETE TO authenticated USING (true);
