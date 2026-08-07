
---

### 3. File `docs/business-rules.md`

```markdown
# Business Rules

Tổng hợp các quy tắc nghiệp vụ (Business Logic) hiện tại được tìm thấy trong codebase.

## Quyền hạn (Authorization)
- **Guest (Chưa đăng nhập):** Chỉ được xem Trang chủ, Danh sách danh mục, Sản phẩm, Banner. Không thể thực hiện chức năng mua hàng vì `cart_items` trong database yêu cầu phải có `auth.uid()`.
- **User (Đã đăng nhập):** Được phép thêm sản phẩm vào giỏ hàng, tiến hành thanh toán (Checkout), xem lịch sử đơn hàng của bản thân và chỉnh sửa sổ địa chỉ.
- **Admin:** Là tài khoản có `role_id` trỏ đến `admin`. Bắt buộc phải có quyền này mới truy cập được các route trong `/dashboard`. Có thể tạo, sửa, xóa toàn bộ sản phẩm, danh mục và quản lý đơn hàng.

## Quy tắc Thanh toán (Checkout) & Giỏ hàng (Cart)
- Một sản phẩm trong `cart_items` bắt buộc phải tham chiếu đến 1 `product_id` hợp lệ. Nếu sản phẩm bị xóa, `ON DELETE CASCADE` sẽ tự động xóa sản phẩm khỏi giỏ hàng.
- Khi người dùng đặt hàng, hệ thống bắt buộc tạo một bản ghi `orders` trạng thái `pending`, sau đó sao chép giá trị (price) hiện tại của sản phẩm vào `order_items` để đảm bảo không bị ảnh hưởng nếu admin đổi giá sản phẩm sau này.

## Đơn hàng (Orders)
- Trạng thái mặc định khi tạo là `pending`.
- Admin mới có quyền cập nhật trạng thái đơn.
- User có thể HỦY đơn hàng của chính mình CHỈ KHI đơn đang ở trạng thái `pending`.
- Giỏ hàng (`cart_items`) sẽ bị xóa sạch ngay sau khi thanh toán thành công.

## Mã giảm giá (Coupons)
- Chỉ áp dụng được khi `is_active = true` và `valid_from` <= hiện tại <= `valid_until`.
- Tổng số lần đã dùng (`used_count`) phải nhỏ hơn `usage_limit`.
- Việc kiểm tra tính hợp lệ phải chạy ở phía Server (`checkout.service.ts`) trước khi tạo đơn hàng để tránh giả mạo giá trị từ Client.
- Mỗi đơn hàng chỉ được sử dụng tối đa 1 mã giảm giá.
- Khi đặt hàng thành công, `used_count` tự động tăng lên 1 (qua atomic RPC hoặc function update an toàn).

## Sổ địa chỉ (Addresses)
- Mỗi User có thể có nhiều địa chỉ giao hàng.
- Khi User tick chọn "Đặt làm mặc định" cho 1 địa chỉ, TẤT CẢ các địa chỉ khác của User đó sẽ bị set `is_default = false`.

## Yêu thích (Wishlist)
- User chỉ được quản lý danh sách yêu thích của riêng mình (RLS policy).
- Khi xem chi tiết sản phẩm, hệ thống sẽ báo đỏ biểu tượng trái tim nếu sản phẩm đã nằm trong Wishlist.
- Cho phép toggle (thêm/xóa) sản phẩm khỏi Wishlist cực nhanh mà không cần load lại trang.

## Quy tắc Sản phẩm & Danh mục
- Sản phẩm luôn phải thuộc về ít nhất 1 danh mục (`category_id` là bắt buộc).
- Hình ảnh sản phẩm và Banner bắt buộc phải được đẩy lên hệ thống Supabase Storage (Bucket: `product_images` cho sản phẩm, và `public_assets` cho banner) để sinh ra public URL lưu vào database.
- Không cho phép xóa cứng danh mục nếu vẫn còn sản phẩm tham chiếu (`ON DELETE RESTRICT` hoặc xử lý ứng dụng), tránh mồ côi dữ liệu.

## Quy tắc Banner (Promo Banners)
- Ở trang chủ của khách hàng (`Storefront`), hệ thống sẽ chỉ fetch những Banner quảng cáo thỏa mãn điều kiện `is_active = true` và sắp xếp theo thứ tự hiển thị `order_index`.

## Quy tắc Mail Hàng Loạt
- Trang `/dashboard/notifications` được dùng như một trình soạn email hàng loạt cho admin.
- Khi chọn gửi cho toàn bộ người dùng, hệ thống lấy danh sách email từ bảng `profiles` và gửi lần lượt qua API server.
- Khi chọn gửi thử cho một email cụ thể, hệ thống chỉ gửi đúng một địa chỉ để kiểm tra nội dung trước khi phát broadcast.
- Việc gửi mail phải đi qua server API để giữ `GMAIL_USER` và `GMAIL_APP_PASSWORD` ở phía môi trường, không lộ sang client.

## Quy tắc Đánh giá (Reviews)
- Mọi người đều có thể đọc đánh giá (`Anyone can view reviews`).
- Nhưng chỉ có người dùng đăng nhập mới được thêm đánh giá (`auth.uid() = user_id`) và Rating bắt buộc giới hạn `1 <= rating <= 5` (Database Check Constraint).

## Quy tắc Thanh toán Chuyển khoản tự động (Auto-Payment Verification)
- **Mã thanh toán & Thời hạn:** Khi chọn phương thức thanh toán chuyển khoản ngân hàng (`bank_transfer`), hệ thống tự động tạo mã thanh toán duy nhất theo cấu trúc `LX-[A-Z0-9]{6}` và thiết lập thời hạn hiệu lực là 10 phút (`expires_at`).
- **Idempotency (Không xử lý lặp):** Mỗi giao dịch ngân hàng vào từ email (Gmail API) chỉ được ghi nhận tối đa một lần trong bảng `bank_transactions` thông qua ràng buộc `UNIQUE(bank_tran_id)`. Nếu mã giao dịch đã tồn tại, hệ thống tự động bỏ qua để tránh cộng dồn tiền hoặc kích hoạt nhầm.
- **Quy tắc Đối chiếu (Matching Logic):**
  1. Nếu nội dung chuyển khoản chứa chính xác mã `LX-XXXXXX` và số tiền `amount >= expected_amount` của đơn đang `PENDING` chưa hết hạn, thanh toán chuyển sang trạng thái `MATCHED`, đơn hàng chuyển sang `PROCESSING` và tự động gửi email xác nhận.
  2. Nếu tìm thấy mã đơn nhưng số tiền `amount < expected_amount`, giao dịch được ghi nhận ở trạng thái `UNMATCHED` và yêu cầu admin kiểm tra thủ công.
- **Hủy thanh toán:** Người dùng có quyền bấm "Hủy thanh toán" tại màn hình VietQR. Khi đó đơn hàng sẽ được hủy (hoặc đánh dấu hủy) và toàn bộ sản phẩm sẽ được khôi phục về giỏ hàng (`cart_items`) để người dùng có thể điều chỉnh lại.
