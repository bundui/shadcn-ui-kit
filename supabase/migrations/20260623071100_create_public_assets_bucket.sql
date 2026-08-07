-- Create public_assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('public_assets', 'public_assets', true)
ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for storage.objects
-- Note: Supabase storage tables already have RLS enabled by default.

-- Anyone can read from public_assets
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'public_assets');

-- Admins can insert/upload
CREATE POLICY "Admin Insert"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'public_assets' AND
  EXISTS (
    SELECT 1 FROM profiles
    JOIN roles ON profiles.role_id = roles.id
    WHERE profiles.id = auth.uid() AND roles.name = 'admin'
  )
);

-- Admins can update
CREATE POLICY "Admin Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'public_assets' AND
  EXISTS (
    SELECT 1 FROM profiles
    JOIN roles ON profiles.role_id = roles.id
    WHERE profiles.id = auth.uid() AND roles.name = 'admin'
  )
);

-- Admins can delete
CREATE POLICY "Admin Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'public_assets' AND
  EXISTS (
    SELECT 1 FROM profiles
    JOIN roles ON profiles.role_id = roles.id
    WHERE profiles.id = auth.uid() AND roles.name = 'admin'
  )
);
