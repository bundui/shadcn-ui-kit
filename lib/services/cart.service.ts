import { supabase } from "../supabase/client";

export async function getCart() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const { data, error } = await supabase
    .from("cart_items")
    .select(`
      id,
      quantity,
      product_id,
      variant_id,
      products (
        id,
        name,
        price,
        discount_percent,
        image_url,
        slug
      ),
      product_variants (
        id,
        name,
        price_modifier,
        stock_quantity
      )
    `)
    .eq("user_id", userData.user.id)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function addToCart(productId: string, quantity: number = 1, variantId?: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const userId = userData.user.id;

  // Check if item already exists in cart with same product and variant
  let query = supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("user_id", userId)
    .eq("product_id", productId);
    
  if (variantId) {
    query = query.eq("variant_id", variantId);
  } else {
    query = query.is("variant_id", null);
  }

  const { data: existingItems } = await query;

  if (existingItems && existingItems.length > 0) {
    // If it exists, update quantity
    const item = existingItems[0];
    return supabase
      .from("cart_items")
      .update({ quantity: item.quantity + quantity })
      .eq("id", item.id)
      .select()
      .single();
  } else {
    // If new, insert
    const payload: any = {
      user_id: userId,
      product_id: productId,
      quantity,
    };
    if (variantId) payload.variant_id = variantId;

    return supabase
      .from("cart_items")
      .insert(payload)
      .select()
      .single();
  }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  if (quantity <= 0) {
    return removeFromCart(itemId);
  }

  return supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .eq("user_id", userData.user.id) // Security check
    .select()
    .single();
}

export async function removeFromCart(itemId: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  return supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId)
    .eq("user_id", userData.user.id); // Security check
}

// ==========================================
// GUEST CART SERVICES (CLIENT-SIDE LOCALSTORAGE)
// ==========================================

export interface GuestCartItem {
  id: string; // Unique guest ID e.g., "guest_{productId}_{variantId}"
  quantity: number;
  product_id: string;
  variant_id?: string | null;
  products: {
    id: string;
    name: string;
    price: number;
    discount_percent?: number;
    image_url: string;
    slug: string;
  };
  product_variants?: {
    id: string;
    name: string;
    price_modifier: number;
    stock_quantity: number;
  } | null;
}

const GUEST_CART_KEY = "guest_cart_items";

export function getGuestCartItems(): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function addToGuestCart(item: Omit<GuestCartItem, "id">): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  const items = getGuestCartItems();
  const id = `guest_${item.product_id}_${item.variant_id || "default"}`;

  const existingIndex = items.findIndex(
    (i) => i.product_id === item.product_id && i.variant_id === (item.variant_id || null)
  );

  if (existingIndex > -1) {
    items[existingIndex].quantity += item.quantity;
  } else {
    items.push({
      ...item,
      id,
      variant_id: item.variant_id || null,
    });
  }

  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart-updated"));
  return items;
}

export function updateGuestCartQuantity(itemId: string, quantity: number): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  if (quantity <= 0) {
    return removeFromGuestCart(itemId);
  }

  const items = getGuestCartItems();
  const updated = items.map((i) => (i.id === itemId ? { ...i, quantity } : i));
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("cart-updated"));
  return updated;
}

export function removeFromGuestCart(itemId: string): GuestCartItem[] {
  if (typeof window === "undefined") return [];
  const items = getGuestCartItems();
  const filtered = items.filter((i) => i.id !== itemId);
  localStorage.setItem(GUEST_CART_KEY, JSON.stringify(filtered));
  window.dispatchEvent(new Event("cart-updated"));
  return filtered;
}

export function clearGuestCart(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(GUEST_CART_KEY);
  window.dispatchEvent(new Event("cart-updated"));
}

export async function syncGuestCartToSupabase(): Promise<{ mergedCount: number; error: any }> {
  if (typeof window === "undefined") return { mergedCount: 0, error: null };
  
  const guestItems = getGuestCartItems();
  if (guestItems.length === 0) return { mergedCount: 0, error: null };

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { mergedCount: 0, error: userError || new Error("Not authenticated") };

  let mergedCount = 0;
  const remainingGuestItems = [];
  
  for (const item of guestItems) {
    const { error } = await addToCart(item.product_id, item.quantity, item.variant_id || undefined);
    if (!error) {
      mergedCount += item.quantity;
    } else {
      console.error("❌ [Cart] Lỗi gộp sản phẩm:", error);
      remainingGuestItems.push(item);
    }
  }

  // Clear guest cart once synced to database, keep items that failed
  if (remainingGuestItems.length === 0) {
    clearGuestCart();
  } else {
    if (typeof window !== "undefined") {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(remainingGuestItems));
    }
  }
  
  return { mergedCount, error: remainingGuestItems.length > 0 ? new Error("Một số sản phẩm không thể gộp") : null };
}


