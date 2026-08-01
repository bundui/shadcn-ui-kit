# Architecture Overview

## Mục tiêu dự án
Xây dựng một hệ thống E-commerce tích hợp hoàn chỉnh bao gồm: mặt tiền cửa hàng (Storefront) cho khách hàng mua sắm và trang quản trị (Admin Dashboard) để quản lý sản phẩm, đơn hàng, người dùng, và các chiến dịch marketing (Banner).

## Công nghệ đang sử dụng
- **Framework:** Next.js 14/15/16 (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase (PostgreSQL, Supabase Auth, Storage)
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui, @tabler/icons-react, lucide-react

## Cấu trúc thư mục hiện tại
- `app/(storefront)/`: Chứa giao diện người dùng mua sắm (Trang chủ, Danh sách sản phẩm, Chi tiết sản phẩm, Giỏ hàng, Thanh toán, Portal Khách hàng /account).
- `app/dashboard/`: Chứa giao diện quản trị viên (Admin Dashboard):
  - `orders/`: Quản lý danh sách đơn hàng (Bảng Đơn Hàng) & Nhật ký / Cảnh báo Đơn hàng Realtime (`Order Logs & Alerts Feed`).
  - `notifications/`: Trình soạn và gửi email hàng loạt từ dashboard (gửi toàn bộ user hoặc một email cụ thể để test).
  - `products/`, `categories/`, `promo-banners/`, `coupons/`, `roles/`, `users/`, `settings/`.
- `app/(guest)/`: Chứa các trang xác thực (Login, Register).
- `components/storefront/`: Các UI components chuyên dùng cho mặt tiền cửa hàng (Hero Banner, Product Card, Cart...).
- `components/admin/`: Các UI components chuyên dùng cho Admin.
- `components/ui/`: Các UI components dùng chung (từ shadcn/ui).
- `lib/services/`: Lớp logic (Business Logic Layer) tương tác trực tiếp với Supabase (auth, products, orders, cart,...).
- `supabase/migrations/`: Nơi lưu trữ cấu trúc Database (Schema) và các chính sách bảo mật (RLS).

## Các module đã có
1. **Authentication:** Đăng nhập, đăng ký, phân quyền (Role-based).
2. **Catalog Management:** Danh mục (Categories), Sản phẩm (Products), Biến thể & Thuộc tính sản phẩm.
3. **Marketing:** Promo Banners, Mã giảm giá (Coupons).
4. **Shopping:** Giỏ hàng (Cart), Đơn hàng (Orders), Chi tiết đơn hàng (Order Items).
5. **Customer:** Hồ sơ (Profiles), Địa chỉ nhận hàng (Addresses), Yêu thích (Wishlists), Đánh giá (Reviews).

## Dòng chảy khách hàng (Customer flow)
1. **Truy cập & Duyệt:** Khách xem trang chủ (banner, sản phẩm nổi bật, sale), tìm kiếm hoặc lọc theo danh mục.
2. **Tương tác:** Thêm sản phẩm vào giỏ hàng, hoặc lưu vào danh sách Yêu thích (Wishlist). Cần đăng nhập để lưu trữ lâu dài.
3. **Thanh toán:** Chuyển sang `/checkout`, nhập thông tin, chọn địa chỉ mặc định (nếu đã lưu), áp dụng mã giảm giá (nếu có) và đặt hàng.
4. **Quản lý:** Truy cập `/account` để theo dõi tiến trình đơn hàng, xem lại lịch sử, hoặc cập nhật thông tin giao hàng/bảo mật.

## Luồng hoạt động chính của hệ thống

### Authentication flow
- Khách truy cập `/(guest)/login` hoặc `register`.
- Sử dụng Supabase Auth (Email/Password) để xác thực.
- Sau khi đăng nhập, `auth-provider` lấy thông tin user và role (user/admin) để quyết định quyền truy cập.

### Product flow
- **Admin:** Vào `/dashboard/products`, gọi `createProduct` (kèm upload ảnh lên Supabase Storage), gắn danh mục (`category_id`).
- **Khách hàng:** Vào `/products` hoặc trang chủ, hệ thống tự động fetch sản phẩm thông qua server components và hiển thị giao diện.

### Order flow
- User thêm sản phẩm vào giỏ hàng (`cart_items`).
- Trang Giỏ hàng (`/cart`) & Trang Thanh toán (`/checkout` - hỗ trợ áp dụng mã giảm giá)
- Trang Quản lý Tài khoản (`/account`): 
  - Tổng quan (Overview)
  - Thông tin cá nhân & Mật khẩu (`/account/settings`)
  - Sổ địa chỉ (`/account/addresses`)
  - Lịch sử đơn hàng (`/account/orders`)
  - Sản phẩm yêu thích (`/account/wishlist`), hệ thống tính tổng tiền, user nhập địa chỉ, chọn mã giảm giá.
- Hệ thống gọi `checkout.service` tạo bản ghi ở `orders` và chuyển dữ liệu sang `order_items`, sau đó dọn sạch `cart_items`.

### Admin flow
- Mọi route trong `/dashboard/*` đều được bảo vệ bởi `role-guard.tsx`. 
- Nếu role != 'admin', người dùng bị đẩy ra ngoài.
- Admin có thể đọc/ghi tất cả dữ liệu (thông qua RLS Admin Policy).
- Quản trị viên theo dõi tiến trình đơn hàng & cảnh báo đơn mới Realtime ngay tại `/dashboard/orders` (gồm tab Danh sách Đơn hàng và tab Nhật ký & Cảnh báo).
