-- Create promo_banners table
CREATE TABLE IF NOT EXISTS public.promo_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    badge_text TEXT,
    badge_color TEXT DEFAULT 'primary', -- primary, secondary, white, black etc.
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add RLS policies
ALTER TABLE public.promo_banners ENABLE ROW LEVEL SECURITY;

-- Anyone can read active banners
CREATE POLICY "Anyone can view active banners" 
ON public.promo_banners FOR SELECT 
USING (is_active = true);

-- Only admins can modify banners
CREATE POLICY "Admins can insert banners" 
ON public.promo_banners FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles
    JOIN roles ON profiles.role_id = roles.id
    WHERE profiles.id = auth.uid() AND roles.name = 'admin'
  )
);

CREATE POLICY "Admins can update banners" 
ON public.promo_banners FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    JOIN roles ON profiles.role_id = roles.id
    WHERE profiles.id = auth.uid() AND roles.name = 'admin'
  )
);

CREATE POLICY "Admins can delete banners" 
ON public.promo_banners FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles
    JOIN roles ON profiles.role_id = roles.id
    WHERE profiles.id = auth.uid() AND roles.name = 'admin'
  )
);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_promo_banners_updated_at
    BEFORE UPDATE ON public.promo_banners
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert seed data
INSERT INTO public.promo_banners (title, subtitle, description, image_url, link_url, badge_text, badge_color, order_index)
VALUES 
(
  'Giảm đến 40%', 
  'Tuần lễ công nghệ', 
  'Nâng cấp không gian làm việc với những thiết bị đỉnh cao.', 
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200&auto=format&fit=crop', 
  '/products?categories=cong-nghe', 
  'Tuần lễ công nghệ', 
  'primary', 
  1
),
(
  'Trang phục Mùa hè', 
  'Bộ sưu tập mới', 
  'Thể hiện phong cách cá nhân với thiết kế tinh tế, tối giản.', 
  'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200&auto=format&fit=crop', 
  '/products?categories=thoi-trang', 
  'Bộ sưu tập mới', 
  'white', 
  2
);
