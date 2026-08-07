export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  variant?: string;
  imageUrl?: string;
}

export interface OrderConfirmationData {
  orderId: string;
  fullName: string;
  phone?: string;
  address?: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod?: string;
  createdAt?: string;
}

export interface OrderDeliveredData {
  orderId: string;
  fullName: string;
  phone?: string;
  address?: string;
  totalAmount: number;
  deliveredAt?: string;
}

export function generateOrderConfirmationHtml(data: OrderConfirmationData): string {
  const shortId = data.orderId ? data.orderId.split("-")[0].toUpperCase() : "ORD";
  const formattedTotal = Number(data.totalAmount || 0).toLocaleString("vi-VN") + " VND";
  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleDateString("vi-VN");

  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#2d2d2d;">
        <strong>${item.name}</strong>${item.variant ? `<br><span style="font-size:12px;color:#888;">Ph\u00e2n lo\u1ea1i: ${item.variant}</span>` : ""}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#555;text-align:center;">
        x${item.quantity}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:14px;color:#2d2d2d;font-weight:600;text-align:right;">
        ${Number(item.price * item.quantity).toLocaleString("vi-VN")} VND
      </td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>X\u00e1c nh\u1eadn \u0111\u01a1n h\u00e0ng #${shortId}</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f4f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f7;padding:24px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;width:100%;border-collapse:collapse;">

          <!-- Header -->
          <tr>
            <td style="background-color:#111827;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:24px;font-weight:bold;color:#f59e0b;letter-spacing:1px;">LUXE COMMERCE</p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="background-color:#fef3c7;padding:14px 32px;text-align:center;">
              <p style="margin:0;font-size:15px;font-weight:bold;color:#92400e;">\u0110\u01a1n h\u00e0ng #${shortId} \u0111\u00e3 \u0111\u01b0\u1ee3c ti\u1ebfp nh\u1eadn</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#111827;">Xin ch\u00e0o <strong>${data.fullName || "Qu\u00fd kh\u00e1ch"}</strong>,</p>
              <p style="margin:0 0 24px;font-size:14px;color:#4b5563;line-height:1.7;">
                C\u1ea3m \u01a1n b\u1ea1n \u0111\u00e3 \u0111\u1eb7t h\u00e0ng t\u1ea1i <strong>LuxeCommerce</strong>. \u0110\u01a1n h\u00e0ng c\u1ee7a b\u1ea1n \u0111ang \u0111\u01b0\u1ee3c x\u1eed l\u00fd v\u00e0 s\u1ebd s\u1edbm \u0111\u01b0\u1ee3c giao \u0111\u1ebfn \u0111\u1ecba ch\u1ec9 c\u1ee7a b\u1ea1n.
              </p>

              <!-- Order Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;margin-bottom:24px;border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;width:140px;">M\u00e3 \u0111\u01a1n h\u00e0ng</td>
                  <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;font-weight:600;">#${shortId}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Ng\u00e0y \u0111\u1eb7t</td>
                  <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${dateStr}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#6b7280;">Thanh to\u00e1n</td>
                  <td style="padding:14px 16px;border-bottom:1px solid #e5e7eb;font-size:14px;color:#111827;">${data.paymentMethod === "banking" ? "Chuy\u1ec3n kho\u1ea3n ng\u00e2n h\u00e0ng" : "Thanh to\u00e1n khi nh\u1eadn h\u00e0ng (COD)"}</td>
                </tr>
                <tr>
                  <td style="padding:14px 16px;font-size:13px;color:#6b7280;">\u0110\u1ecba ch\u1ec9 giao</td>
                  <td style="padding:14px 16px;font-size:14px;color:#111827;">${data.address || "Ch\u01b0a c\u1eadp nh\u1eadt"} ${data.phone ? `- ${data.phone}` : ""}</td>
                </tr>
              </table>

              <!-- Items Header -->
              <p style="margin:0 0 12px;font-size:15px;font-weight:bold;color:#111827;border-bottom:2px solid #111827;padding-bottom:8px;">Chi ti\u1ebft \u0111\u01a1n h\u00e0ng</p>

              <!-- Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;border-collapse:collapse;">
                <thead>
                  <tr>
                    <th align="left" style="padding:10px 16px;font-size:12px;color:#9ca3af;text-transform:uppercase;font-weight:600;border-bottom:1px solid #e5e7eb;">S\u1ea3n ph\u1ea9m</th>
                    <th align="center" style="padding:10px 16px;font-size:12px;color:#9ca3af;text-transform:uppercase;font-weight:600;border-bottom:1px solid #e5e7eb;">SL</th>
                    <th align="right" style="padding:10px 16px;font-size:12px;color:#9ca3af;text-transform:uppercase;font-weight:600;border-bottom:1px solid #e5e7eb;">Th\u00e0nh ti\u1ec1n</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <!-- Total -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 16px;text-align:right;font-size:13px;color:#6b7280;">T\u1ed5ng thanh to\u00e1n:</td>
                  <td style="padding:14px 16px;text-align:right;font-size:18px;font-weight:bold;color:#d97706;width:180px;">${formattedTotal}</td>
                </tr>
              </table>

              <!-- Support -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#eff6ff;border:1px solid #bfdbfe;margin-bottom:0;border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 16px;font-size:13px;color:#1e40af;line-height:1.6;">
                    N\u1ebfu b\u1ea1n c\u1ea7n h\u1ed7 tr\u1ee3, vui l\u00f2ng tr\u1ea3 l\u1eddi tr\u1ef1c ti\u1ebfp email n\u00e0y. Ch\u00fang t\u00f4i lu\u00f4n s\u1eb5n s\u00e0ng gi\u00fap \u0111\u1ee1 b\u1ea1n.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">
                LuxeCommerce - H\u1ec7 th\u1ed1ng mua s\u1eafm tr\u1ef1c tuy\u1ebfn
              </p>
              <p style="margin:0;font-size:11px;color:#d1d5db;">
                B\u1ea1n nh\u1eadn \u0111\u01b0\u1ee3c email n\u00e0y v\u00ec \u0111\u00e3 \u0111\u1eb7t h\u00e0ng t\u1ea1i LuxeCommerce. \u0110\u1ec3 h\u1ee7y nh\u1eadn th\u00f4ng b\u00e1o, vui l\u00f2ng tr\u1ea3 l\u1eddi email v\u1edbi ti\u00eau \u0111\u1ec1 "unsubscribe".
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generateOrderDeliveredHtml(data: OrderDeliveredData): string {
  const shortId = data.orderId ? data.orderId.split("-")[0].toUpperCase() : "ORD";
  const formattedTotal = Number(data.totalAmount || 0).toLocaleString("vi-VN") + " VND";
  const dateStr = data.deliveredAt
    ? new Date(data.deliveredAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleDateString("vi-VN");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shadcn-admin-dashboard-free-eight.vercel.app";

  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>\u0110\u01a1n h\u00e0ng #${shortId} \u0111\u00e3 giao th\u00e0nh c\u00f4ng</title>
</head>
<body style="margin:0;padding:0;background-color:#f2f4f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f4f7;padding:24px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;max-width:600px;width:100%;border-collapse:collapse;">

          <!-- Header -->
          <tr>
            <td style="background-color:#111827;padding:28px 32px;text-align:center;">
              <p style="margin:0;font-size:24px;font-weight:bold;color:#f59e0b;letter-spacing:1px;">LUXE COMMERCE</p>
            </td>
          </tr>

          <!-- Status Banner -->
          <tr>
            <td style="background-color:#d1fae5;padding:14px 32px;text-align:center;">
              <p style="margin:0;font-size:15px;font-weight:bold;color:#065f46;">Giao h\u00e0ng th\u00e0nh c\u00f4ng - \u0110\u01a1n #${shortId}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:28px 32px;">
              <p style="margin:0 0 16px;font-size:16px;color:#111827;">Xin ch\u00e0o <strong>${data.fullName || "Qu\u00fd kh\u00e1ch"}</strong>,</p>
              <p style="margin:0 0 24px;font-size:14px;color:#4b5563;line-height:1.7;">
                \u0110\u01a1n h\u00e0ng <strong>#${shortId}</strong> tr\u1ecb gi\u00e1 <strong>${formattedTotal}</strong> \u0111\u00e3 \u0111\u01b0\u1ee3c giao th\u00e0nh c\u00f4ng \u0111\u1ebfn \u0111\u1ecba ch\u1ec9 c\u1ee7a b\u1ea1n v\u00e0o ng\u00e0y <strong>${dateStr}</strong>.
              </p>

              <!-- Delivery Info Card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0fdf4;border:1px solid #bbf7d0;margin-bottom:24px;border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 16px;font-size:13px;color:#6b7280;width:140px;border-bottom:1px solid #bbf7d0;">\u0110\u1ecba ch\u1ec9 nh\u1eadn h\u00e0ng</td>
                  <td style="padding:14px 16px;font-size:14px;color:#065f46;border-bottom:1px solid #bbf7d0;">${data.address || "\u0110\u00e3 giao t\u1eadn tay"}</td>
                </tr>
              </table>

              <p style="margin:0 0 20px;font-size:14px;color:#4b5563;line-height:1.7;">
                Hy v\u1ecdng b\u1ea1n h\u00e0i l\u00f2ng v\u1edbi s\u1ea3n ph\u1ea9m. H\u00e3y d\u00e0nh \u00edt ph\u00fat \u0111\u00e1nh gi\u00e1 s\u1ea3n ph\u1ea9m \u0111\u1ec3 gi\u00fap ch\u00fang t\u00f4i ph\u1ee5c v\u1ee5 b\u1ea1n t\u1ed1t h\u01a1n nh\u00e9!
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding:8px 0 24px;">
                    <a href="${siteUrl}/products" style="display:inline-block;background-color:#111827;color:#f59e0b;font-weight:bold;font-size:14px;text-decoration:none;padding:14px 32px;">
                      \u0110\u00e1nh gi\u00e1 s\u1ea3n ph\u1ea9m ngay
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Return policy -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb;border:1px solid #fde68a;border-collapse:collapse;">
                <tr>
                  <td style="padding:14px 16px;font-size:13px;color:#92400e;line-height:1.6;">
                    <strong>Ch\u00ednh s\u00e1ch \u0111\u1ed5i tr\u1ea3:</strong> B\u1ea1n \u0111\u01b0\u1ee3c h\u1ed7 tr\u1ee3 \u0111\u1ed5i tr\u1ea3 trong v\u00f2ng 7 ng\u00e0y k\u1ec3 t\u1eeb ng\u00e0y nh\u1eadn h\u00e0ng n\u1ebfu s\u1ea3n ph\u1ea9m b\u1ecb l\u1ed7i t\u1eeb nh\u00e0 s\u1ea3n xu\u1ea5t.
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:20px 32px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0 0 6px;font-size:12px;color:#9ca3af;">
                LuxeCommerce - H\u1ec7 th\u1ed1ng mua s\u1eafm tr\u1ef1c tuy\u1ebfn
              </p>
              <p style="margin:0;font-size:11px;color:#d1d5db;">
                C\u1ea3m \u01a1n b\u1ea1n \u0111\u00e3 \u0111\u1ed3ng h\u00e0nh c\u00f9ng ch\u00fang t\u00f4i! \u0110\u1ec3 h\u1ee7y nh\u1eadn th\u00f4ng b\u00e1o, tr\u1ea3 l\u1eddi email v\u1edbi ti\u00eau \u0111\u1ec1 "unsubscribe".
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function generateOrderConfirmationText(data: OrderConfirmationData): string {
  const shortId = data.orderId ? data.orderId.split("-")[0].toUpperCase() : "ORD";
  const formattedTotal = Number(data.totalAmount || 0).toLocaleString("vi-VN") + " VND";
  const dateStr = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleDateString("vi-VN");

  const itemsText = (data.items || []).map(item => 
    `- ${item.name} ${item.variant ? `(${item.variant})` : ""} x${item.quantity}: ${Number(item.price * item.quantity).toLocaleString("vi-VN")} VND`
  ).join("\n");

  return `LUXE COMMERCE - XÁC NHẬN ĐƠN HÀNG #${shortId}
--------------------------------------------------
Xin chào ${data.fullName || "Quý khách"},

Cảm ơn bạn đã đặt hàng tại LuxeCommerce. Đơn hàng của bạn đang được xử lý và sẽ sớm được giao đến địa chỉ của bạn.

THÔNG TIN ĐƠN HÀNG:
- Mã đơn hàng: #${shortId}
- Ngày đặt: ${dateStr}
- Thanh toán: ${data.paymentMethod === "banking" || data.paymentMethod?.includes("VietQR") ? "Chuyển khoản VietQR (Đã thanh toán)" : "Thanh toán khi nhận hàng (COD)"}
- Địa chỉ nhận hàng: ${data.address || "Chưa cập nhật"} ${data.phone ? `- SĐT: ${data.phone}` : ""}

CHI TIẾT SẢN PHẨM:
${itemsText}

--------------------------------------------------
TỔNG THANH TOÁN: ${formattedTotal}

Nếu bạn cần hỗ trợ, vui lòng trả lời trực tiếp email này. Chúng tôi luôn sẵn sàng giúp đỡ bạn.
Trân trọng,
LuxeCommerce Team`;
}

export function generateOrderDeliveredText(data: OrderDeliveredData): string {
  const shortId = data.orderId ? data.orderId.split("-")[0].toUpperCase() : "ORD";
  const formattedTotal = Number(data.totalAmount || 0).toLocaleString("vi-VN") + " VND";
  const dateStr = data.deliveredAt
    ? new Date(data.deliveredAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : new Date().toLocaleDateString("vi-VN");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://shadcn-admin-dashboard-free-eight.vercel.app";

  return `LUXE COMMERCE - GIAO HÀNG THÀNH CÔNG #${shortId}
--------------------------------------------------
Xin chào ${data.fullName || "Quý khách"},

Đơn hàng #${shortId} trị giá ${formattedTotal} đã được giao thành công đến địa chỉ của bạn vào ngày ${dateStr}.
Địa chỉ nhận hàng: ${data.address || "Đã giao tận tay"}

Hy vọng bạn hài lòng với sản phẩm. Hãy dành ít phút đánh giá sản phẩm tại link dưới đây để giúp chúng tôi phục vụ bạn tốt hơn:
${siteUrl}/products

Chính sách đổi trả: Bạn được hỗ trợ đổi trả trong vòng 7 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi từ nhà sản xuất.

Trân trọng,
LuxeCommerce Team`;
}
