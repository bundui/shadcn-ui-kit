-- Migration: Sync Google OAuth avatar_url & full_name on both INSERT and UPDATE of auth.users + Backfill existing users
-- 1. Cập nhật function handle_new_user để đồng bộ avatar_url và full_name cả khi tạo mới lẫn khi đăng nhập/cập nhật qua Google OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_role uuid;
    user_full_name text;
    user_avatar text;
BEGIN
    SELECT id
    INTO user_role
    FROM public.roles
    WHERE name = 'user';

    -- Lấy full_name từ metadata (Google OAuth gửi full_name hoặc name)
    user_full_name := COALESCE(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1)
    );

    -- Lấy avatar_url từ metadata (Google OAuth thường gửi trong 'picture' hoặc 'avatar_url')
    user_avatar := COALESCE(
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'picture'
    );

    -- Nếu là INSERT (tài khoản mới): Thêm vào profiles
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO public.profiles(id, email, full_name, avatar_url, role_id)
        VALUES (new.id, new.email, user_full_name, user_avatar, user_role)
        ON CONFLICT (id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            avatar_url = EXCLUDED.avatar_url,
            email = EXCLUDED.email;
    -- Nếu là UPDATE (đăng nhập lại qua Google OAuth): Cập nhật avatar_url và full_name nếu profiles đang trống
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

-- 2. Đảm bảo trigger chạy cho cả INSERT và UPDATE trên auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT OR UPDATE ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Backfill (Cập nhật dữ liệu cũ): Đồng bộ toàn bộ avatar_url và full_name cho các tài khoản Google OAuth hiện có trong database
UPDATE public.profiles p
SET 
    avatar_url = COALESCE(p.avatar_url, u.raw_user_meta_data->>'avatar_url', u.raw_user_meta_data->>'picture'),
    full_name = COALESCE(p.full_name, u.raw_user_meta_data->>'full_name', u.raw_user_meta_data->>'name', split_part(u.email, '@', 1))
FROM auth.users u
WHERE p.id = u.id AND (p.avatar_url IS NULL OR p.full_name IS NULL);
