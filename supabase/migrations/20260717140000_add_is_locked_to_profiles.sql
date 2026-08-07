-- Migration: Add is_locked to profiles table
-- Description: Cho phép Admin và Staff khóa/mở khóa tài khoản người dùng (khách hàng)

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
