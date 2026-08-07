-- Add profiles table to the supabase_realtime publication to support zero-latency auto-logout when an account is locked
alter publication supabase_realtime add table profiles;
