import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.2";
import { getGmailAccessToken, fetchUnreadMessageIds, fetchMessageDetail, markMessageAsRead } from "./gmail.service.ts";
import { parseVcbEmail } from "./parser.service.ts";
import { matchTransactionWithPayment } from "./matcher.service.ts";
import { ParsedTransaction } from "./types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  // Xử lý CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Kiểm tra body (để hỗ trợ chế độ Test/Simulator hoặc Webhook trực tiếp)
    let bodyData: any = {};
    try {
      if (req.method === "POST" && req.headers.get("content-type")?.includes("application/json")) {
        bodyData = await req.json();
      }
    } catch (_) {}

    // ==========================================
    // CHẾ ĐỘ 1: TEST / SIMULATOR TRỰC TIẾP TỪ CLIENT
    // Cho phép gọi giả lập (test_parsed) để kiểm tra khớp đơn không cần kết nối Gmail
    // ==========================================
    if (bodyData && bodyData.test_parsed) {
      console.log("🛠️ [Verify-Bank-Payment] Chạy ở chế độ TEST / SIMULATION với dữ liệu giả lập:");
      const mockParsed: ParsedTransaction = {
        gmailMessageId: bodyData.test_parsed.gmailMessageId || `mock_msg_${Date.now()}`,
        senderName: bodyData.test_parsed.senderName || "TESTER VCB",
        amount: Number(bodyData.test_parsed.amount || 0),
        description: bodyData.test_parsed.description || "LX-TEST",
        transactionTime: new Date().toISOString(),
        rawContent: "Simulation Test Content",
      };

      const matchResult = await matchTransactionWithPayment(supabase, mockParsed);
      return new Response(
        JSON.stringify({
          success: true,
          mode: "SIMULATION",
          matchResult,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // ==========================================
    // CHẾ ĐỘ 2: CHẠY CRON CHUẨN - TẢI GMAIL API
    // ==========================================
    console.log("🚀 [Verify-Bank-Payment] Bắt đầu kiểm tra hộp thư Gmail VCB...");
    const accessToken = await getGmailAccessToken();

    if (!accessToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Không thể lấy Gmail Access Token. Hãy kiểm tra GMAIL_CLIENT_ID / SECRET / REFRESH_TOKEN",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const messageIds = await fetchUnreadMessageIds(accessToken, 20);
    console.log(`📨 [Verify-Bank-Payment] Tìm thấy ${messageIds.length} email chưa đọc.`);

    const results = [];
    let matchedCount = 0;

    for (const msgId of messageIds) {
      try {
        const detail = await fetchMessageDetail(accessToken, msgId);
        if (!detail) continue;

        // 1. Phân tích nội dung email
        const parsed = parseVcbEmail(detail);
        if (!parsed) {
          // Không phải email nhận tiền VCB hoặc không trích xuất được số tiền -> bỏ qua, không đánh dấu đã đọc để an toàn
          continue;
        }

        // 2. Đối chiếu với Payment trong Database
        const matchResult = await matchTransactionWithPayment(supabase, parsed);

        // 3. Đánh dấu email đã đọc (xóa nhãn UNREAD) nếu xử lý hoặc bóc tách thành công
        await markMessageAsRead(accessToken, msgId);

        if (matchResult.matched) {
          matchedCount++;
        }

        results.push({
          messageId: msgId,
          parsed: {
            amount: parsed.amount,
            code: parsed.description,
            sender: parsed.senderName,
          },
          matchResult,
        });
      } catch (innerErr: any) {
        console.error(`❌ [Verify-Bank-Payment] Lỗi khi xử lý email ID ${msgId}:`, innerErr);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        mode: "GMAIL_LIVE",
        totalChecked: messageIds.length,
        matchedCount,
        results,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err: any) {
    console.error("❌ [Verify-Bank-Payment] Ngoại lệ nghiêm trọng tại Edge Function:", err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message || "Unknown Edge Function Error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
