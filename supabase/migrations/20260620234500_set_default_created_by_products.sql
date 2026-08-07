ALTER TABLE products 
ALTER COLUMN created_by SET DEFAULT auth.uid();
