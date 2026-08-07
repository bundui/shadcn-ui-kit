import { supabase } from "../supabase/client";

export async function getProfile(userId: string) {
    if (!userId) throw new Error("User ID is required");

    return supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
}

export async function updateProfile(userId: string, data: { full_name?: string; phone?: string; avatar_url?: string }) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone: data.phone,
      avatar_url: data.avatar_url
    })
    .eq("id", userId)
    .select()
    .single();

  if (data.avatar_url && !error) {
    await supabase.auth.updateUser({
      data: { avatar_url: data.avatar_url }
    });
  }

  return { data: profile, error };
}

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });
    
  if (uploadError) {
    throw uploadError;
  }
  
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);
    
  return data.publicUrl;
}

export async function updatePassword(password: string) {
  const { data, error } = await supabase.auth.updateUser({
    password: password
  });

  return { data, error };
}