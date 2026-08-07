-- Bật RLS cho bảng categories
alter table public.categories enable row level security;

-- 1. SELECT Policy: Ai đã đăng nhập (authenticated) đều có quyền XEM danh sách danh mục
create policy "Cho phép mọi user đã đăng nhập xem danh mục"
on public.categories
for select
to authenticated
using (true);

-- 2. INSERT Policy: Chỉ Admin mới được THÊM danh mục
create policy "Chỉ admin mới được tạo danh mục"
on public.categories
for insert
to authenticated
with check (
  exists (
    select 1 from public.profiles p
    join public.roles r on p.role_id = r.id
    where p.id = auth.uid() and r.name = 'admin'
  )
);

-- 3. UPDATE Policy: Chỉ Admin mới được SỬA danh mục
create policy "Chỉ admin mới được sửa danh mục"
on public.categories
for update
to authenticated
using (
  exists (
    select 1 from public.profiles p
    join public.roles r on p.role_id = r.id
    where p.id = auth.uid() and r.name = 'admin'
  )
)
with check (
  exists (
    select 1 from public.profiles p
    join public.roles r on p.role_id = r.id
    where p.id = auth.uid() and r.name = 'admin'
  )
);

-- 4. DELETE Policy: Chỉ Admin mới được XÓA danh mục
create policy "Chỉ admin mới được xóa danh mục"
on public.categories
for delete
to authenticated
using (
  exists (
    select 1 from public.profiles p
    join public.roles r on p.role_id = r.id
    where p.id = auth.uid() and r.name = 'admin'
  )
);
