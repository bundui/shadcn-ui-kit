# Auto Bank Transfer Verification with VietQR + Gmail API

## Mục tiêu

Xây dựng tính năng xác nhận thanh toán chuyển khoản tự động cho website sử dụng Next.js + Supabase + PostgreSQL.

Website sẽ **tự sinh mã QR VietQR cho từng đơn hàng** (không phải ảnh QR cố định), nhưng vẫn sử dụng **cùng một tài khoản Vietcombank**. Mỗi QR sẽ chứa sẵn:

- Ngân hàng
- Số tài khoản
- Chủ tài khoản
- Số tiền của đơn hàng
- Nội dung chuyển khoản (payment_code)

Sau khi khách chuyển khoản, ngân hàng gửi email thông báo giao dịch. Hệ thống tự đọc email, đối chiếu với đơn hàng và tự động xác nhận thanh toán.

---

# Tech Stack

## Frontend

- Next.js
- TailwindCSS
- shadcn/ui

## Backend

- Supabase
- Edge Functions

## Database

- PostgreSQL

## Authentication

- Supabase Auth

## Realtime

- Supabase Realtime

## QR

- VietQR (Dynamic QR)

## Email

- Gmail API (Google Cloud Console)

---

# Kiến trúc

Customer

↓

Next.js Website

↓

Supabase

├── Orders

├── Payments

├── Bank Transactions

└── Realtime

↓

Supabase Edge Function

↓

Google Gmail API

↓

Gmail Inbox

↑

Email thông báo giao dịch từ Vietcombank

---

# Luồng hoạt động

## Bước 1. Người dùng tạo đơn hàng

Khi khách bấm nút "Thanh toán"

↓

Tạo Order

↓

Tạo Payment

↓

Sinh payment_code duy nhất

Ví dụ

```
PAY-8A29KQ
```

Payment có trạng thái

```
PENDING
```

---

## Bước 2. Sinh VietQR

Website tạo VietQR động.

QR chứa

- Ngân hàng Vietcombank
- Số tài khoản
- Chủ tài khoản
- Số tiền
- Nội dung chuyển khoản

Ví dụ

```
Ngân hàng
Vietcombank

STK
123456789

Tên
ABC COMPANY

Số tiền
500000

Nội dung
PAY-8A29KQ
```

Khách chỉ cần

Quét QR

↓

App Vietcombank mở

↓

Đã có sẵn

- STK
- Số tiền
- Nội dung chuyển khoản

↓

Khách chỉ cần bấm

"Chuyển tiền"

Không cần nhập tay.

---

## Bước 3. Khách chuyển khoản

Sau khi chuyển

↓

Vietcombank gửi email

Ví dụ

```
Bạn vừa nhận được tiền

Người chuyển

Nguyễn Văn A

Số tiền

500000

Nội dung

PAY-8A29KQ

Thời gian

10:35
```

---

## Bước 4. Đọc Gmail

Google Cloud Console

↓

Enable Gmail API

↓

OAuth Credentials

↓

Supabase Edge Function

↓

Gmail API

↓

Đọc email chưa xử lý

↓

Lấy nội dung email

---

## Bước 5. Parse Email

Edge Function lấy

- Gmail Message ID
- Sender Name
- Amount
- Description
- Transaction Time

Ví dụ

```json
{
  "messageId":"18fdfk...",
  "sender":"Nguyễn Văn A",
  "amount":500000,
  "description":"PAY-8A29KQ",
  "transactionTime":"2026-07-05T10:35:00"
}
```

---

## Bước 6. Lưu giao dịch

Insert vào bảng

BankTransactions

```
id

gmail_message_id

sender_name

amount

description

transaction_time

matched

created_at
```

Nếu gmail_message_id đã tồn tại

↓

Không xử lý lại.

---

## Bước 7. Đối chiếu thanh toán

Tìm Payment theo

```
payment_code = description
```

Nếu không có

↓

matched = false

↓

Kết thúc.

Nếu tìm thấy

↓

Kiểm tra

```
payment.status == PENDING

AND

payment.amount == amount
```

Nếu đúng

↓

Payment.status

```
MATCHED
```

↓

Payment.paid_at

```
NOW()
```

↓

Order.status

```
PAID
```

↓

BankTransaction.matched

```
true
```

---

## Bước 8. Realtime

Supabase Realtime

Theo dõi bảng

Payments

hoặc

Orders

Khi

```
PENDING

↓

MATCHED
```

Frontend tự động nhận sự kiện

↓

Hiển thị

```
Thanh toán thành công
```

Không cần refresh trang.

---

# Database

## Orders

```
id

user_id

total_amount

status

created_at
```

Status

```
PENDING

PAID

CANCELLED
```

---

## Payments

```
id

order_id

payment_code

amount

status

paid_at

created_at
```

Status

```
PENDING

MATCHED

FAILED

MANUAL
```

---

## BankTransactions

```
id

gmail_message_id

sender_name

amount

description

transaction_time

matched

created_at
```

---

# Edge Function

Tên

```
verify-bank-payment
```

Chức năng

1. Đọc Gmail bằng Gmail API
2. Lấy email mới
3. Parse email
4. Lưu Bank Transaction
5. Đối chiếu payment_code
6. Kiểm tra số tiền
7. Update Payment
8. Update Order
9. Realtime tự cập nhật Frontend

---

# Scheduled Job

Edge Function không chạy liên tục.

Tạo Scheduled Job

Ví dụ

```
Mỗi 1 phút

↓

verify-bank-payment

↓

Đọc Gmail

↓

Parse

↓

Match

↓

Update Database
```

---

# Edge Cases

## Khách chuyển sai số tiền

↓

Không xác nhận

---

## Khách sửa nội dung chuyển khoản

↓

Không tìm thấy payment_code

↓

Không xác nhận

---

## Email đến chậm

↓

Payment vẫn PENDING

↓

Khi email đến

↓

MATCHED

---

## Email đọc nhiều lần

↓

Kiểm tra gmail_message_id

↓

Không xử lý trùng

---

## Hai khách cùng chuyển 500.000đ

Không ảnh hưởng.

Đối chiếu bằng

- payment_code
- amount

---

## Payment đã MATCHED

↓

Bỏ qua

Không cập nhật lại.

---

# Cấu trúc thư mục

```
supabase/
└── functions/
    └── verify-bank-payment/
        ├── index.ts
        ├── gmail.service.ts
        ├── parser.service.ts
        ├── matcher.service.ts
        ├── payment.service.ts
        ├── transaction.service.ts
        └── types.ts
```

---

# Kết quả mong muốn

Khách tạo đơn hàng

↓

Website sinh VietQR theo đúng đơn hàng (đã có sẵn số tiền và payment_code)

↓

Khách quét QR

↓

App Vietcombank tự điền

- STK
- Số tiền
- Nội dung chuyển khoản

↓

Khách xác nhận chuyển tiền

↓

Vietcombank gửi email

↓

Supabase Edge Function đọc Gmail

↓

Parse giao dịch

↓

Đối chiếu payment_code + amount

↓

Payment = MATCHED

↓

Order = PAID

↓

Supabase Realtime gửi sự kiện

↓

Next.js tự động hiển thị

**"Thanh toán thành công"**