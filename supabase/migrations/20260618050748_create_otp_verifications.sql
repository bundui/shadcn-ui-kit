create table otp_verifications (
    id uuid primary key default gen_random_uuid(),

    email text not null,

    otp_code text not null,

    temp_token text,

    expires_at timestamptz not null,

    verified boolean default false,

    created_at timestamptz default now()
);