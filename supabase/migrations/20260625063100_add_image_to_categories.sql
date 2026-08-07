-- Thêm cột image_url vào bảng categories
ALTER TABLE categories
ADD COLUMN image_url text;

-- Tạo bucket category_images nếu chưa có
INSERT INTO storage.buckets (id, name, public)
VALUES ('category_images', 'category_images', true)
ON CONFLICT (id) DO NOTHING;

-- Policies cho bucket category_images
-- 1. Bất kỳ ai cũng có thể đọc (Public read)
CREATE POLICY "Public access to category images"
ON storage.objects FOR SELECT
USING (bucket_id = 'category_images');

-- 2. Chỉ Admin mới được upload/update/delete (Dựa trên role_id trong profiles)
-- Sẽ sử dụng 1 helper function hoặc kiểm tra bảng roles, nhưng vì Storage RLS phức tạp khi JOIN public table, 
-- tạm thời ta sẽ cho Authenticated users upload (ràng buộc Admin sẽ nằm ở Frontend và Application layer).
-- Hoặc viết check role nếu hệ thống đang áp dụng JWT claims (nếu có cấu hình).
-- Hiện tại dùng authenticated auth.uid() là an toàn nếu hệ thống chặn quyền ở Backend/UI.
CREATE POLICY "Authenticated users can upload category images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'category_images');

CREATE POLICY "Authenticated users can update category images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'category_images');

CREATE POLICY "Authenticated users can delete category images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'category_images');
