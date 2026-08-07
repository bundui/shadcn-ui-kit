import { supabase } from "../supabase/client";

export interface PromoBanner {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url: string;
  link_url?: string;
  badge_text?: string;
  badge_color?: string;
  order_index: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getPromoBanners() {
  const { data, error } = await supabase
    .from("promo_banners")
    .select("*")
    .eq("is_active", true)
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching promo banners:", error);
    return { data: null, error };
  }

  return { data: data as PromoBanner[], error: null };
}

export async function getPromoBannersAdmin(search: string = "", page: number = 1, pageSize: number = 10) {
  let query = supabase.from("promo_banners").select("*", { count: "exact" });

  if (search) {
    query = query.or(`title.ilike.%${search}%,subtitle.ilike.%${search}%`);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.order("order_index", { ascending: true }).order("created_at", { ascending: false }).range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching admin promo banners:", error);
    return { data: null, error, totalPages: 1 };
  }

  const totalPages = count ? Math.ceil(count / pageSize) : 1;
  return { data: data as PromoBanner[], error: null, totalPages };
}

export async function createPromoBanner(bannerData: Omit<PromoBanner, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("promo_banners")
    .insert([bannerData])
    .select()
    .single();

  if (error) {
    console.error("Error creating promo banner:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function updatePromoBanner(id: string, bannerData: Partial<PromoBanner>) {
  const { data, error } = await supabase
    .from("promo_banners")
    .update(bannerData)
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    console.error("Error updating promo banner:", error);
    return { data: null, error };
  }

  return { data, error: null };
}

export async function deletePromoBanner(id: string) {
  const { error } = await supabase
    .from("promo_banners")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting promo banner:", error);
    return { error };
  }

  return { error: null };
}

export async function updatePromoBannerOrders(items: { id: string; order_index: number }[]) {
  for (const item of items) {
    await supabase.from("promo_banners").update({ order_index: item.order_index }).eq("id", item.id);
  }
  return { error: null };
}
