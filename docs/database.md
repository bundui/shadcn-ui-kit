# Database Schema

## Cấu trúc bảng (Supabase)

| Tên bảng | Chức năng | Khóa ngoại (Foreign Keys) |
|---|---|---|
| `roles` | Lưu trữ định nghĩa quyền (admin, user) | N/A |
| `profiles` | Lưu thông tin người dùng mở rộng | `id` -> `auth.users(id)`, `role_id` -> `roles(id)` |
| `categories` | Phân loại sản phẩm | N/A |
| `products` | Lưu trữ thông tin cốt lõi của sản phẩm | `category_id` -> `categories(id)` |
| `product_variants` | Các biến thể (size, màu sắc) | `product_id` -> `products(id)` |
| `product_images` | Ảnh thư viện của sản phẩm | `product_id` -> `products(id)` |
| `promo_banners` | Quản lý banner quảng cáo | N/A |
| `cart_items` | Giỏ hàng tạm của user | `user_id`, `product_id`, `variant_id` |
| `orders` | Đơn hàng gốc của khách | `user_id`, `shipping_address_id`, `coupon_id` |
| `order_items` | Chi tiết từng mặt hàng trong đơn | `order_id`, `product_id`, `variant_id` |
| `addresses` | Sổ địa chỉ giao hàng của user | `user_id` -> `profiles(id)` |
| `coupons` | Mã giảm giá | N/A |
| `wishlists` | Sản phẩm lưu lại để xem sau | `user_id`, `product_id` |
| `reviews` | Đánh giá sản phẩm từ user | `user_id`, `product_id` |

## Row Level Security (RLS) Policies

Hệ thống tuân thủ bảo mật cấp dữ liệu cực kỳ chặt chẽ của Supabase:
- **Public (Bất kỳ ai):** Được phép XEM (SELECT) categories, products, promo_banners (chỉ khi `is_active = true`), product_images, reviews. KHÔNG được phép INSERT/UPDATE/DELETE.
- **Authenticated User:** 
  - Chỉ được xem, thêm, sửa, xóa giỏ hàng (`cart_items`), địa chỉ (`addresses`), đơn hàng (`orders`), yêu thích (`wishlists`) **của chính mình** (Sử dụng điều kiện `auth.uid() = user_id`).
- **Admin:** Được phép toàn quyền (ALL) thao tác trên toàn bộ dữ liệu (Điều kiện check `role_id` trỏ về 'admin' trong bảng `profiles`).

## ERD (Entity Relationship Diagram)

```mermaid
erDiagram
    PROFILES ||--o{ ORDERS : places
    PROFILES ||--o{ CART_ITEMS : has
    PROFILES ||--o{ ADDRESSES : owns
    ROLES ||--o{ PROFILES : assigns
    CATEGORIES ||--o{ PRODUCTS : contains
    PRODUCTS ||--o{ PRODUCT_VARIANTS : has
    PRODUCTS ||--o{ PRODUCT_IMAGES : has
    PRODUCTS ||--o{ CART_ITEMS : in
    ORDERS ||--|{ ORDER_ITEMS : contains
    PRODUCTS ||--o{ ORDER_ITEMS : provides
    COUPONS ||--o{ ORDERS : applies_to
