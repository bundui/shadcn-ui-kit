import { supabase } from "../supabase/client";

  export const authService = {
    async login(email: string, password: string) {
      return supabase.auth.signInWithPassword({ email, password });
    },
    async logout() {
      return supabase.auth.signOut();
    },
    async getUser() {
      return supabase.auth.getUser();
    },
    async getSession() {
      return supabase.auth.getSession();
    },
  };