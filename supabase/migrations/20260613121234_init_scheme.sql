create table roles (
    id uuid primary key default gen_random_uuid(),
    name text unique not null
);

insert into roles(name) 
values ('user'), ('admin');

create table profiles (
    id uuid primary key references auth.users(id),
    email text,
    full_name text,
    role_id uuid references roles(id),
    created_at timestamptz default now()
);

