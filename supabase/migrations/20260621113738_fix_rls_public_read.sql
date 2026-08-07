-- Allow public to read categories
DROP POLICY IF EXISTS "Cho phép mọi user đã đăng nhập xem danh mục" ON public.categories;

CREATE POLICY "Allow public read access for categories"
ON public.categories
FOR SELECT
USING (true);

-- Allow public to read products
DROP POLICY IF EXISTS "Allow public read access for products" ON public.products;

CREATE POLICY "Allow public read access for products"
ON public.products
FOR SELECT
USING (true);
