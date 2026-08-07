-- ==============================================================================
-- Migration: Add Admin/Staff Policies for Addresses
-- Date: 2026-07-23
-- Description: Cho phép Admin và Staff xem/quản lý tất cả địa chỉ của khách hàng 
--              nhằm phục vụ việc xem chi tiết địa chỉ trong phần Quản lý đơn hàng.
-- ==============================================================================

-- Bỏ qua nếu policy đã tồn tại để tránh lỗi
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Staff and Admin can manage all addresses" ON public.addresses;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- Tạo policy cho phép Admin & Staff quản lý toàn bộ địa chỉ
CREATE POLICY "Staff and Admin can manage all addresses" ON public.addresses
    FOR ALL
    USING (public.check_is_staff_or_admin());
