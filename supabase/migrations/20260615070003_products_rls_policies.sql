-- INSERT

create policy "authenticated_can_insert_products"
on products
for insert
to authenticated
with check (
  true
);


-- UPDATE

create policy "authenticated_can_update_products"
on products
for update
to authenticated
using (
  true
)
with check (
  true
);


-- DELETE

create policy "authenticated_can_delete_products"
on products
for delete
to authenticated
using (
  true
);