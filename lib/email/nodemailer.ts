import nodemailer from "nodemailer";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface BulkSendEmailOptions {
  subject: string;
  html: string;
  text?: string;
  recipients: string[];
}

function getTransporter() {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailPass
    }
  });
}

/**
 * Chuyển đổi HTML sang plain text sạch, bảo toàn cấu trúc đọc được.
 * Giúp Gmail nhận diện email multipart/alternative hợp lệ (giảm Spam Score).
 */
function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<\/td>/gi, "\t")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&copy;/gi, "©")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\t{2,}/g, "\t")
    .replace(/[ ]{2,}/g, " ")
    .trim();
}

export async function sendEmail(options: SendEmailOptions) {
  const gmailUser = process.env.GMAIL_USER;
  const gmailPass = process.env.GMAIL_APP_PASSWORD;

  if (!gmailUser || !gmailPass) {
    console.warn("⚠️ [Email Service] GMAIL_USER hoặc GMAIL_APP_PASSWORD chưa được cấu hình.");
    return { success: false, error: "Missing Gmail credentials" };
  }

  const transporter = getTransporter();
  if (!transporter) {
    return { success: false, error: "Could not create transporter" };
  }

  try {
    const text = options.text || htmlToPlainText(options.html);

    const info = await transporter.sendMail({
      // Chuẩn RFC 5322: Format tên thương hiệu kèm email thật để tránh bị nhận diện là Bulk/Spam
      from: `"LuxeCommerce" <${gmailUser}>`,
      replyTo: `"LuxeCommerce Hỗ Trợ" <${gmailUser}>`,
      to: options.to,
      subject: options.subject,
      text,
      html: options.html,
      headers: {
        // Headers chuẩn cho email giao dịch (transactional receipt), không dùng List-Unsubscribe giả
        "X-Entity-Ref-ID": `ORD-${Date.now()}`
      }
    });

    console.log(
      "✅ [Email Service] Đã gửi email thành công đến:",
      options.to,
      "| MessageID:",
      info.messageId
    );
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ [Email Service] Lỗi khi gửi email:", error);
    const errStr =
      typeof error === "string"
        ? error
        : error?.message ||
          error?.code ||
          error?.response ||
          error?.toString() ||
          "Lỗi gửi email không xác định";
    return { success: false, error: errStr };
  }
}

export async function sendBulkEmail(options: BulkSendEmailOptions) {
  const uniqueRecipients = Array.from(
    new Set(options.recipients.map((recipient) => recipient.trim()).filter(Boolean))
  );

  if (uniqueRecipients.length === 0) {
    return { success: false, error: "Missing recipients" };
  }

  const results: Array<{
    to: string;
    success: boolean;
    messageId?: string;
    error?: string;
  }> = [];

  for (const recipient of uniqueRecipients) {
    const result = await sendEmail({
      to: recipient,
      subject: options.subject,
      html: options.html,
      text: options.text
    });

    results.push({
      to: recipient,
      success: result.success,
      messageId: result.success ? result.messageId : undefined,
      error: result.success
        ? undefined
        : typeof result.error === "string"
          ? result.error
          : "Email sending failed"
    });
  }

  const successCount = results.filter((item) => item.success).length;

  return {
    success: successCount > 0,
    successCount,
    failureCount: results.length - successCount,
    results
  };
}
