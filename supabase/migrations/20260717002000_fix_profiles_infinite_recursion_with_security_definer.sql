-- ==============================================================================
-- Migration: Fix Infinite Recursion on Profiles via SECURITY DEFINER Functions
-- Date: 2026-07-17
-- Description: Khắc phục triệt để lỗi "infinite recursion detected in policy for relation profiles"
--   và khôi phục đầy đủ quyền truy cập cho Admin & Staff trên Header / Giỏ hàng.
--   Hàm SECURITY DEFINER cho phép truy vấn vai trò (Role) từ bảng profiles 
--   mà không kích hoạt lại các RLS policies trên profiles.
-- ==============================================================================

-- ==========================================
-- 1. TẠO CÁC HÀM CHECK VAI TRÒ (SECURITY DEFINER)
-- ==========================================

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
-- 2. CẬP NHẬT RLS TRÊN BẢNG PROFILES & ROLES
-- ==========================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Staff can view customer profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Staff can view customer profiles" ON public.profiles
FOR SELECT USING (
    public.check_is_staff() 
    AND EXISTS (
        SELECT 1 FROM public.roles r_cust
        WHERE r_cust.id = profiles.role_id AND r_cust.name = 'customer'
    )
);

CREATE POLICY "Admins can manage all profiles" ON public.profiles
FOR ALL USING (public.check_is_admin());


ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can read roles" ON public.roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON public.roles;

CREATE POLICY "Anyone can read roles" ON public.roles
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage roles" ON public.roles
FOR ALL USING (public.check_is_admin());


-- ==========================================
-- 3. CẬP NHẬT RLS TRÊN CART_ITEMS
-- ==========================================

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Only Customers can manage own cart" ON public.cart_items;

CREATE POLICY "Only Customers can manage own cart" ON public.cart_items
FOR ALL USING (
    auth.uid() = user_id AND public.check_is_customer()
);


-- ==========================================
-- 4. CẬP NHẬT RLS TRÊN ORDERS & ORDER_ITEMS
-- ==========================================

DROP POLICY IF EXISTS "Customers can view own orders" ON public.orders;
DROP POLICY IF EXISTS "Customers can insert own checkout orders" ON public.orders;
DROP POLICY IF EXISTS "Staff and Admin can create orders for customers" ON public.orders;
DROP POLICY IF EXISTS "Staff can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Staff can update all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can delete orders" ON public.orders;

CREATE POLICY "Customers can view own orders" ON public.orders
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Customers can insert own checkout orders" ON public.orders
FOR INSERT WITH CHECK (
    auth.uid() = user_id AND public.check_is_customer()
);

CREATE POLICY "Staff and Admin can create orders for customers" ON public.orders
FOR INSERT WITH CHECK (public.check_is_staff_or_admin());

CREATE POLICY "Staff can view all orders" ON public.orders
FOR SELECT USING (public.check_is_staff_or_admin());

CREATE POLICY "Staff can update all orders" ON public.orders
FOR UPDATE USING (public.check_is_staff_or_admin());

CREATE POLICY "Admins can delete orders" ON public.orders
FOR DELETE USING (public.check_is_admin());


DROP POLICY IF EXISTS "Customers can view own order items" ON public.order_items;
DROP POLICY IF EXISTS "Customers can insert own order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff and Admin can create order items for customers" ON public.order_items;
DROP POLICY IF EXISTS "Staff can view all order items" ON public.order_items;
DROP POLICY IF EXISTS "Staff can update all order items" ON public.order_items;
DROP POLICY IF EXISTS "Admins can delete order items" ON public.order_items;

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

CREATE POLICY "Staff and Admin can create order items for customers" ON public.order_items
FOR INSERT WITH CHECK (public.check_is_staff_or_admin());

CREATE POLICY "Staff can view all order items" ON public.order_items
FOR SELECT USING (public.check_is_staff_or_admin());

CREATE POLICY "Staff can update all order items" ON public.order_items
FOR UPDATE USING (public.check_is_staff_or_admin());

CREATE POLICY "Admins can delete order items" ON public.order_items
FOR DELETE USING (public.check_is_admin());


-- ==========================================
-- 5. CẬP NHẬT RLS TRÊN PRODUCTS, CATEGORIES, BANNERS, COUPONS
-- ==========================================

DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
DROP POLICY IF EXISTS "Staff and Admins can update products" ON public.products;

CREATE POLICY "Admins can insert products" ON public.products
FOR INSERT WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can delete products" ON public.products
FOR DELETE USING (public.check_is_admin());

CREATE POLICY "Staff and Admins can update products" ON public.products
FOR UPDATE USING (public.check_is_staff_or_admin());


DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
DROP POLICY IF EXISTS "Staff and Admins can update categories" ON public.categories;

CREATE POLICY "Admins can insert categories" ON public.categories
FOR INSERT WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can delete categories" ON public.categories
FOR DELETE USING (public.check_is_admin());

CREATE POLICY "Staff and Admins can update categories" ON public.categories
FOR UPDATE USING (public.check_is_staff_or_admin());


DROP POLICY IF EXISTS "Admins can insert promo banners" ON public.promo_banners;
DROP POLICY IF EXISTS "Admins can delete promo banners" ON public.promo_banners;
DROP POLICY IF EXISTS "Staff and Admins can update promo banners" ON public.promo_banners;

CREATE POLICY "Admins can insert promo banners" ON public.promo_banners
FOR INSERT WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can delete promo banners" ON public.promo_banners
FOR DELETE USING (public.check_is_admin());

CREATE POLICY "Staff and Admins can update promo banners" ON public.promo_banners
FOR UPDATE USING (public.check_is_staff_or_admin());


DROP POLICY IF EXISTS "Admins can insert coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admins can delete coupons" ON public.coupons;
DROP POLICY IF EXISTS "Staff and Admins can update coupons" ON public.coupons;

CREATE POLICY "Admins can insert coupons" ON public.coupons
FOR INSERT WITH CHECK (public.check_is_admin());

CREATE POLICY "Admins can delete coupons" ON public.coupons
FOR DELETE USING (public.check_is_admin());

CREATE POLICY "Staff and Admins can update coupons" ON public.coupons
FOR UPDATE USING (public.check_is_staff_or_admin());
