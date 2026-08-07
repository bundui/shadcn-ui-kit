import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// Helper to check if the current Supabase session is still valid (not expired)
export const isSessionValid = async (): Promise<boolean> => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return false;
    // Supabase session contains expires_at as a Unix timestamp (seconds)
    const expiresAt = data.session.expires_at;
    if (!expiresAt) return true; // If no expiry info, assume valid
    const now = Math.floor(Date.now() / 1000);
    return now < expiresAt; 
    // boolean
};

// Simple event emitter for auth related custom events (e.g., sessionExpired)
export const authEventTarget = new EventTarget();
export const emitSessionExpired = () => {
    authEventTarget.dispatchEvent(new Event('sessionExpired'));
};
