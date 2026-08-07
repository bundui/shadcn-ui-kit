import { NextResponse } from "next/server";
import { sendBulkEmail } from "@/lib/email/nodemailer";
import { supabaseAdmin } from "@/lib/supabase/admin";

interface BulkEmailRequest {
  mode: "all" | "selected";
  subject: string;
  message: string;
  link?: string;
  recipients?: string[];
}

type EmailLogRow = {
  id: string;
  created_at: string;
  mode: "all" | "selected";
  subject: string;
  message: string;
  link: string | null;
  recipients_total: number;
  success_count: number;
  failure_count: number;
  email_send_log_results?: Array<{
    to_email: string;
    success: boolean;
    error: string | null;
  }>;
};

function mapHistoryRows(rows: EmailLogRow[]) {
  return rows.map((row) => ({
    id: row.id,
    createdAt: row.created_at,
    mode: row.mode,
    subject: row.subject,
    message: row.message,
    link: row.link || undefined,
    recipientsTotal: row.recipients_total,
    successCount: row.success_count,
    failureCount: row.failure_count,
    results: (row.email_send_log_results ?? []).map((result) => ({
      to: result.to_email,
      success: result.success,
      error: result.error || undefined
    }))
  }));
}

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("email_send_logs")
      .select(
        "id, created_at, mode, subject, message, link, recipients_total, success_count, failure_count, email_send_log_results(to_email, success, error)"
      )
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      history: mapHistoryRows((data ?? []) as EmailLogRow[])
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

function buildEmailHtml(subject: string, message: string, link?: string) {
  const safeLink = link
    ? `<p style="margin: 24px 0 0;"><a href="${link}" style="display:inline-block;padding:12px 18px;border-radius:10px;background:#111827;color:#ffffff;text-decoration:none;font-weight:600;">Xem chi tiết</a></p>`
    : "";

  return `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827;background:#f9fafb;padding:24px;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:16px;padding:32px;">
        <p style="margin:0 0 12px;color:#6b7280;font-size:13px;letter-spacing:.08em;text-transform:uppercase;">LuxeCommerce</p>
        <h1 style="margin:0 0 20px;font-size:28px;line-height:1.2;">${subject}</h1>
        <div style="font-size:16px;white-space:pre-line;">${message}</div>
        ${safeLink}
      </div>
    </div>
  `;
}

export async function POST(req: Request) {
  try {
    const body: BulkEmailRequest = await req.json();
    const subject = body.subject?.trim();
    const message = body.message?.trim();

    if (!subject || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields (subject, message)" },
        { status: 400 }
      );
    }

    let recipients: string[] = [];

    if (body.mode === "all") {
      const { data, error } = await supabaseAdmin
        .from("profiles")
        .select("email")
        .not("email", "is", null);

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      recipients = (data ?? [])
        .map((item) => item.email)
        .filter((email): email is string => typeof email === "string" && email.trim().length > 0);
    } else {
      recipients = Array.isArray(body.recipients) ? body.recipients : [];
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { success: false, error: "No email recipients found" },
        { status: 400 }
      );
    }

    const html = buildEmailHtml(subject, message, body.link?.trim() || undefined);
    const text = [subject, "", message, body.link?.trim() ? `Link: ${body.link.trim()}` : null]
      .filter(Boolean)
      .join("\n");

    const result = await sendBulkEmail({
      subject,
      html,
      text,
      recipients
    });
    const resultRows = result.results ?? [];

    const { data: logData, error: logError } = await supabaseAdmin
      .from("email_send_logs")
      .insert({
        mode: body.mode,
        subject,
        message,
        link: body.link?.trim() || null,
        recipients_total: recipients.length,
        success_count: result.successCount,
        failure_count: result.failureCount
      })
      .select("id")
      .single();

    if (!logError && logData?.id && resultRows.length > 0) {
      await supabaseAdmin.from("email_send_log_results").insert(
        resultRows.map((recipientResult) => ({
          log_id: logData.id,
          to_email: recipientResult.to,
          success: recipientResult.success,
          error: recipientResult.error || null
        }))
      );
    }

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ [API bulk-email] Error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
