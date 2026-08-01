create table if not exists public.email_send_logs (
  id uuid primary key default gen_random_uuid(),
  mode text not null check (mode in ('all', 'selected')),
  subject text not null,
  message text not null,
  link text,
  recipients_total integer not null default 0,
  success_count integer not null default 0,
  failure_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.email_send_log_results (
  id uuid primary key default gen_random_uuid(),
  log_id uuid not null references public.email_send_logs(id) on delete cascade,
  to_email text not null,
  success boolean not null,
  error text,
  created_at timestamptz not null default now()
);

create index if not exists idx_email_send_logs_created_at_desc
  on public.email_send_logs (created_at desc);

create index if not exists idx_email_send_log_results_log_id
  on public.email_send_log_results (log_id);
