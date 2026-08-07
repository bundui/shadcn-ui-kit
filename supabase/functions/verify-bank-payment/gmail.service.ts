import { GmailMessage } from "./types.ts";

/**
 * Lấy Access Token mới từ Google OAuth2 bằng Refresh Token.
 * Cần cấu hình GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN trong Deno Environment Variables.
 */
export async function getGmailAccessToken(): Promise<string | null> {
  const clientId = Deno.env.get("GMAIL_CLIENT_ID");
  const clientSecret = Deno.env.get("GMAIL_CLIENT_SECRET");
  const refreshToken = Deno.env.get("GMAIL_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    console.error("❌ [Gmail Service] Thiếu cấu hình GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET hoặc GMAIL_REFRESH_TOKEN trong Deno.env");
    return null;
  }

  try {
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ [Gmail Service] Lỗi khi làm mới Access Token (${response.status}):`, errText);
      return null;
    }

    const data = await response.json();
    return data.access_token || null;
  } catch (err) {
    console.error("❌ [Gmail Service] Ngoại lệ khi lấy Access Token:", err);
    return null;
  }
}

/**
 * Lấy danh sách ID các email chưa đọc trong INBOX (có thể lọc theo từ khóa như Vietcombank/BDSD)
 */
export async function fetchUnreadMessageIds(accessToken: string, maxResults = 15): Promise<string[]> {
  try {
    // Tìm kiếm các email chưa đọc trong INBOX
    const query = encodeURIComponent("is:unread label:INBOX");
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?q=${query}&maxResults=${maxResults}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ [Gmail Service] Lỗi khi tải danh sách email (${response.status}):`, errText);
      return [];
    }

    const data = await response.json();
    if (!data.messages || data.messages.length === 0) {
      console.log("📭 [Gmail Service] Không có email chưa đọc nào trong hộp thư.");
      return [];
    }

    return data.messages.map((m: { id: string }) => m.id);
  } catch (err) {
    console.error("❌ [Gmail Service] Ngoại lệ khi tải danh sách email ID:", err);
    return [];
  }
}

/**
 * Lấy chi tiết toàn bộ nội dung (format=full) của một Gmail Message theo ID
 */
export async function fetchMessageDetail(accessToken: string, messageId: string): Promise<GmailMessage | null> {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error(`❌ [Gmail Service] Lỗi khi tải chi tiết email ${messageId} (${response.status}):`, errText);
      return null;
    }

    const data = await response.json();
    return data as GmailMessage;
  } catch (err) {
    console.error(`❌ [Gmail Service] Ngoại lệ khi tải chi tiết email ${messageId}:`, err);
    return null;
  }
}

/**
 * Đánh dấu email đã đọc (xóa nhãn UNREAD) sau khi xử lý xong
 */
export async function markMessageAsRead(accessToken: string, messageId: string): Promise<boolean> {
  try {
    const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/modify`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        removeLabelIds: ["UNREAD"],
      }),
    });

    if (!response.ok) {
      console.warn(`⚠️ [Gmail Service] Không thể gỡ nhãn UNREAD cho email ${messageId}`);
      return false;
    }

    console.log(`👁️ [Gmail Service] Đã đánh dấu đã đọc (remove UNREAD) cho email ${messageId}`);
    return true;
  } catch (err) {
    console.error(`❌ [Gmail Service] Ngoại lệ khi đánh dấu đã đọc cho email ${messageId}:`, err);
    return false;
  }
}
