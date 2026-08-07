import { supabase } from "../supabase/client";

export type NotificationType = 'order' | 'promotion' | 'system' | 'alert' | 'coupon' | 'welcome' | 'review';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  is_read: boolean;
  created_at: string;
  profiles?: {
    id?: string;
    full_name?: string;
    email?: string;
  } | null;
  recipients_count?: number;
  is_broadcast?: boolean;
}

export async function getUserNotifications(userId: string) {
  return supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
}

export async function markNotificationAsRead(id: string) {
  return supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
}

export async function markAllNotificationsAsRead(userId: string) {
  return supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", userId);
}

export async function getUnreadCount(userId: string) {
  return supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);
}

// Admin / System function to send a broadcast notification
// This will fetch all users and insert a notification for each
export async function broadcastNotification(payload: {
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}) {
  // 1. Fetch all user IDs
  const { data: profiles, error: fetchError } = await supabase
    .from("profiles")
    .select("id");

  if (fetchError) throw fetchError;
  if (!profiles || profiles.length === 0) return { data: null, error: null };

  // 2. Prepare payload for all users
  const notificationsToInsert = profiles.map(profile => ({
    user_id: profile.id,
    title: payload.title,
    message: payload.message,
    type: payload.type,
    link: payload.link,
    is_broadcast: true,
  }));

  // 3. Bulk insert
  return supabase
    .from("notifications")
    .insert(notificationsToInsert);
}

export async function getBroadcastHistory() {
  const { data, error } = await supabase
    .from("notifications")
    .select("*, profiles(id, full_name, email)")
    .order("created_at", { ascending: false })
    .limit(300);

  if (error) return { data: null, error };

  // Group Broadcast batches accurately while keeping Targeted messages distinct
  const uniqueMap = new Map<string, Notification>();
  data?.forEach((item: any) => {
    const timeBucket = item.created_at ? item.created_at.substring(0, 16) : ""; // YYYY-MM-DDTHH:mm
    const isBroadcastFlag = item.is_broadcast === true;
    // Nếu là targeted message, dùng ID để mỗi tin nhắn cá nhân hiển thị trên 1 dòng riêng với thông tin người nhận
    // Nếu là broadcast, gộp theo title + message + timeBucket để hiển thị số lượng người nhận
    const key = isBroadcastFlag ? `broadcast|${item.title}|${item.message}|${timeBucket}` : `targeted|${item.id}`;

    if (!uniqueMap.has(key)) {
      uniqueMap.set(key, {
        ...item,
        recipients_count: 1,
        is_broadcast: isBroadcastFlag,
      });
    } else {
      const existing = uniqueMap.get(key)!;
      const count = (existing.recipients_count || 1) + 1;
      uniqueMap.set(key, {
        ...existing,
        recipients_count: count,
        is_broadcast: true,
      });
    }
  });

  return { data: Array.from(uniqueMap.values()), error: null };
}

export async function sendTargetedNotification(userId: string, payload: {
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
}) {
  return supabase
    .from("notifications")
    .insert({
      user_id: userId,
      title: payload.title,
      message: payload.message,
      type: payload.type,
      link: payload.link,
      is_broadcast: false,
    });
}

export async function deleteNotification(id: string) {
  return supabase
    .from("notifications")
    .delete()
    .eq("id", id);
}

export async function deleteBroadcast(title: string, message: string) {
  return supabase
    .from("notifications")
    .delete()
    .eq("title", title)
    .eq("message", message);
}

export async function searchUsersForNotification(query: string) {
  return supabase
    .from("profiles")
    .select("id, full_name, email")
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .limit(10);
}

