# TỔNG QUAN DỰ ÁN: LUXECOMMERCE

## 1. TỔNG QUAN DỰ ÁN
- **Tên dự án:** LuxeCommerce (LC)
- **Loại dự án:** Full-stack E-commerce Platform & Admin Dashboard
- **Mục đích xây dựng:** Dự án được phát triển trong quá trình thực tập tại Royal Solution nhằm chứng minh năng lực Full-stack Developer.
- **Vấn đề giải quyết:** Xây dựng một nền tảng thương mại điện tử hoàn chỉnh, từ giao diện mua sắm cho khách hàng (Storefront) đến hệ thống quản trị nội dung và nghiệp vụ phức tạp cho Admin (Dashboard), giải quyết bài toán đồng bộ dữ liệu thời gian thực và bảo mật phân quyền.
- **Đối tượng sử dụng:** 
  - Khách hàng (Mua sắm, quản lý giỏ hàng, thanh toán, theo dõi đơn hàng).
  - Quản trị viên / Nhân viên (Quản lý sản phẩm, đơn hàng, khách hàng, chiến dịch quảng cáo).
- **Cấu trúc hệ thống:** 
  - Hệ thống bao gồm 2 phần giao diện chính: Frontend cho Khách hàng (`app/(storefront)`) và Admin Dashboard (`app/dashboard`).
  - Thay vì xây dựng backend Node.js truyền thống, dự án áp dụng mô hình BaaS (Backend-as-a-Service) với Supabase (PostgreSQL), kết hợp Next.js Route Handlers cho các tác vụ server-side đặc thù.

---

## 2. CÔNG NGHỆ SỬ DỤNG (Xác minh từ codebase)

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS v4, `clsx`, `tailwind-merge`
- **UI Library:** Shadcn UI (Radix UI Primitives)
- **State Management:** Zustand (dành cho Guest Cart - `use-cart-store.ts`)
- **Form Handling & Validation:** `react-hook-form` kết hợp `zod`
- **Data Fetching:** Supabase Client (`@supabase/supabase-js`), React Server/Client patterns.
- **Thư viện khác:** `@dnd-kit` (Drag & Drop), `@tiptap/react` (WYSIWYG Editor), `recharts` (Biểu đồ thống kê), `embla-carousel-react` (Slider/Carousel).

### Backend & API
- **Kiến trúc:** Backend-as-a-Service (BaaS) + Next.js Serverless Functions
- **Database Service:** Supabase
- **API Routes (Next.js App Router):** 
  - `/api/email`: Tích hợp `nodemailer` & `resend` để gửi email hệ thống/marketing.
  - `/api/webhook/bank-payment`: Xử lý webhook thanh toán ngân hàng tự động.
- **Business Logic Layer:** Tách biệt hoàn toàn vào thư mục `lib/services/` (Architecture pattern rất tốt cho Next.js).

### Database
- **Hệ quản trị:** PostgreSQL (thông qua Supabase)
- **ORM/Query Builder:** Supabase JS Client (dựa trên PostgREST)
- **Các tính năng DB nâng cao đã sử dụng:** 
  - Row Level Security (RLS) để bảo mật dữ liệu theo Role.
  - PostgreSQL Triggers (Ví dụ: trigger tự động cập nhật profile/avatar khi đăng nhập Google OAuth).
  - Supabase Realtime (WebSockets) cho Products, Orders, Profiles.
  - SQL Migrations (Quản lý schema thông qua thư mục `supabase/migrations/`).

### Authentication & Security
- **Phương thức xác thực:** Supabase Auth (Email/Password & Google OAuth).
- **Phân quyền (Authorization):** 
  - Role-based Access Control (RBAC).
  - Triển khai qua Higher-Order Components / Wrappers: `<AuthGuard>` và `<RoleGuard>`.
- **Cơ chế bảo mật nâng cao:** 
  - Lắng nghe sự kiện khóa tài khoản realtime (WebSockets).
  - Cơ chế "Stale Tab Recovery" (Sử dụng Page Visibility API để làm mới session).
  - Mã hóa mật khẩu và token do Supabase Auth quản lý nguyên bản.

### Deployment & Development Tools
- **Hosting / Deployment:** Sẵn sàng deploy trên Vercel/Netlify (Frontend/API) và Supabase Cloud (Database/Auth). Thiết lập qua `.env.local`.
- **Package Manager:** `pnpm`
- **Code Quality:** ESLint, Prettier.
- **Version Control:** Git

---

## 3. PHÂN TÍCH TÍNH NĂNG ĐÃ TRIỂN KHAI

### Customer Features (Khách hàng)
- **Xác thực:** Đăng nhập, Đăng ký, Đăng nhập qua Google OAuth.
- **Storefront:** Hiển thị trang chủ, danh sách sản phẩm, chi tiết sản phẩm.
- **Giỏ hàng (Cart):**
  - Giỏ hàng cục bộ (Zustand) cho khách vãng lai (Guest).
  - Tự động đồng bộ (merge) giỏ hàng Guest vào Database khi User đăng nhập thành công.
- **Thanh toán (Checkout):** Luồng đặt hàng và tích hợp thanh toán ngân hàng (Webhook).
- **Quản lý tài khoản (Account):** Cập nhật thông tin cá nhân, avatar.
- **Theo dõi đơn hàng:** Lịch sử mua hàng, trạng thái đơn hàng (Realtime).
- **Wishlist:** Thêm sản phẩm vào danh sách yêu thích, tạo nhóm wishlist.

### Admin Features (Quản trị viên)
- **Dashboard:** Thống kê tổng quan (sử dụng Recharts).
- **Quản lý Sản phẩm & Danh mục:** Thêm/sửa/xóa sản phẩm, chi tiết cấu hình (Specs), quản lý danh mục (Kèm tính năng Kéo thả DND).
- **Quản lý Đơn hàng (Orders):** Xem và cập nhật trạng thái đơn hàng (Có tích hợp Realtime Notifier cho Admin).
- **Quản lý Người dùng (Users):** Xem danh sách, phân quyền, tính năng "Khóa tài khoản" (Lock Profile) có tác dụng ngay lập tức tới user đang online.
- **Quản lý Marketing:**
  - Promo Banners: Quản lý banner quảng cáo động.
  - Coupons: Tạo và quản lý mã giảm giá.
  - Notifications: Hệ thống tạo và gửi Email (Marketing, System, Standard template) hàng loạt.

---

## 4. PHÂN TÍCH KIẾN TRÚC HỆ THỐNG

### Kiến trúc tổng thể
Hệ thống tuân theo mô hình **Service-Oriented Frontend Architecture**:

```text
[ Giao diện UI (React/Next.js) ]
         ↓ gọi qua
[ Service Layer (lib/services/*) ] --- chứa Business Logic, Validation
         ↓ gọi qua
[ Supabase Client ]
         ↓ (REST/WebSockets)
[ Supabase PostgreSQL DB & Auth ]
```

### Business Logic Abstraction
Dự án không gọi trực tiếp Database từ trong UI Component. Tất cả logic được đóng gói gọn gàng tại `lib/services/`:
- `auth.service.ts`, `profile.service.ts`
- `product.service.ts`, `category.service.ts`
- `cart.service.ts`, `checkout.service.ts`, `order.service.ts`
- ...
Điều này giúp code dễ bảo trì, dễ testing và thể hiện tư duy kiến trúc phần mềm tốt của tác giả.

---

## 5. PHÂN TÍCH DATABASE (LƯỢC ĐỒ)

| Entity / Table | Mục đích | Quan hệ quan trọng |
|---|---|---|
| **profiles** | Lưu thông tin user mở rộng (avatar, lock status) | 1-1 với `auth.users`, N-1 với `roles` |
| **roles** | Phân quyền (RBAC) với ma trận quyền (Permission Matrix) | 1-N với `profiles` |
| **products** | Dữ liệu sản phẩm cốt lõi | N-1 với `categories` |
| **product_details** | Chi tiết thông số kỹ thuật (Specs) | 1-1 hoặc N-1 với `products` |
| **orders & order_items** | Lưu trữ hóa đơn và chi tiết giỏ hàng lúc mua | N-1 với `profiles`, `products`, `coupons` |
| **cart & cart_items** | Giỏ hàng tạm thời của user đang đăng nhập | 1-1 với `profiles`, 1-N với `cart_items` |
| **promo_banners** | Quản lý hiển thị banner quảng cáo động trên UI | Không ràng buộc dữ liệu cứng |
| **notifications & email_logs**| Lưu trữ lịch sử gửi email và thông báo | N-1 với `profiles` |

*(Ngoài ra còn các bảng: coupons, wishlist, bank_transactions...)*

---

## 6. NHỮNG ĐIỂM KỸ THUẬT NỔI BẬT (HIGHLIGHTS)

1. **Service-Oriented Architecture trên Frontend:** Tách biệt hoàn toàn Business Logic ra khỏi UI Components thông qua thư mục `lib/services`, thể hiện tư duy thiết kế hệ thống cấp độ Senior/Mid-level.
2. **Advanced Authentication & UX:** 
   - Triển khai cơ chế *Stale Tab Recovery* (Tự làm mới trang khi user rời tab lâu).
   - Tự động đồng bộ giỏ hàng cục bộ (Zustand) lên server ngay khi người dùng đăng nhập.
   - Khóa tài khoản Realtime: Tích hợp Supabase WebSockets để "đá văng" user vi phạm ra khỏi hệ thống ngay lập tức mà không cần F5.
3. **Database Security & Design:** Tự tay thiết kế lược đồ quan hệ PostgreSQL phức tạp, áp dụng Row Level Security (RLS) bảo vệ dữ liệu ở tầng cơ sở dữ liệu và viết Trigger SQL tự động.
4. **Rich UI/UX Integration:** Sử dụng Drag & Drop (`@dnd-kit`), WYSIWYG Editor (`@tiptap`), và hệ thống giao diện Email HTML tùy chỉnh. Tối ưu hóa UI bằng Tailwind CSS và Shadcn.

---
---

# CV-READY INFORMATION

*Sử dụng phần này để copy trực tiếp vào CV tiếng Anh của bạn.*

## 1. Project Summary
**LuxeCommerce** is a full-stack e-commerce platform and administrative dashboard built to handle complex operational workflows. Designed with a service-oriented architecture, it features real-time data synchronization, secure role-based access control, and seamless order and inventory management. 

## 2. Responsibilities
- **Architected** a scalable Next.js application by decoupling business logic from UI components using a dedicated Service Layer (`lib/services`).
- **Designed & Implemented** a relational PostgreSQL database schema on Supabase, writing custom SQL migrations, triggers, and robust Row Level Security (RLS) policies.
- **Built** an advanced authentication flow including Google OAuth, local Zustand guest-cart to database merging upon login, and a real-time account locking mechanism using WebSockets.
- **Developed** a comprehensive Admin Dashboard featuring Drag & Drop category management, WYSIWYG text editors, chart analytics, and an integrated NodeMailer/Resend email broadcast system.
- **Integrated** third-party webhooks for automated bank payment processing and ensured application stability with Page Visibility API for stale-tab recovery.

## 3. Technologies
- **Frontend:** Next.js 16 (App Router), TypeScript, Tailwind CSS, Shadcn UI, Zustand, React Hook Form, Zod.
- **Backend (BaaS):** Supabase, Node.js (Next.js Route Handlers).
- **Database:** PostgreSQL (with RLS, Triggers, Realtime WebSockets).
- **Authentication & Security:** Supabase Auth, Role-Based Access Control (RBAC).
- **Tools & Libraries:** Dnd-kit (Drag & Drop), Tiptap (Rich Text), Recharts, Nodemailer.

---

## CV RELEVANCE (Đánh giá năng lực cho Fresher Full-stack)

### Strong Evidence (Bằng chứng cực kỳ rõ ràng trong code)
- **Frontend Development:** Kỹ năng React/Next.js cực tốt, biết dùng Tailwind, Zustand, xử lý Form phức tạp, bóc tách component.
- **API & Third-party Integration:** Xử lý Webhook thanh toán, gửi Email qua API.
- **Database Design:** Hiểu rõ quan hệ dữ liệu (SQL), biết viết Migrations, hiểu về bảo mật RLS của PostgreSQL.
- **Full-stack Ownership:** Khả năng tự thiết kế từ DB Schema -> Services -> UI Component hoàn chỉnh.

### Possible Evidence (Có thể nhắc đến khi phỏng vấn)
- **Performance Optimization:** Thông qua việc sử dụng cache, Stale-While-Revalidate (đã thấy trong `auth-provider.tsx`), và Server Components của Next.js.
- **UX Engineering:** Xử lý các edge-cases khó như đồng bộ giỏ hàng khi login, tự động refresh tab bị "ươn" (stale tab).

### Not Verified (Tránh ghi vào CV nếu không chắc chắn)
- Microservices, CI/CD pipelines (chưa thấy GitHub Actions/Jenkins), Docker/Kubernetes (chưa có file cấu hình).
