-- Create wishlist_groups table
CREATE TABLE IF NOT EXISTS public.wishlist_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS to wishlist_groups
ALTER TABLE public.wishlist_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own wishlist groups"
ON public.wishlist_groups FOR ALL
USING (auth.uid() = user_id);

-- Alter wishlists table to add group_id and note
ALTER TABLE public.wishlists
ADD COLUMN group_id UUID REFERENCES public.wishlist_groups(id) ON DELETE CASCADE,
ADD COLUMN note TEXT;

-- Drop old unique constraint to allow same product in different groups
ALTER TABLE public.wishlists DROP CONSTRAINT IF EXISTS wishlists_user_id_product_id_key;

-- Add new unique constraint so a group cannot have duplicates of the same product
-- Note: if group_id is null, Postgres allows multiple nulls. We will manage "default" group uniqueness in the service layer.
ALTER TABLE public.wishlists ADD CONSTRAINT wishlists_group_id_product_id_key UNIQUE (group_id, product_id);
