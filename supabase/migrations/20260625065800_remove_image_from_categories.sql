-- Xóa cột image_url khỏi bảng categories
ALTER TABLE categories DROP COLUMN IF EXISTS image_url;

-- Xóa các policy của bucket category_images nếu có
DROP POLICY IF EXISTS "Public access to category images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload category images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update category images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete category images" ON storage.objects;
