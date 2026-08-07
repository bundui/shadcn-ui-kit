-- Bảng Hình ảnh sản phẩm (Product Images)
CREATE TABLE public.product_images (
  id uuid default gen_random_uuid() primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Biến thể sản phẩm (Product Variants)
CREATE TABLE public.product_variants (
  id uuid default gen_random_uuid() primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  name text not null, -- vd: "Màu đỏ", "Size XL"
  sku text,
  price_modifier numeric(10, 2) default 0, -- Giá cộng/trừ thêm so với giá gốc
  stock_quantity integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Thông số kỹ thuật (Product Specs)
CREATE TABLE public.product_specs (
  id uuid default gen_random_uuid() primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  spec_name text not null, -- vd: "Chất liệu", "Kích thước"
  spec_value text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Bảng Đánh giá sản phẩm (Product Reviews)
CREATE TABLE public.product_reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  comment text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- Tạo Policies (Public Read)
CREATE POLICY "Product images are viewable by everyone." 
  ON public.product_images FOR SELECT USING (true);

CREATE POLICY "Product variants are viewable by everyone." 
  ON public.product_variants FOR SELECT USING (true);

CREATE POLICY "Product specs are viewable by everyone." 
  ON public.product_specs FOR SELECT USING (true);

CREATE POLICY "Product reviews are viewable by everyone." 
  ON public.product_reviews FOR SELECT USING (true);

-- Allow authenticated users to add reviews
CREATE POLICY "Users can insert their own reviews."
  ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);