import { supabase } from "../supabase/client";

export async function getRole(roleId: string) {
    return supabase.from("roles").select("*").eq("id", roleId).single()
}

export async function getRoles() {
    return supabase.from("roles").select("*").order("name");
}