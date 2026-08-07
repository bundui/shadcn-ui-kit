import { supabase } from "../supabase/client";

export async function uploadImage(file: File, folder: string = "banners"): Promise<{ url: string | null; error: any }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('public_assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Upload error:", error);
      return { url: null, error };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('public_assets')
      .getPublicUrl(fileName);

    return { url: publicUrl, error: null };
  } catch (err) {
    console.error("Upload exception:", err);
    return { url: null, error: err };
  }
}

export async function uploadProductImage(file: File) {
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "");
    const fileName = `Products/${Date.now()}-${safeName}`;

    const {data, error} = await supabase.storage
    .from("products-bucket")
    .upload(fileName, file, {
        upsert: true,
    });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from("products-bucket")
    .getPublicUrl(fileName);

    return urlData.publicUrl;
}

export async function uploadProductImages(files: File[]) {
    const uploadPromises = files.map(file => uploadProductImage(file));
    return Promise.all(uploadPromises);
}