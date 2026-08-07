-- ==============================================================================
-- Migration: Cập nhật RLS Policy cho bảng notifications (Cho phép Admin xem lịch sử)
-- Date: 2026-07-14
-- Description: Bổ sung chính sách SELECT cho phép người dùng có quyền Admin 
--              xem được toàn bộ thông báo (bao gồm thông báo gửi riêng cho từng user)
-- ==============================================================================

-- 1. Thêm Policy cho phép Admin xem toàn bộ bảng notifications
DROP POLICY IF EXISTS "Admins can view all notifications" ON public.notifications;
create policy "Admins can view all notifications"
on public.notifications
for select
to authenticated
using (
  exists (
    select 1 from public.profiles p
    join public.roles r on p.role_id = r.id
    where p.id = auth.uid() and r.name = 'admin'
  )
);
