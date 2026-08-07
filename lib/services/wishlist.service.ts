import { supabase } from "../supabase/client";

export async function getWishlist() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const { data, error } = await supabase
    .from("wishlists")
    .select(`
      id,
      product_id,
      group_id,
      note,
      created_at,
      products (
        id,
        name,
        price,
        discount_percent,
        image_url,
        slug
      ),
      wishlist_groups (
        id,
        name
      )
    `)
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function checkWishlisted(productId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return false;

  const { data } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", userData.user.id)
    .eq("product_id", productId)
    .limit(1);

  return data && data.length > 0;
}

export async function addToWishlistWithGroup(productId: string, groupId: string | null, note: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  // Delete existing if any (since unique constraint is group_id + product_id, but we want 1 product to exist at most once across all groups or allowed multiple? The user said "1 sản phẩm có thể nằm trong 2 nhóm khác nhau", but our old checkWishlisted checks just product_id. Let's just insert.)
  
  const payload: any = {
    user_id: userData.user.id,
    product_id: productId,
    note: note || null
  };
  
  if (groupId) {
    payload.group_id = groupId;
  }

  const { data, error } = await supabase
    .from("wishlists")
    .insert(payload)
    .select();

  return { data, error };
}

export async function removeFromWishlistByProduct(productId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const { data, error } = await supabase
    .from("wishlists")
    .delete()
    .eq("product_id", productId)
    .eq("user_id", userData.user.id)
    .select();

  return { data, error };
}

export async function removeFromWishlist(id: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const { data, error } = await supabase
    .from("wishlists")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .select();

  return { data, error };
}

export async function getWishlistGroups() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const { data, error } = await supabase
    .from("wishlist_groups")
    .select("id, name, created_at")
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: true });

  return { data, error };
}

export async function createWishlistGroup(name: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const { data, error } = await supabase
    .from("wishlist_groups")
    .insert({
      user_id: userData.user.id,
      name
    })
    .select()
    .single();

  return { data, error };
}
