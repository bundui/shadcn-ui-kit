import { supabase } from "../supabase/client";

export async function getCategories(search?: string, page: number = 1, pageSize: number = 10) {
  let query = supabase
    .from("categories")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  // Tính số lượng record trong trang
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, count, error } = await query;

  const total = count || 0;
  const totalPages = Math.ceil(total / pageSize);

  return {
    data,
    error,
    total,
    page,
    pageSize,
    totalPages
  };
}

export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });

  return { data, error };
}

export async function createCategory(payload: { name: string }) {
  return supabase
    .from("categories")
    .insert([payload])
    .select()
    .single();
}

export async function updateCategory(id: string, payload: { name: string }) {
  return supabase
    .from("categories")
    .update({
      ...payload,
    })
    .eq("id", id);
}

export async function deleteCategory(id: string) {
  return supabase
    .from("categories")
    .delete()
    .eq("id", id);
}
