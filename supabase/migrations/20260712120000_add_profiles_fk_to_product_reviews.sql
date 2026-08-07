-- Migration: Add foreign key relationship between product_reviews and profiles
-- Relationship: Many-to-One (N-1) from product_reviews to profiles.
-- Why: Each review is written by exactly one user profile. This relationship allows PostgREST (Supabase client) to cleanly join product_reviews with profiles (`select("..., product_reviews(..., profiles(full_name, email))")`) to display the reviewer's full name.

-- 1. Cap nhat foreign key cho product_reviews sang profiles
ALTER TABLE public.product_reviews
  DROP CONSTRAINT IF EXISTS product_reviews_user_id_fkey;

ALTER TABLE public.product_reviews
  ADD CONSTRAINT product_reviews_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.profiles(id)
  ON DELETE SET NULL;

-- 2. Đảm bảo RLS trên profiles cho phép đọc công khai (để lấy tên đầy đủ full_name của người đánh giá)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
