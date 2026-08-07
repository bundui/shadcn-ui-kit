-- Add products table to the supabase_realtime publication
-- This is REQUIRED for Realtime postgres_changes to work
alter publication supabase_realtime add table products;
