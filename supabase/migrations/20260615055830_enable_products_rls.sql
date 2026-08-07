alter table products
enable row level security;

create policy "authenticated_can_read_products"
on products
for select
to authenticated
using (true);

