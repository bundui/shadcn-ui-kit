import { supabase } from "../supabase/client";

/**
 * Checks if the email is already registered, verified, and has a password.
 * Uses the secure PostgreSQL RPC function.
 */
export async function isEmailRegistered(email: string): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_email_registered", {
    email_to_check: email,
  });

  if (error) {
    console.error("Error checking email registration:", error);
    // Fallback to checking the profiles table if RPC fails
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("email", email)
      .maybeSingle();
    return !!profile;
  }

  return !!data;
}

/**
 * Triggers native Supabase OTP sending.
 * Creates an unconfirmed user in auth.users if they do not exist yet.
 */
export async function sendOtp(email: string) {
  return supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });
}

/**
 * Verifies the 6-digit OTP code against Supabase Auth.
 * Automatically logs the user in (sets session) on success.
 */
export async function verifyOtp(email: string, token: string) {
  return supabase.auth.verifyOtp({
    email,
    token,
    type: "email",
  });
}

/**
 * Sets the password and name for the newly registered user.
 * Assumes the user is already signed in (has a valid session from verifyOtp).
 */
export async function completeRegister(name: string, passwordInput: string) {
  // 1. Get current logged-in user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error(userError?.message || "No authenticated user session found");
  }

  // 2. Set password and metadata
  const { data: updatedUser, error: updateError } = await supabase.auth.updateUser({
    password: passwordInput,
    data: {
      full_name: name,
    },
  });

  if (updateError) {
    throw updateError;
  }

  // 3. Update public.profiles table
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: name,
    })
    .eq("id", user.id);

  if (profileError) {
    console.error("Error updating public profile:", profileError);
    // We don't fail the whole registration if public profile update fails, but log it
  }

  return updatedUser;
}
