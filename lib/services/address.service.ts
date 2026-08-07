import { supabase } from "../supabase/client";

export async function getAddresses() {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userData.user.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });

  // Tự động khắc phục dữ liệu cũ: Nếu danh sách có địa chỉ nhưng chưa có cái nào là mặc định, gán cái đầu tiên làm mặc định!
  if (data && data.length > 0 && !data.some(a => a.is_default)) {
    data[0].is_default = true;
    supabase.from("addresses").update({ is_default: true }).eq("id", data[0].id).then();
  }

  return { data, error };
}

export async function addAddress(addressData: { full_name: string; phone: string; street: string; city: string; is_default: boolean; type?: string }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  // Nếu khách chưa có địa chỉ nào, tự động chọn địa chỉ đầu tiên này làm mặc định (is_default = true)
  const { count } = await supabase.from("addresses").select("*", { count: "exact", head: true }).eq("user_id", userData.user.id);
  const shouldBeDefault = addressData.is_default || (count === 0);

  if (shouldBeDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userData.user.id);
  }

  const cleanData = { ...addressData } as any;
  delete cleanData.id;

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      ...cleanData,
      is_default: shouldBeDefault,
      user_id: userData.user.id
    })
    .select()
    .single();

  return { data, error };
}

export async function updateAddress(id: string, addressData: { full_name: string; phone: string; street: string; city: string; is_default: boolean; type?: string }) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  if (addressData.is_default) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userData.user.id);
  }

  const cleanData = { ...addressData } as any;
  delete cleanData.id;

  const { data, error } = await supabase
    .from("addresses")
    .update(cleanData)
    .eq("id", id)
    .eq("user_id", userData.user.id) // Ensure security
    .select()
    .single();

  return { data, error };
}

export async function deleteAddress(id: string) {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) return { data: null, error: userError || new Error("User not authenticated") };

  const { data, error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", userData.user.id)
    .select()
    .single();

  return { data, error };
}
