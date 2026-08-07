-- Cập nhật trigger handle_new_user để lấy full_name và avatar_url từ Google OAuth metadata
create or replace function public.handle_new_user() 
returns trigger 
language plpgsql
security definer
as $$
declare
    user_role uuid;
    user_full_name text;
    user_avatar text;
begin
    select id
    into user_role
    from public.roles
    where name = 'user';

    -- Lấy full_name từ metadata (Google OAuth gửi full_name, hoặc name)
    user_full_name := coalesce(
        new.raw_user_meta_data->>'full_name',
        new.raw_user_meta_data->>'name',
        split_part(new.email, '@', 1)
    );

    -- Lấy avatar_url từ metadata (Google OAuth gửi avatar_url hoặc picture)
    user_avatar := coalesce(
        new.raw_user_meta_data->>'avatar_url',
        new.raw_user_meta_data->>'picture'
    );

    insert into public.profiles(id, email, full_name, avatar_url, role_id)
    values (new.id, new.email, user_full_name, user_avatar, user_role);

    return new;
end;
$$;

-- Trigger đã tồn tại, chỉ cần replace function là đủ
