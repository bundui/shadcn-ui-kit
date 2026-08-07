-- Switch to native Supabase OTP
-- 1. Drop the custom otp_verifications table as it is obsolete.
drop table if exists public.otp_verifications;

-- 2. Create a secure function to check if a user is already registered.
-- This function runs with security definer (allowing it to search auth.users which is restricted to clients).
-- It checks if there is a user with the given email, whose email is confirmed, and who has a password set.
create or replace function public.is_email_registered(email_to_check text)
returns boolean
security definer
language plpgsql
as $$
begin
  return exists (
    select 1
    from auth.users
    where email = email_to_check
      and email_confirmed_at is not null
      and encrypted_password is not null
      and encrypted_password <> ''
  );
end;
$$;
