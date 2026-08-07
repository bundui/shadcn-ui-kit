import { GmailMessage, ParsedTransaction } from "./types.ts";

/**
 * Giải mã base64url sang UTF-8 string (dùng cho Gmail API payload)
 */
export function decodeBase64Url(base64Url?: string): string {
  if (!base64Url) return "";
  try {
    // Thay thế ký tự base64url sang base64 chuẩn
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    // Trong Deno/Browser môi trường Edge, dùng atob và TextDecoder
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return new TextDecoder("utf-8").decode(bytes);
  } catch (err) {
    console.error("❌ [Parser] Lỗi giải mã Base64:", err);
    return "";
  }
}

/**
 * Trích xuất toàn bộ nội dung text từ Gmail Message (duyệt đệ quy qua các parts)
 */
export function getEmailContent(message: GmailMessage): string {
  let content = "";

  if (message.payload.body?.data) {
    content += decodeBase64Url(message.payload.body.data);
  }

  if (message.payload.parts && message.payload.parts.length > 0) {
    for (const part of message.payload.parts) {
      if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
        if (part.body?.data) {
          content += " " + decodeBase64Url(part.body.data);
        }
      }
      if (part.parts && part.parts.length > 0) {
        for (const subPart of part.parts) {
          if (subPart.body?.data) {
            content += " " + decodeBase64Url(subPart.body.data);
          }
        }
      }
    }
  }

  // Dọn dẹp thẻ HTML để dễ parse bằng regex
  return content
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Trích xuất header của Gmail theo tên (Subject, From, Date...)
 */
export function getHeaderValue(message: GmailMessage, headerName: string): string {
  const header = message.payload.headers.find(
    (h) => h.name.toLowerCase() === headerName.toLowerCase()
  );
  return header ? header.value : "";
}

/**
 * Phân tích nội dung email Vietcombank (VCB) để lấy số tiền, mã thanh toán, người gửi
 */
export function parseVcbEmail(message: GmailMessage): ParsedTransaction | null {
  const content = getEmailContent(message);
  const subject = getHeaderValue(message, "Subject");
  const dateHeader = getHeaderValue(message, "Date");

  // 1. Kiểm tra xem có phải email nhận tiền/biến động số dư tăng không
  // VCB thường có chữ: "+", "SD tăng", "nhận", "VND", "credit", "giao dịch"
  const isCredit = /(\+[\d,.]+)|(tăng|nhận|credit)/i.test(content) || /(\+|tăng)/i.test(subject);
  if (!isCredit && !content.includes("VND") && !content.includes("VNĐ")) {
    console.log(`⚠️ [Parser] Email ${message.id} không giống thông báo nhận tiền VCB. (Tiêu đề: ${subject} | Nội dung: ${content.slice(0, 150)})`);
    return null;
  }

  // 2. Trích xuất số tiền (Amount)
  // Tìm mẫu: +500,000 VND hoặc 500.000 VNĐ hoặc Số tiền: 500,000 hoặc SD tăng: +29,992,500
  let amount = 0;
  const amountRegexes = [
    /(?:Số tiền|SD tăng|Amount|tăng|nhận|\+)\s*:?\s*\+?\s*([\d,.]+)\s*(?:VND|VNĐ|đ)?/i,
    /\+\s*([\d,.]+)\s*(?:VND|VNĐ|đ)?/i,
    /([\d,.]+)\s*(?:VND|VNĐ|đ)/i,
  ];

  for (const regex of amountRegexes) {
    const match = content.match(regex);
    if (match && match[1]) {
      // Loại bỏ dấu phẩy, dấu chấm phân cách hàng nghìn
      const cleanNumStr = match[1].replace(/[,.]/g, "");
      const parsedNum = parseInt(cleanNumStr, 10);
      if (!isNaN(parsedNum) && parsedNum > 0) {
        amount = parsedNum;
        break;
      }
    }
  }

  if (amount === 0) {
    console.warn(`⚠️ [Parser] Không trích xuất được số tiền hợp lệ từ email ${message.id}. (Nội dung: ${content.slice(0, 200)})`);
    return null;
  }

  // 3. Trích xuất mã thanh toán (Description / Payment Code)
  // Ưu tiên tìm mã theo định dạng LX-XXXXXX hoặc LXXXXXX (chấp nhận cả khoảng trắng, chữ thường và không có dấu gạch nối)
  let description = "";
  const codeMatch = content.match(/L\s*X\s*-?\s*([A-Z0-9]{4,15})/i);
  if (codeMatch) {
    description = `LX${codeMatch[1].toUpperCase()}`;
  } else {
    // Tìm sau từ khóa Nội dung / ND / Description / Memo
    const descMatch = content.match(/(?:Nội dung|ND|Description|Memo|Ref)\s*:?\s*([A-Z0-9\s-]+?)(?:\s+từ|\s+lúc|\s+ngay|\.\s|\n|$)/i);
    if (descMatch && descMatch[1]) {
      description = descMatch[1].trim().toUpperCase();
    } else {
      // Lấy toàn bộ đoạn text có mã alphanum dài từ 6 ký tự trở lên làm description
      const generalMatch = content.match(/\b([A-Z0-9]{6,15})\b/);
      description = generalMatch ? generalMatch[1] : content.slice(0, 100);
    }
  }

  // 4. Trích xuất tên người chuyển (Sender Name)
  let senderName = "Khách hàng chuyển khoản";
  const senderMatch = content.match(/(?:Người chuyển|Người gửi|Tên TK gửi|Từ TK|Sender)\s*:?\s*([^\n,.]+)(?:\s+[-–]|\s+lúc|\s+số|\n|$)/i);
  if (senderMatch && senderMatch[1]) {
    senderName = senderMatch[1].trim();
  } else {
    const fromHeader = getHeaderValue(message, "From");
    if (fromHeader) {
      senderName = fromHeader.replace(/<.*>/, "").trim() || fromHeader;
    }
  }

  // 5. Thời gian giao dịch
  let transactionTime = new Date().toISOString();
  if (dateHeader) {
    const parsedDate = new Date(dateHeader);
    if (!isNaN(parsedDate.getTime())) {
      transactionTime = parsedDate.toISOString();
    }
  }

  return {
    gmailMessageId: message.id,
    senderName,
    amount,
    description,
    transactionTime,
    rawContent: content.slice(0, 500), // Lưu 500 ký tự đầu để debug
  };
}
