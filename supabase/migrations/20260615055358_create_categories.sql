create table categories (
    id uuid primary key default gen_random_uuid(),

    name text not null unique,

    created_at timestamptz default now()
);