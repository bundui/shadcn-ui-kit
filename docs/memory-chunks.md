# Architecture
Dự án là hệ thống E-commerce xây dựng bằng Next.js 14/15/16 (App Router) và TypeScript. Cơ sở hạ tầng Backend, Database, và Authentication sử dụng toàn bộ hệ sinh thái Supabase (PostgreSQL, Auth, Storage). Về UI, hệ thống sử dụng Tailwind CSS kết hợp với shadcn/ui, @tabler/icons-react và lucide-react. 
Cấu trúc chia làm hai phân hệ chính: 
1. Storefront (`app/(storefront)/`): Giao diện mua sắm cho khách hàng (Trang chủ, Sản phẩm, Giỏ hàng, Thanh toán).
2. Admin Dashboard (`app/dashboard/`): Giao diện quản trị, quản lý dữ liệu toàn hệ thống.
Tầng Business Logic Layer nằm tại thư mục `lib/services/` tương tác trực tiếp với Supabase client.

# Authentication
Hệ thống xác thực sử dụng Supabase Auth với phương thức Email/Password. Các route xác thực nằm trong `app/(guest)/` (Login, Register). Sau khi người dùng đăng nhập thành công, phiên làm việc (session) được quản lý bởi `auth-provider.tsx`. Hệ thống phân quyền dựa trên dữ liệu từ cơ sở dữ liệu thay vì custom claims, bảo vệ các route nhạy cảm thông qua Component cấp cao.

# Roles
Phân quyền người dùng dựa trên mô hình Role-based. Bảng `roles` lưu định nghĩa quyền, liên kết với người dùng thông qua cột `role_id` trong bảng `profiles`. 
- Guest: Chỉ được xem trang chủ, danh mục, sản phẩm, banner quảng cáo. Không được thêm vào giỏ hàng hoặc mua hàng.
- User (Đã đăng nhập): Được thêm sản phẩm vào giỏ hàng, thanh toán, quản lý địa chỉ, wishlist, review và xem lịch sử mua hàng của bản thân.
- Admin: Tài khoản có `role_id` là admin. Route `/dashboard/*` được bảo vệ bởi `role-guard.tsx`, chỉ Admin mới truy cập được. Admin có toàn quyền (ALL) thao tác CRUD trên mọi dữ liệu nhờ RLS Admin Policy.

# Database
Sử dụng PostgreSQL qua Supabase với Row Level Security (RLS) được bật chặt chẽ trên mọi bảng.
- Bảng chính: `profiles`, `roles`, `categories`, `products`, `orders`, `order_items`, `cart_items`, `addresses`, `wishlists`, `reviews`, `coupons`, `promo_banners`.
- Khóa ngoại quan trọng: `profiles.id` liên kết `auth.users(id)`, `products.category_id` liên kết `categories(id)`, `orders.user_id` liên kết `profiles(id)`.
- RLS Policy: Public chỉ được quyền SELECT dữ liệu sản phẩm, danh mục, banner (nếu is_active = true), review. Authenticated User chỉ được SELECT/INSERT/UPDATE/DELETE dữ liệu có `auth.uid() = user_id`.

# Products
Sản phẩm là trung tâm (Bảng `products`), bắt buộc phải có tiêu đề, giá và thuộc về một danh mục (`category_id`). Cấu trúc sản phẩm mở rộng qua các bảng vệ tinh: `product_images` (ảnh phụ), `product_variants` (biến thể kích thước/màu sắc), `product_specs` (thông số kỹ thuật). Hình ảnh bắt buộc tải lên Supabase Storage bucket `product_images`. Mọi người đều xem được sản phẩm, nhưng chỉ Admin mới có quyền tạo, sửa, xóa.

# Categories
Bảng `categories` dùng để phân loại sản phẩm. Một sản phẩm luôn thuộc về một danh mục. Áp dụng quy tắc toàn vẹn dữ liệu: Không cho phép xóa cứng một danh mục nếu vẫn còn sản phẩm đang tham chiếu đến nó (Sử dụng ràng buộc `ON DELETE RESTRICT`), giúp tránh lỗi mồ côi dữ liệu ở mặt tiền cửa hàng.

# Orders
Quy trình mua hàng (Checkout) yêu cầu người dùng phải đăng nhập (`cart_items` cần `auth.uid()`). Giỏ hàng liên kết `user_id` và `product_id`. Khi đặt hàng, hệ thống tạo bản ghi `orders` với trạng thái mặc định là `pending`. Hệ thống sẽ sao chép giá trị (price) hiện tại của sản phẩm vào bảng `order_items` để "chốt giá", đảm bảo tổng tiền đơn hàng không thay đổi nếu Admin cập nhật giá sản phẩm trên hệ thống sau này. Khi order tạo thành công, `cart_items` sẽ được dọn sạch.

# Flash Sale
Luồng Flash Sale tận dụng cột `discount_percent` (kiểu INTEGER, mặc định bằng 0) có sẵn trong bảng `products`. Ở mặt tiền (Storefront), Component Flash Sale sẽ render những sản phẩm có giá trị `discount_percent > 0`. Logic tính toán giá trị hiển thị phụ thuộc vào giá gốc trừ đi phần trăm giảm giá. Không có bảng rời rạc chuyên biệt quản lý các khung giờ Flash Sale, dựa hoàn toàn vào dữ liệu trực tiếp trên bảng sản phẩm.
