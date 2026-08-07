create table notifications (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    message text not null,
    type text not null, -- e.g. 'order', 'promotion', 'system'
    link text,
    is_read boolean default false,
    created_at timestamptz default now()
);

-- Bật RLS
alter table notifications enable row level security;

-- Policy cho phép người dùng tự xem thông báo của mình
create policy "Users can view their own notifications"
on notifications for select
to authenticated
using ( auth.uid() = user_id );

-- Policy cho phép hệ thống/Admin tạo thông báo.
-- Ở đây tạm thời cấp quyền cho Authenticated được insert, 
-- để Admin có thể gửi thông báo. Thực tế nên check role.
create policy "Authenticated users can create notifications"
on notifications for insert
to authenticated
with check ( true );

-- Policy cho phép user tự đánh dấu đọc (update) thông báo của mình
create policy "Users can update their own notifications"
on notifications for update
to authenticated
using ( auth.uid() = user_id );

-- Policy cho Admin xóa thông báo (nếu cần)
create policy "Authenticated users can delete notifications"
on notifications for delete
to authenticated
using ( true );

-- Bật tính năng Realtime cho bảng notifications
alter publication supabase_realtime add table notifications;
