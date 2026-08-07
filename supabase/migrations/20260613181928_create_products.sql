create table products (
    id uuid primary key default gen_random_uuid(),

    name text not null,

    price numeric(12,2) not null,

    image_url text,

    created_by uuid references auth.users(id),

    created_at timestamptz default now(),

    updated_at timestamptz default now()
);