export type EmailType = "marketing" | "system" | "standard";

export function generateEmailHtml(type: EmailType, subject: string, message: string, link?: string) {
  switch (type) {
    case "marketing":
      return generateMarketingHtml(subject, message, link);
    case "system":
      return generateSystemHtml(subject, message, link);
    case "standard":
    default:
      return generateStandardHtml(subject, message, link);
  }
}

function generateMarketingHtml(subject: string, message: string, link?: string) {
  const safeLink = link
    ? `<div style="text-align: center; margin-top: 40px;">
         <a href="${link}" style="display:inline-block;padding:16px 36px;border-radius:9999px;background:linear-gradient(135deg, #10b981 0%, #0d9488 100%);background-color:#10b981;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4);letter-spacing:0.5px;">
           Khám Phá Ngay
         </a>
       </div>`
    : "";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
  <div style="font-family:'Inter', 'Helvetica Neue', Arial, sans-serif;line-height:1.6;color:#1f2937;background:#f3f4f6;padding:40px 20px;min-height:100vh;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:24px;overflow:hidden;box-shadow:0 20px 40px -10px rgba(0, 0, 0, 0.08); border: 1px solid rgba(0,0,0,0.04);">
      <div style="background: linear-gradient(135deg, #10b981 0%, #0d9488 100%); background-color:#10b981; padding: 48px 32px; text-align: center; position: relative;">
        <h2 style="margin:0;color:rgba(255,255,255,0.9);font-size:14px;letter-spacing:3px;text-transform:uppercase;font-weight:600;">Luxe Commerce</h2>
        <h1 style="margin:20px 0 0;font-size:36px;line-height:1.2;color:#ffffff;font-weight:900;letter-spacing:-0.5px;">${subject}</h1>
      </div>
      <div style="padding:48px 40px;">
        <div style="font-size:16px;white-space:pre-line;color:#4b5563;text-align:center;line-height:1.8;">${message}</div>
        ${safeLink}
      </div>
      <div style="background:#f8fafc;padding:32px 40px;text-align:center;border-top:1px solid #f1f5f9;">
        <p style="margin:0 0 16px;color:#94a3b8;font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:1px;">Kết nối với chúng tôi</p>
        <div style="margin-bottom: 24px;">
          <a href="#" style="display:inline-block;width:36px;height:36px;border-radius:50%;background:#e2e8f0;margin:0 8px;line-height:36px;color:#64748b;text-decoration:none;font-weight:bold;">FB</a>
          <a href="#" style="display:inline-block;width:36px;height:36px;border-radius:50%;background:#e2e8f0;margin:0 8px;line-height:36px;color:#64748b;text-decoration:none;font-weight:bold;">IG</a>
          <a href="#" style="display:inline-block;width:36px;height:36px;border-radius:50%;background:#e2e8f0;margin:0 8px;line-height:36px;color:#64748b;text-decoration:none;font-weight:bold;">TW</a>
        </div>
        <p style="margin:0;color:#cbd5e1;font-size:12px;">© ${new Date().getFullYear()} Luxe Commerce. Tất cả quyền được bảo lưu.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateSystemHtml(subject: string, message: string, link?: string) {
  const safeLink = link
    ? `<div style="margin-top: 32px;"><a href="${link}" style="display:inline-block;padding:12px 24px;border-radius:8px;background:#0f172a;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">Xem chi tiết thông báo</a></div>`
    : "";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc;">
  <div style="font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;line-height:1.6;color:#334155;background:#f8fafc;padding:40px 20px;">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-top:4px solid #0f172a;border-radius:12px;padding:40px;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.05);">
      <div style="margin-bottom:32px;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td width="48" valign="middle">
              <div style="width:40px;height:40px;background:#0f172a;border-radius:10px;color:#fff;font-weight:bold;font-size:18px;text-align:center;line-height:40px;">LC</div>
            </td>
            <td valign="middle">
              <div style="font-weight:700;color:#0f172a;letter-spacing:0.5px;font-size:18px;">Luxe Commerce</div>
              <div style="font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-top:2px;">Hệ thống thông báo</div>
            </td>
          </tr>
        </table>
      </div>
      <h1 style="margin:0 0 24px;font-size:22px;line-height:1.4;color:#0f172a;font-weight:800;border-bottom:2px solid #f1f5f9;padding-bottom:20px;">${subject}</h1>
      <div style="font-size:15px;white-space:pre-line;color:#475569;line-height:1.7;">${message}</div>
      ${safeLink}
      <div style="margin-top:48px;padding-top:24px;border-top:1px solid #f1f5f9;font-size:12px;color:#94a3b8;line-height:1.5;">
        Đây là email tự động từ hệ thống bảo mật và vận hành của Luxe Commerce.<br/>
        Vui lòng không trả lời email này. Nếu bạn cần hỗ trợ, hãy liên hệ bộ phận CSKH.
      </div>
    </div>
  </div>
</body>
</html>`;
}

function generateStandardHtml(subject: string, message: string, link?: string) {
  const safeLink = link
    ? `<div style="margin-top: 32px;"><a href="${link}" style="display:inline-block;padding:14px 28px;border-radius:12px;background:#18181b;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;">Mở liên kết đính kèm</a></div>`
    : "";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa;">
  <div style="font-family:'Inter', Arial, sans-serif;line-height:1.6;color:#27272a;background:#fafafa;padding:40px 20px;">
    <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e4e4e7;border-radius:20px;padding:48px 40px;box-shadow:0 10px 15px -3px rgba(0, 0, 0, 0.02);">
      <p style="margin:0 0 16px;color:#a1a1aa;font-size:13px;font-weight:600;letter-spacing:1px;text-transform:uppercase;">Thông điệp từ Luxe Commerce</p>
      <h1 style="margin:0 0 24px;font-size:28px;line-height:1.3;color:#18181b;font-weight:800;letter-spacing:-0.5px;">${subject}</h1>
      <div style="font-size:16px;white-space:pre-line;color:#52525b;line-height:1.8;">${message}</div>
      ${safeLink}
      <div style="margin-top: 48px;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td valign="middle">
              <div style="width:48px; height:4px; background:#e4e4e7; border-radius:2px;"></div>
            </td>
            <td valign="middle" style="padding-left:16px;">
              <span style="font-size:14px; font-weight:500; color:#a1a1aa;">Trân trọng</span>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</body>
</html>`;
}
