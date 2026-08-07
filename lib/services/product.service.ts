import { supabase } from "../supabase/client";

export async function getProduct(
  search?: string,
  page: number = 1,
  pageSize: number = 10,
  options?: {
    category_ids?: string[];
    brands?: string[];
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }
) {
  let query = supabase
    .from("products")
    .select("*, categories(name)", { count: "exact" });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }
  
  if (options?.category_ids && options.category_ids.length > 0) {
    query = query.in("category_id", options.category_ids);
  }
  
  if (options?.brands && options.brands.length > 0) {
    query = query.in("brand", options.brands);
  }
  
  if (options?.minPrice !== undefined) {
    query = query.gte("price", options.minPrice);
  }
  
  if (options?.maxPrice !== undefined) {
    query = query.lte("price", options.maxPrice);
  }

  // Sorting
  if (options?.sort === 'price_asc') {
    query = query.order("price", { ascending: true });
  } else if (options?.sort === 'price_desc') {
    query = query.order("price", { ascending: false });
  } else {
    // default: newest
    query = query.order("created_at", { ascending: false });
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;
  
  const totalPages = count ? Math.ceil(count / pageSize) : 1;

  return {
    data,
    error,
    total: count || 0,
    page,
    pageSize,
    totalPages,
  };
}

export async function getDistinctBrands() {
  const { data, error } = await supabase
    .from("products")
    .select("brand")
    .not("brand", "is", null);

  if (error) return { data: null, error };
  
  const brands = Array.from(new Set(data.map((item) => item.brand).filter(Boolean))) as string[];
  return { data: brands.sort(), error: null };
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("slug", slug)
    .single();

  return { data, error };
}

export async function getProductById(id: string) {
  const { data, error } = await supabase
    .from("products")
    .select(`
      *,
      categories(name),
      product_images(id, image_url, display_order),
      product_variants(id, name, sku, price_modifier, stock_quantity),
      product_specs(id, spec_name, spec_value),
      product_reviews(id, rating, comment, created_at, user_id)
    `)
    .eq("id", id)
    .single();

  if (data && data.product_reviews && data.product_reviews.length > 0) {
    const userIds = Array.from(
      new Set(data.product_reviews.map((r: any) => r.user_id).filter(Boolean))
    );

    let profileMap = new Map();
    if (userIds.length > 0) {
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email, avatar_url")
        .in("id", userIds);

      if (profilesData) {
        profilesData.forEach((p: any) => profileMap.set(p.id, p));
      }
    }

    data.product_reviews = data.product_reviews.map((review: any) => {
      const profile = review.profiles || (review.user_id ? profileMap.get(review.user_id) : null);
      let displayName = review.user_name || null;
      if (!displayName && profile) {
        displayName = profile.full_name || (profile.email ? profile.email.split('@')[0] : null);
      }
      return {
        ...review,
        user_name: displayName || "Khách hàng ",
        user_avatar: profile?.avatar_url || review.user_avatar || null,
      };
    });
  }

  return { data, error };
}

export async function getRelatedProducts(categoryId: string | null, excludeProductId: string, limit: number = 3) {
  if (!categoryId) return { data: [], error: null };
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .eq("category_id", categoryId)
    .neq("id", excludeProductId)
    .limit(limit);
    
  return { data, error };
}

export async function getFlashSaleProducts(limit: number = 4) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .gt("discount_percent", 0)
    .order("discount_percent", { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function getNewArrivals(limit: number = 8) {
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false })
    .limit(limit);

  return { data, error };
}

export async function createProduct(payload: { 
  name: string; 
  price: number; 
  image_url?: string | null; 
  category_id?: string | null;
  discount_percent?: number;
  stock_quantity?: number;
  description_html?: string | null;
  brand?: string | null;
}) {
    return supabase
        .from("products")
        .insert([payload])
        .select()
        .single();
}

export async function updateProduct(
  id: string,
  payload: {
    name: string;
    price: number;
    image_url?: string | null;
    category_id?: string | null;
    discount_percent?: number;
    stock_quantity?: number;
    description_html?: string | null;
    brand?: string | null;
  }
) {
  return supabase
    .from("products")
    .update(payload)
    .eq("id", id);
}

export async function deleteProduct(
  id: string
) {
  return supabase
    .from("products")
    .delete()
    .eq("id", id);
}

export async function addProductImages(productId: string, imageUrls: string[]) {
  if (imageUrls.length === 0) return { data: null, error: null };
  const payload = imageUrls.map((url, i) => ({
    product_id: productId,
    image_url: url,
    display_order: i + 1,
  }));
  return supabase.from("product_images").insert(payload);
}

export async function deleteProductImage(imageId: string) {
  return supabase.from("product_images").delete().eq("id", imageId);
}

export async function syncProductVariants(productId: string, variants: { id?: string, name: string, sku: string, price_modifier: number, stock_quantity: number }[]) {
  const { data: existing } = await supabase.from("product_variants").select("id").eq("product_id", productId);
  const existingIds = existing?.map(v => v.id) || [];
  
  const incomingIds = variants.map(v => v.id).filter(Boolean);
  const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
  
  if (idsToDelete.length > 0) {
    await supabase.from("product_variants").delete().in("id", idsToDelete);
  }
  
  if (variants.length > 0) {
    const itemsToInsert = [];
    const itemsToUpdate = [];
    
    for (const v of variants) {
      const item: any = {
        product_id: productId,
        name: v.name,
        sku: v.sku,
        price_modifier: v.price_modifier,
        stock_quantity: v.stock_quantity,
      };
      if (v.id && v.id.length > 0) {
        item.id = v.id;
        itemsToUpdate.push(item);
      } else {
        itemsToInsert.push(item);
      }
    }

    if (itemsToInsert.length > 0) {
      const { error } = await supabase.from("product_variants").insert(itemsToInsert);
      if (error) return { data: null, error };
    }

    if (itemsToUpdate.length > 0) {
      const { error } = await supabase.from("product_variants").upsert(itemsToUpdate);
      if (error) return { data: null, error };
    }
  }
  return { data: null, error: null };
}

export async function syncProductSpecs(productId: string, specs: { id?: string, spec_name: string, spec_value: string }[]) {
  const { data: existing } = await supabase.from("product_specs").select("id").eq("product_id", productId);
  const existingIds = existing?.map(s => s.id) || [];
  
  const incomingIds = specs.map(s => s.id).filter(Boolean);
  const idsToDelete = existingIds.filter(id => !incomingIds.includes(id));
  
  if (idsToDelete.length > 0) {
    await supabase.from("product_specs").delete().in("id", idsToDelete);
  }
  
  if (specs.length > 0) {
    const itemsToInsert = [];
    const itemsToUpdate = [];

    for (const s of specs) {
      const item: any = {
        product_id: productId,
        spec_name: s.spec_name,
        spec_value: s.spec_value,
      };
      if (s.id && s.id.length > 0) {
        item.id = s.id;
        itemsToUpdate.push(item);
      } else {
        itemsToInsert.push(item);
      }
    }

    if (itemsToInsert.length > 0) {
      const { error } = await supabase.from("product_specs").insert(itemsToInsert);
      if (error) return { data: null, error };
    }

    if (itemsToUpdate.length > 0) {
      const { error } = await supabase.from("product_specs").upsert(itemsToUpdate);
      if (error) return { data: null, error };
    }
  }
  return { data: null, error: null };
}