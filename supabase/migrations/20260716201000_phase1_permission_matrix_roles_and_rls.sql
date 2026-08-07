-- ==============================================================================
-- Migration: Phase 1 - Chuẩn hóa Roles (Admin, Staff, Customer) & Permission Matrix
-- Date: 2026-07-16 / Updated 2026-07-17 (Fix Infinite Recursion with SECURITY DEFINER)
-- Description: Thực thi chính xác Ma trận Phân quyền Phase 1 cho doanh nghiệp SMB:
--   - Staff: Vận hành mỗi ngày (READ / UPDATE Products, Categories, Orders, Banners, Coupons; READ Customer profiles)
--   - Admin: Quản trị tối cao (CRUD toàn bộ trừ mua hàng cá nhân)
--   - Customer: Khách hàng thành viên (Quản lý giỏ hàng, đơn hàng cá nhân)
--   - Sử dụng các hàm SECURITY DEFINER (check_is_admin, check_is_staff_or_admin, v.v.)
--     bypasses RLS khi kiểm tra vai trò người dùng để tránh hoàn toàn lỗi Infinite Recursion.
-- ==============================================================================

-- ==========================================
-- 1. CHUẨN HÓA BẢNG ROLES & TRIGGER ĐĂNG KÝ
-- ==========================================

-- Thêm cột description vào bảng roles (nếu chưa có)
ALTER TABLE public.roles ADD COLUMN IF NOT EXISTS description TEXT;

-- Đổi tên role cũ 'user' thành 'customer' (Bảo toàn ID để các tài khoản cũ tự động chuyển thành customer)
UPDATE public.roles SET name = 'customer' WHERE name = 'user';

-- Thêm role 'staff' và chuẩn hóa mô tả chi tiết cho 3 roles
INSERT INTO public.roles (name, description) VALUES
('admin',    'Chủ cửa hàng / Quản trị viên: Toàn quyền hệ thống, không được mua hàng cá nhân để thể hiện tính trung thực về doanh thu'),
('staff',    'Nhân viên vận hành mỗi ngày: Thêm/Sửa sản phẩm, đơn hàng, banner (Không được xoá dữ liệu & cấu hình)'),
('customer', 'Khách hàng thành viên: Quản lý giỏ hàng, sổ địa chỉ và lịch sử đơn hàng cá nhân')
ON CONFLICT (name) DO UPDATE 
SET description = EXCLUDED.description;

-- Cập nhật Trigger gán quyền mặc định khi đăng ký tài khoản mới (chuyển sang 'customer')
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    user_role uuid;
    user_full_name text;
    user_avatar text;
BEGIN
    SELECT id INTO user_role FROM public.roles WHERE name = 'customer';

    user_full_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1)
    );

    user_avatar := COALESCE(
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'picture'
    );

    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.profiles(id, email, full_name, avatar_url, role_id)
        VALUES (new.id, new.email, user_full_name, user_avatar, user_role)
        ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            avatar_url = EXCLUDED.avatar_url,
            email = EXCLUDED.email;
    ELSIF (TG_OP = 'UPDATE') THEN
        UPDATE public.profiles
        SET 
            avatar_url = COALESCE(public.profiles.avatar_url, user_avatar),
            full_name = COALESCE(public.profiles.full_name, user_full_name),
            email = COALESCE(public.profiles.email, new.email)
        WHERE id = new.id;
    END IF;

    RETURN NEW;
END;
$$;


-- ==========================================
-- 2. HÀM CHECK VAI TRÒ (SECURITY DEFINER) - KHẮC PHỤC TRIỆT ĐỂ INFINITE RECURSION
-- ==========================================
-- Sử dụng SECURITY DEFINER để đọc trực tiếp bảng profiles mà không kích hoạt lại RLS trên profiles.

CREATE OR REPLACE FUNCTION public.check_is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.check_is_staff_or_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name IN ('admin', 'staff')
  );
$$;

CREATE OR REPLACE FUNCTION public.check_is_staff()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name = 'staff'
  );
$$;

CREATE OR REPLACE FUNCTION public.check_is_customer()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    JOIN roles r ON p.role_id = r.id
    WHERE p.id = auth.uid() AND r.name = 'customer'
  );
$$;


-- ==========================================
-- 3. CART & CHECKOUT (Chỉ Customer)
-- ==========================================

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can manage own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Users and Staff can manage own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Customers and Staff can manage own cart" ON public.cart_items;
DROP POLICY IF EXISTS "Only Customers can manage own cart" ON public.cart_items;

-- Chỉ Customer mới được thao tác giỏ hàng cá nhân (Staff và Admin bị chặn 100%)
CREATE POLICY "Only Customers can manage own cart" ON public.cart_items
FOR ALL USING (
    auth.uid() = user_id AND public.check_is_customer()
);


-- ==========================================
-- 4. ORDERS & CREATE ORDER FOR CUSTOMER
-- ==========================================

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Xóa các policy cũ trên orders và order_items
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Users and Staff can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers and Staff can insert own orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can insert own checkout orders" ON public.orders;
DROP POLICY IF EXISTS "Staff and Admin can create orders for customers" ON public.orders;
DROP POLICY IF EXISTS "Staff can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff can manage all order_items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can manage all order_items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff and Admin can create order items for customers" ON public.order_items;
DROP POLICY IF EXISTS "Staff can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff can update all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;

-- 4.1. Customer: Xem đơn hàng của chính mình & Tạo đơn thanh toán cá nhân (Checkout)
CREATE POLICY "Customers can view own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert own checkout orders" ON public.orders
FOR INSERT WITH CHECK (
    auth.uid() = user_id AND public.check_is_customer()
);

CREATE POLICY "Customers can view own order items" ON public.order_items
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_items.order_id AND user_id = auth.uid()
    )
);

CREATE POLICY "Customers can insert own order items" ON public.order_items
FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.orders 
        WHERE id = order_items.order_id AND user_id = auth.uid()
    )
);

-- 4.2. Create Order for Customer: Staff & Admin được phép tạo đơn hộ khách (Assisted ordering / POS)
CREATE POLICY "Staff and Admin can create orders for customers" ON public.orders
FOR INSERT WITH CHECK (public.check_is_staff_or_admin());

CREATE POLICY "Staff and Admin can create order items for customers" ON public.order_items
FOR INSERT WITH CHECK (public.check_is_staff_or_admin());

-- 4.3. Staff: READ / UPDATE trạng thái đơn hàng (Cấm DELETE)
CREATE POLICY "Staff can view all orders" ON public.orders
FOR SELECT USING (public.check_is_staff_or_admin());

CREATE POLICY "Staff can update all orders" ON public.orders
FOR UPDATE USING (public.check_is_staff_or_admin());

CREATE POLICY "Staff can view all order items" ON public.order_items
FOR SELECT USING (public.check_is_staff_or_admin());

CREATE POLICY "Staff can update all order items" ON public.order_items
FOR UPDATE USING (public.check_is_staff_or_admin());

-- 4.4. Admin: CRUD (Được phép DELETE đơn khi cần thiết)
CREATE POLICY "Admins can delete orders" ON public.orders
FOR DELETE USING (public.check_is_admin());

CREATE POLICY "Admins can delete order items" ON public.order_items
FOR DELETE USING (public.check_is_admin());


-- ==========================================
-- 5. PRODUCTS & CATEGORIES (Staff: READ/UPDATE, Admin: CRUD)
-- ==========================================

DROP POLICY IF EXISTS "authenticated_can_insert_products" ON public.products;
DROP POLICY IF EXISTS "authenticated_can_update_products" ON public.products;
DROP POLICY IF EXISTS "authenticated_can_delete_products" ON public.products;
DROP POLICY IF EXISTS "Staff can manage products" ON public.products;
DROP POLICY IF EXISTS "Staff can select insert update products" ON public.products;
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Staff and Admins can update products" ON public.products;

DROP POLICY IF EXISTS "Chỉ admin mới được tạo danh mục" ON public.categories;
DROP POLICY IF EXISTS "Chỉ admin mới được sửa danh mục" ON public.categories;
DROP POLICY IF EXISTS "Chỉ admin mới được xóa danh mục" ON public.categories;
DROP POLICY IF EXISTS "Staff can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Staff can update categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Staff and Admins can update categories" ON public.categories;

-- 5.1. Products
CREATE POLICY "Admins can insert products" ON public.products
FOR INSERT WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE USING (public.check_is_admin());

CREATE POLICY "Staff and Admins can update products" ON public.products
FOR UPDATE USING (public.check_is_staff_or_admin());

-- 5.2. Categories
CREATE POLICY "Admins can insert categories" ON public.categories
FOR INSERT WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories
FOR DELETE USING (public.check_is_admin());

CREATE POLICY "Staff and Admins can update categories" ON public.categories
FOR UPDATE USING (public.check_is_staff_or_admin());


-- ==========================================
-- 6. BANNER / COUPON (Staff: READ/UPDATE, Admin: CRUD)
-- ==========================================

DROP POLICY IF EXISTS "Staff can manage promo banners" ON public.promo_banners;
DROP POLICY IF EXISTS "Staff can manage coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can insert promo banners" ON public.promo_banners;
DROP POLICY IF EXISTS "Admins can delete promo banners" ON public.promo_banners;
DROP POLICY IF EXISTS "Staff and Admins can update promo banners" ON public.promo_banners;
DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can delete coupons" ON public.coupons;
DROP POLICY IF EXISTS "Staff and Admins can update coupons" ON public.coupons;

-- 6.1. Promo Banners
CREATE POLICY "Admins can insert promo banners" ON public.promo_banners
FOR INSERT WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can delete promo banners" ON public.promo_banners
FOR DELETE USING (public.check_is_admin());

CREATE POLICY "Staff and Admins can update promo banners" ON public.promo_banners
FOR UPDATE USING (public.check_is_staff_or_admin());

-- 6.2. Coupons
CREATE POLICY "Admins can insert coupons" ON public.coupons
FOR INSERT WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can delete coupons" ON public.coupons
FOR DELETE USING (public.check_is_admin());

CREATE POLICY "Staff and Admins can update coupons" ON public.coupons
FOR UPDATE USING (public.check_is_staff_or_admin());


-- ==========================================
-- 7. USERS & ROLES (Staff: READ Customer, Admin: CRUD)
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view customer profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 7.1. Customer: Chỉ Profile mình
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

-- 7.2. Staff: READ Customer (Xem hồ sơ khách hàng để liên hệ, giao hàng)
CREATE POLICY "Staff can view customer profiles" ON public.profiles
FOR SELECT USING (
    public.check_is_staff() 
    AND EXISTS (
        SELECT 1 FROM public.roles r_cust
        WHERE r_cust.id = profiles.role_id AND r_cust.name = 'customer'
    )
);

-- 7.3. Admin: CRUD Profiles & Roles
CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (public.check_is_admin());

ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;

-- Mọi người đăng nhập cần đọc roles để biết vai trò
CREATE POLICY "Anyone can read roles" ON public.roles
FOR SELECT TO authenticated USING (true);

-- Chỉ Admin được thêm, sửa, xóa Roles
CREATE POLICY "Admins can manage roles" ON public.roles
FOR ALL USING (public.check_is_admin());
