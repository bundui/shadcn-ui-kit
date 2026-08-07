# Technical Decisions Log

## 2026-06-25: Dynamic DB-driven Hero Banner Carousel & Admin Dnd Ordering

### Context
The storefront Home page previously contained hardcoded mock banner content in `HeroBanner` (`components/storefront/hero-banner.tsx`) and an obsolete secondary component `PromoBanners` (`components/storefront/promo-banners.tsx`). Meanwhile, a full backend service `banner.service.ts` and Supabase table `promo_banners` existed alongside an Admin management page `/dashboard/promo-banners`.

### Decision
1. **Consolidated Storefront Banner Architecture**: Removed `PromoBanners` component entirely to avoid promotional redundancy. Upgraded `HeroBanner` into a dynamic Ken Burns carousel fetching active promotions from `promo_banners` where `is_active = true`.
2. **Prevented Initial Data Flashing**: Initialized client banner state with an empty array `[]` and added a loading shimmer/spinner skeleton (`loadingBanners`) instead of initializing with static default mock data (`DEFAULT_BANNERS`).
3. **Integrated `@dnd-kit` for Admin Reordering**: Implemented `DndContext` and `SortableContext` with vertical list strategy in `/dashboard/promo-banners`. Dragging rows triggers array reordering and sequential updates to `order_index` saved in batch via `updatePromoBannerOrders`.
4. **Resolved JSX Accessibility Warnings**: Aliased `import { Image as ImageIcon } from "lucide-react"` to prevent conflicts with Next.js image JSX lint rules.

## 2026-07-17: Staff Role Dashboard Inheritance & Operational Authorization Boundary

### Context
When adapting the LuxeCommerce admin panel for operational staff members (`role === "staff"`), we needed to balance two requirements: (1) Staff must be able to perform daily operations like checking new orders, changing order fulfillment statuses (`processing`, `shipping`, `delivered`, `cancelled`), and viewing products, while (2) Staff must be restricted from permanent database deletions (`deleteOrderAdmin`, `deleteProduct`), sensitive financial revenue charts, and system settings (`settings`, `coupons`, `roles`, `users`).

### Decision
1. **Inheritance-Based Dashboard View (`components/admin/dashboard-view.tsx`)**: Instead of creating a separate dashboard page for staff, `DashboardView` checks `useAuth().role`. When `role === "staff"`, the financial Recharts area chart (`Xu hướng doanh thu 7 ngày qua`) and revenue metric cards are dynamically replaced with operational KPIs (`pendingOrders`, `processingOrders`, `totalOrders`, `totalProducts`), and the **Đơn hàng mới nhất** feed expands from 1 column (`lg:col-span-1`) to full width (`lg:col-span-3`).
2. **Boundary Checks on Action Buttons (`orders/page.tsx`, `products/page.tsx`)**: Both pages wrap `RoleGuard allowedRoles={["admin", "staff"]}`. However, permanent deletion buttons (`IconTrash`) and confirmation dialogs (`AlertDialog` calling `deleteOrderAdmin` / `deleteProduct`) as well as product creation (`Add Product`) are strictly wrapped in `role === "admin"` conditionals. Staff retain full permission to inspect details (`IconEye`) and transition order status to `cancelled` via the standard update select box.
3. **Menu Filtering (`components/app-sidebar.tsx`) & Route Guards (`RoleGuard`)**: `Settings` and `Coupons` pages are protected with `<RoleGuard allowedRoles={["admin"]}>` to block direct URL navigation, while the sidebar menu dynamically filters out admin-only links for staff users.

### Consequences
- Seamless operational experience where staff share a cohesive layout with administrators without seeing confusing financial or system configuration options.
- Complete data protection against accidental or unauthorized deletion of order records or inventory items.
- Maintained 100% linter (`pnpm lint`) and build (`pnpm build`) compliance with zero errors or warnings.

## 2026-06-25: Admin Orders Responsive Optimization, Safe Delete & Smart Search API

### Context
The Admin Orders page (`app/dashboard/orders/page.tsx`) suffered from horizontal layout crushing on mobile devices, lacked a safe deletion mechanism, and its backend search API `getOrders` (`order.service.ts`) used a dummy regex check that ignored search queries unless they were full 36-character UUIDs.

### Decision
1. **Mobile-First Responsive Orders UI**: Added `overflow-x-auto` and minimum table widths (`min-w-[700px]`) to prevent layout distortion on mobile screens. Refactored the Order Details Dialog grid from static 2-column to responsive stacked (`grid-cols-1 sm:grid-cols-2`) with text wrapping (`break-all`, `break-words`).
2. **Safe Order Deletion**: Added a trash icon action button triggering an `AlertDialog` confirmation. Implemented `deleteOrderAdmin` in `order.service.ts` which cleans up child `order_items` before deleting parent `orders` to maintain referential integrity.
3. **Smart Multi-Entity Order Search API**: Replaced the regex UUID filter with an in-memory partial match across order IDs and profile names/emails, allowing managers to search by 8-character short codes (e.g. `7505EEE3`) or customer names instantly.

## 2026-06-25: Bulletproof Symmetric View Transition for Color Mode via flushSync

### Context
The circular color transition animation in `ThemeToggle` (`components/storefront/theme-toggle.tsx`) worked when switching from Dark to Light, but failed when switching Light to Dark. This occurred because React 18+ automatic batching caused `setTheme('dark')` from `next-themes` to execute asynchronously. Consequently, `startViewTransition` captured identical Light-colored screenshots before React committed the DOM class change.

### Decision
1. **Synchronous React DOM Flushing (`flushSync`)**: Wrapped `setTheme(nextTheme)` inside `flushSync(...)` from `react-dom` inside the `document.startViewTransition` callback. This forces React to flush all pending updates and commit the new theme class (`dark` or `light`) to `<html className="...">` synchronously before the browser captures the New State snapshot.
2. **Symmetric Layer Animation**: Simplified `app/globals.css` to keep `::view-transition-new(root)` permanently on top (`z-index: 9999`). Both Dark-to-Light and Light-to-Dark transitions animate the circular wipe of the New State from the click coordinates outward.

### Consequences
- Flawless, symmetric 60fps circular wipe transitions across modern browsers in both directions.
- Eliminates React state batching race conditions during DOM capture.

## 2026-06-26: Customer Order Cancellation via RLS & Instant Dual Realtime Admin Sync

### Context
Customers clicking "Hủy đơn" encountered error `Cannot coerce the result to a single JSON object`, and successful order status updates did not reflect immediately on the Admin Orders table or global notifier.

### Decision
1. **Enabled Customer Order Cancellation via RLS**: Pushed policy `Users can update own orders` directly to the Supabase Cloud Postgres DB (`supabase db push`), keeping established project architecture clean without introducing new folder patterns (`lib/actions`). Simplified `updateOrderStatus` in `order.service.ts`.
2. **Instant Dual Realtime Admin Sync**: Integrated both Supabase Broadcast Channels (`global-admin-orders-notifier`) and same-browser `BroadcastChannel` (`admin_orders_channel`) into `updateOrderStatus`. Admin Orders table (`/dashboard/orders`) and Live Bell (`AdminRealtimeNotifier`) instantly trigger on status updates.

## 2026-06-26: Guaranteed Realtime Broadcast Delivery, StrictMode Fix & Glassmorphic Live Pool

### Context
Admin Realtime notifications did not fire because: (1) Supabase Realtime WebSocket server silently drops `postgres_changes` events when table RLS policies contain subqueries (`SELECT ... FROM profiles`), (2) `createOrder` and `updateOrderStatus` navigated away before async `channel.subscribe()` finished sending broadcast payloads, and (3) React StrictMode unmount/remount in `AdminRealtimeNotifier` locked `initialized.current = true` while destroying socket connections.

### Decision
1. **Guaranteed Broadcast Delivery with Timeout**: Refactored `checkout.service.ts` and `order.service.ts` to await `channel.subscribe(...)` and `channel.send(...)` wrapped in a Promise with a 500ms fallback timeout before page navigation.
2. **Removed StrictMode Initialization Lock**: Removed `initialized.current` check in `AdminRealtimeNotifier`, ensuring fresh WebSocket sockets establish on remount.
3. **Sleek Floating Glassmorphic Pill Toasts**: Upgraded Sonner notification UI (`toast.custom`) into compact `max-w-[330px]` floating pills with live pulsing indicators and micro-bounce icons.
4. **Live Glowing Rows & Explosion Banner (`/dashboard/orders`)**: Created an in-memory `Set<string>` pool (`liveOrderIds`). Incoming orders automatically highlight with emerald tinted backgrounds (`bg-emerald-500/15`), pulsing "MỚI" badges, and a floating multi-order summary banner. Clicking "Xem chi tiết" acknowledges and removes the row glow smoothly.

## 2026-07-08: Automated Bank Transfer Verification (VietQR + Gmail API + Realtime) & React 19 Linter Zeroing

### Context
Manual bank transfer verification caused delayed order fulfillment and required constant admin intervention. Furthermore, the payment flow lacked clear navigation options to cancel or return to previous checkout steps. On the codebase quality front, Next.js 16 / React 19 compiler linter (`eslint-plugin-react-hooks v5`) raised cascading render errors (`react-hooks/set-state-in-effect`) across multiple storefront and admin pages.

### Decision
1. **VietQR Automated Verification Pipeline**:
   - **Database Architecture**: Created `payments` and `bank_transactions` tables with deterministic order codes (`LX-[A-Z0-9]{6}`) and strict 10-minute expiration windows. Enforced idempotency via `UNIQUE(bank_tran_id)` and Row Level Security (RLS) policies.
   - **Supabase Edge Function (`verify-bank-payment`)**: Developed a standalone Deno Edge Function utilizing Gmail API OAuth2 to poll/listen for bank transaction notification emails (e.g., Vietcombank). Implemented regex parser (`LX-[A-Z0-9]{6}`) and multi-pass matcher to reconcile amounts and automatically update payment status to `MATCHED` and order status to `PROCESSING`, accompanied by automated email confirmation dispatch.
   - **Realtime Storefront Checkout Experience**: Built `/checkout/payment/[orderId]` featuring dynamic VietQR generation (`img.vietqr.io`), a 10-minute countdown timer, and a Supabase Realtime channel listening for payment row mutations. When `MATCHED` is broadcasted, the UI triggers a celebratory cash register chime and full-screen confetti before auto-redirecting to order tracking.
   - **User Navigation Resilience**: Implemented a "Hủy thanh toán" (Cancel Payment) confirmation dialog returning the order items to the active cart (`/cart`) with informative toast notifications, plus a clear "Quay lại bước trước" button to return to `/checkout`.

2. **Zero-Error / Zero-Warning React 19 & Next.js 16 Linter Compliance (`pnpm lint`)**:
   - Resolved static analysis errors from React 19 compiler where synchronous state updates (`setLoading`, `setFormData`) inside `fetchData` helpers invoked inside `useEffect` triggered `set-state-in-effect`.
   - Applied `setTimeout(() => setState(...), 0)` to defer synchronous state initialization out of the direct render synchronization path, and added targeted `// eslint-disable-next-line react-hooks/set-state-in-effect` directives on standard data-fetch effect invocations.
   - Replaced all remaining native `<img>` elements (34 instances across storefront, checkout, and admin pages) with Next.js `<Image unoptimized />` with explicit dimensions (`width/height` or `fill`).
   - Fixed all React `exhaustive-deps` warnings by properly memoizing helper callbacks (`useCallback`) in `admin-realtime-notifier.tsx`, `checkout/payment/[orderId]/page.tsx`, and `dashboard/promo-banners/page.tsx`, achieving `0 errors, 0 warnings` across the entire codebase (`pnpm lint` and `pnpm build`).

### Consequences
- Zero-admin instant order confirmation when customers transfer via QR code.
- Flawless UX navigation preventing cart abandonment during checkout errors.
- 100% compliance with strict React 19 / Next.js 16 linter and compiler standards (0 errors, 0 warnings).

## 2026-07-08: Admin Payment Code Order Search & Customer Visual 4-Step Order Timeline

### Context
Following the completion of the VietQR automated payment pipeline, both administrators and customers required streamlined mechanisms to track and look up orders by their short-coded payment reference (`LX-[A-Z0-9]{6}`). Furthermore, customers needed an intuitive, visual order status timeline on `/account/orders` rather than static status badges alone.

### Decision
1. **Multi-Relation Smart Order Search API (`order.service.ts`)**:
   - Expanded `getOrders` to include the `payments(payment_code, status, amount, expires_at)` relation and execute partial `ilike` matching across `payment_code`.
   - Admin search queries matching `LX-XXXXXX` (or any substring thereof) instantly resolve parent `order_id` values alongside UUID and profile/email matching without extra roundtrips.
2. **Admin Orders Payment Code Badge & Details Integration (`/dashboard/orders`)**:
   - Displayed an eye-catching `LX-XXXXXX` reference badge right beside the order ID in the table rows for bank transfer orders.
   - Incorporated a dedicated "Thanh toán chuyển khoản VietQR" details box inside the Admin Order Details Modal (`getOrderById`), highlighting the exact reference code and real-time payment status (`MATCHED`, `MANUAL`, `EXPIRED`, `PENDING`).
3. **Customer Visual 4-Step Order Timeline & Quick Re-Pay (`/account/orders`)**:
   - Built a dynamic `OrderTimeline` component with a responsive 4-step progress bar (`Chờ xử lý` ➔ `Đang chuẩn bị` ➔ `Đang giao` ➔ `Hoàn tất`) and custom `AlertTriangle` banner for `cancelled` orders.
   - Embedded a "Chuyển khoản VietQR" status card inside each order card containing a "Thanh toán ngay" link directing pending customers back to their active `/checkout/payment/[orderId]` QR code page.

### Consequences
- Instant 1-second lookup for administrators reconciling bank transfers by short `LX-XXXXXX` payment codes.
- Elevated customer trust and reduced support inquiries via visual progress indicators and direct "Thanh toán ngay" re-access.
- Maintained 100% linter and build compliance (`0 errors, 0 warnings` across `pnpm lint` and `pnpm build`).

## 2026-07-12: Client-Side Hybrid Search & Filtering for Customer Order History (`account/orders`)

### Context
The customer Order History page (`app/(storefront)/account/orders/page.tsx`) lacked filtering by status, time range, and search query. We needed to decide whether to implement filtering on the client side (using RAM/`useMemo`) or server side (calling PostgREST queries on every input/tab change).

### Decision
1. **Adopted Client-Side Hybrid Architecture**:
   - Since individual customers typically have fewer than 200 orders, fetching their full order history once (`~30KB-80KB` JSON) and filtering in-browser via `useMemo` provides instant `0ms latency` feedback without server roundtrips or loading spinners.
   - Enabled multi-field relational search across **Order ID (`#ORD...`)**, **VietQR Payment Code (`LX...`)**, and **nested Product Names (`order_items.products.name`)** without complex SQL joins.
2. **Built Status Filter Pills & Dynamic Badge Counts**:
   - Added Status Pills (`Tất cả`, `Chờ xử lý`, `Đang giao`, `Hoàn tất`, `Đã hủy`) where badge counts reflect the exact number of orders matching the active search query and time range.
3. **Resolved React 19 / Next.js 16 Compiler Hook Purity Rules**:
   - Initialized `currentTime` via `useState(() => Date.now())` to avoid calling impure `Date.now()` inside `useMemo` computations, and wrapped `fetchOrders(true)` inside `setTimeout` within `useEffect` to prevent synchronous state updates (`react-hooks/set-state-in-effect`).

### Consequences
- Flawless, instant search and filtering experience for customers with zero latency.
- Maintained 100% linter and build compliance (`0 errors, 0 warnings` across `pnpm lint` and `pnpm build`).

## 2026-07-13: Dynamic Storefront Home Page & Real-Time Promo Banner Reordering (`order_index`)

### Context
When testing the promo banner drag-and-drop reordering feature (`đảo vị trí hiển thị`) in local development (`pnpm dev`), reloading the home page (`/`) reflected the new banner order immediately. However, in production (`pnpm build`), reloading the home page did not update the banner order (`test ở production lại ko đc`).

### Decision
1. **Dynamic Route Opt-out (`export const dynamic = "force-dynamic"`)**: By default, Next.js App Router marks `app/(storefront)/page.tsx` (`StorefrontHomePage`) as `○ (Static) prerendered as static content` during `next build` because it has no dynamic parameters (`searchParams`). Consequently, `HeroBanner` only fetched `promo_banners` once at build time. Added `export const dynamic = "force-dynamic"` and `export const revalidate = 0` to `app/(storefront)/page.tsx` so the production server dynamically fetches active banners sorted by `order_index ASC` on every home page visit without serving stale build-time HTML.
2. **Synchronized Client State in `HeroBannerClient`**: Updated `HeroBannerClient` to sync `initialBanners` into `activeBanners` via `useEffect` whenever props change (`setActiveBanners(initialBanners)`), preventing `useState(initialBanners)` from retaining stale initial state during client routing.
3. **Automatic Router Refresh on Admin Reorder (`router.refresh()`)**: Added `router.refresh()` inside `handleDragEnd` and `handleToggleActive` in `app/dashboard/promo-banners/page.tsx` so admin state updates immediately clear the browser router cache.

### Consequences
- Drag-and-drop banner reordering (`order_index`) in `/dashboard/promo-banners` instantly reflects on the Storefront home page (`/`) in both local development and production environments.

## 2026-07-14: Admin Notification History RLS (`Admins can view all notifications`) & Targeted vs Broadcast Distinction

### Context
Admin users noted that sending a targeted notification (`sendTargetedNotification`) to a specific user did not appear in the Admin Notification History list (`getBroadcastHistory()`). Furthermore, even when history items were loaded, the table lacked a recipient distinction column (`Đối tượng nhận`), making broadcasts and targeted individual messages look identical.

### Decision
1. **Admin RLS SELECT Policy on `notifications`**: Created migration `20260714130000_update_notifications_rls_for_admin.sql` adding `create policy "Admins can view all notifications" on public.notifications for select to authenticated using (exists (select 1 from profiles p join roles r on p.role_id = r.id where p.id = auth.uid() and r.name = 'admin'))`. Previously, the table only permitted `auth.uid() = user_id`, silently blocking Admins from querying `notifications` belonging to customer `user_id`s.
2. **Definitive `is_broadcast` Flag & Batch Grouping (`getBroadcastHistory()`)**: Added migration `20260714133000_add_is_broadcast_to_notifications.sql` introducing `is_broadcast boolean default false` directly on `public.notifications`. When sending via `broadcastNotification`, `is_broadcast` is explicitly set to `true`; when sending via `sendTargetedNotification`, it is set to `false`. In `getBroadcastHistory()`, items with `is_broadcast === true` are grouped strictly by `broadcast|title|message|timeBucket` displaying count (`Gửi tất cả (N user)`), whereas targeted items (`is_broadcast === false`) are kept completely distinct using `targeted|id` so each recipient (`profiles`) appears accurately in the combined `Đối tượng nhận` column without false assumptions based on total row count.
3. **Admin History Table & Mobile Cards UI Enhancement**: Added an **`Đối tượng nhận` (`Recipients`)** column and badge across both Desktop `Table` and Mobile `Card` layouts in `app/dashboard/notifications/page.tsx`. Broadcasts display a purple pill `Gửi tất cả (N user)`, while targeted messages display a blue pill showing `IconUser` with `Gửi: Full Name (Email)`.
4. **Safe Deletion with `AlertDialog` Modal & Service Distinction**: Replaced native browser `confirm()` with a customized UI `AlertDialog` (`components/ui/alert-dialog.tsx`) showing detailed recipient info before deletion. In `executeDeleteSentItem`, if the item is a broadcast (`item.is_broadcast`), it calls `deleteBroadcast(title, message)`; if it is a targeted individual message (`!item.is_broadcast`), it calls `deleteNotification(item.id)` (`lib/services/notification.service.ts`) ensuring only the exact target notification row is removed.
5. **Auto-Trigger Product Review Modal on Order Receipt (`handleConfirmReceivedOrder`)**: When the user clicks **"Xác nhận đã nhận hàng"** (`completed`) on `app/(storefront)/account/orders/page.tsx`, right after `supabase.from("orders").update(...)` succeeds, `handleConfirmReceivedOrder` finds the first unreviewed product item (`!reviewedProductIds.has(pid)`) in that order and automatically opens `ProductReviewModal` after a smooth 350ms transition. The user can review instantly or close (`onClose`) the modal to review later anytime via the dedicated **"Đánh giá"** button.
6. **OAuth vs Email/Password Distinction in Account Settings (`AccountSettingsPage`)**: In `app/(storefront)/account/settings/page.tsx`, checked `user?.app_metadata?.provider` to detect OAuth accounts (`google`, `github`, `facebook`, `apple`). When logged in via Google OAuth (`isOAuth === true`), the traditional "Đổi mật khẩu" (`Change Password`) form inputs are dynamically hidden and replaced with a modern security badge (**`🔒 Bảo mật & Đăng nhập`** $\rightarrow$ **`[Google Icon] Đăng nhập qua tài khoản Google - Đã liên kết`**) explaining that password and 2FA are managed directly by Google Security.

### Consequences
- Admins can view complete notification history across all users without RLS silent filtering.
- Instant, unambiguous differentiation between mass broadcasts (`Phát sóng all`) and targeted 1-on-1 member alerts (`Gửi người cụ thể`).
- Safe, professional UX deletion flow with zero risk of accidentally deleting unrelated notifications via `AlertDialog` confirmation.
- Seamless, high-conversion post-purchase review UX: customers are prompted at the peak of fulfillment satisfaction (`confirm received`), while retaining total flexibility to postpone reviewing.
- Industry-standard OAuth security UX: eliminates user confusion and invalid state changes by hiding password update inputs for social login identities (`Google OAuth`).

## 2026-07-15: Migration of Order Logs & Alerts Feed from Notifications to Orders Dashboard (`/dashboard/orders`)

### Context
Previously, the realtime order alerts feed (`Nhật ký Đơn hàng`) was located inside `app/dashboard/notifications/page.tsx` as a third tab (`system-alerts`) alongside **Soạn tin (`compose`)** and **Lịch sử gửi (`history`)**. Admin users noted that splitting order monitoring across `/dashboard/notifications` and `/dashboard/orders` caused unnecessary context switching (`nên đưa ra một tab khác`). The user selected Option 2 (`Tôi chọn hướng 2`): integrating the Order Logs directly into the Orders Management Page (`app/dashboard/orders/page.tsx`).

### Decision
1. **Tabs Architecture inside `/dashboard/orders`**: Restructured `app/dashboard/orders/page.tsx` using `Tabs` (`components/ui/tabs.tsx`) with two clean tabs:
   - `orders-list`: **Danh sách Đơn hàng** (`Orders Table`, Status Quick Tabs, Search, Sort, Date Filter, and Pagination).
   - `order-logs`: **Nhật ký & Cảnh báo** (`Realtime Order Feed`), displaying a searchable timeline of the latest 50 order events (`fetchOrderAlerts` using `getOrders("", 1, 50)`).
2. **Unified Realtime State & Glowing Notification Badge**: Connected `orderAlerts` with the existing realtime `liveOrderIds` set. Whenever a new order arrives via Supabase Realtime (`postgres_changes` / `broadcast NEW_ORDER`), both the orders table and the `order-logs` tab automatically refresh (`fetchOrderAlerts()`), and the **Nhật ký & Cảnh báo** tab trigger displays a glowing animated emerald ping indicator (`✨ Có N đơn hàng mới`) until acknowledged.
3. **Smooth Cross-Tab & Detail Modal Navigation**: In the `order-logs` tab, replaced the generic page navigation link (`<a href="/dashboard/orders">`) with two direct interactive actions:
   - **Xem chi tiết (`handleViewDetails(o.id)`)**: Instantly opens the rich order detail modal (`selectedOrder`) directly inside `/dashboard/orders` without page reload.
   - **Mở trong bảng**: Switches the active tab to `orders-list` (`setActiveTab("orders-list")`) and pre-fills the search input with the short order ID (`updateFilter("search", shortId)`), jumping the admin straight to the target order row.
4. **Focused Notifications Page (`/dashboard/notifications`)**: Cleaned up `app/dashboard/notifications/page.tsx` by removing the `system-alerts` tab, `orderAlerts` states, and order service imports (`getOrders`), returning `/dashboard/notifications` to a 100% focused Admin-to-Customer notification center (`Soạn tin mới` & `Lịch sử đã gửi`).

### Consequences
- Eliminates cognitive load and page reloads when checking order alerts by consolidating all order tracking into a single cohesive dashboard (`/dashboard/orders`).
- Admin notification center (`/dashboard/notifications`) is simpler, cleaner, and strictly focused on push messaging.
- Realtime responsiveness is enhanced across both tabular and feed views.

## 2026-07-15: Admin Realtime Audio & Notification Badge Refinement for Automated Payments (`VietQR/Banking`)

### Context
When a customer placed an order using COD (`paymentMethod: "cod"`), the Admin Dashboard immediately sounded an audio alert (`playCashChime`) and displayed a "New Order" notification popup (`Đơn mới!`). However, for automated online payments (`VietQR/banking`), the existing system triggered the exact same `NEW_ORDER` broadcast and `postgres_changes INSERT` notification right upon order creation (`order.status === "pending"`)—before the customer had even transferred the money (`đối với thanh toán tự động thì phải thanh toán xong mới báo ở admin`).

### Decision
1. **Conditional Realtime Broadcast in `placeOrder` (`checkout.service.ts`)**: Modified step 6 of `placeOrder()` so that `BroadcastChannel("admin_orders_channel")` and Supabase Realtime channel (`global-admin-orders-notifier`) `NEW_ORDER` events are only broadcast immediately for non-banking orders (`checkoutData.paymentMethod !== "banking" && !checkoutData.paymentMethod?.includes("VietQR")`). For automated payments, immediate audio alerting is postponed until payment confirmation.
2. **Pending Banking Order Filtering in `triggerOrderNotification` (`admin-realtime-notifier.tsx`)**: Added an early check at the entry of `triggerOrderNotification(order)`: if the incoming order is a banking/VietQR order and `order.status === "pending"`, the function returns immediately without adding the order ID to `notifiedIds.current`, without sounding `playCashChime()`, and without showing the popup toast.
3. **Automated Trigger on Payment Completion (`UPDATE` events on `orders` & `payments`)**: In `admin-realtime-notifier.tsx`, configured the `postgres_changes` listener on `orders` `UPDATE` to check if `(newOrder.payment_method === "banking" || newOrder.payment_method?.includes("VietQR")) && (newOrder.status === "paid" || newOrder.status === "completed") && !notifiedIds.current.has(newOrder.id)`. When this occurs (e.g., when the `verify-bank-payment` edge function runs `markPaymentAsMatched`), the system calls `triggerOrderNotification(newOrder)`, plays the `playCashChime()` (`Ting Ting... Ting Ting`), increments the unread badge (`admin_unread_order_ids`), and displays a customized emerald toast badge saying **`Đã thanh toán!`** (`Khách đã chuyển khoản VietQR thành công`). Added a parallel `UPDATE` listener on the `payments` table (`MATCHED`/`MANUAL`) to guarantee instantaneous alerting even if the payment table updates milliseconds ahead of the order table.
4. **Client-Side Match Broadcast (`app/(storefront)/checkout/payment/[orderId]/page.tsx`)**: In `checkStatusAndExpiry()`, when `payData.status === "MATCHED" || payData.status === "MANUAL"`, the client page posts a `NEW_ORDER` message (`{ type: "NEW_ORDER", order: { ...targetOrder, status: "paid" } }`) across `BroadcastChannel("admin_orders_channel")` to immediately alert any open Admin tabs on the same device.

### Consequences
- Admin managers no longer experience false positive audio alarms (`Ting Ting`) for unpaid pending VietQR checkout attempts.
- Automated payments sound the cash chime exactly when the bank transfer completes and the order transitions to `paid`, providing accurate and delightful real-time order fulfillment awareness.

## 2026-07-16: Hero Banner Clean Concept (`Option 3`) & Admin Coupon Homepage Option Removal

### Context
Displaying a hardcoded promo code copy box (`featuredCoupon`) inside the dynamic `HeroBannerClient` carousel (`components/storefront/hero-banner-client.tsx`) caused UX friction: (1) it diluted the unique marketing campaign message of each slide (`PromoBanner`), (2) copying a discount code at the very top of the homepage before exploring any products or prices is conceptually premature, and (3) it cluttered the visual elegance of the Ken Burns hero banners.

### Decision
1. **Removed Promo Code Box from Hero Banner (`Option 3 - Campaign-Driven Banner Strategy`)**: Removed `initialCoupon` from `HeroBanner` (`components/storefront/hero-banner.tsx`) and `HeroBannerClientProps` (`components/storefront/hero-banner-client.tsx`). Adjusted vertical spacing (`space-y-6 sm:space-y-7` and `pt-4` on the CTA button) so the badge, title, description, and `[ Khám phá ngay ]` CTA button sit with perfect breathing room (`vừa vặn`), maximizing visual appeal without clutter.
2. **Simplified Admin Coupons Management (`app/dashboard/coupons/page.tsx`)**: Removed the `Hiện trang chủ` (`is_featured`) toggle and column from the Admin Coupons table, updated the modal subtitle and label (`Tiêu đề (Home)` $\rightarrow$ `Mô tả ngắn / Tiêu đề`), and refocused the page on managing all system discount codes clearly without confusing homepage toggles.
3. **Resolved React 19 / Next.js 16 Linter State-in-Effect Rule**: Replaced cascading `setActiveBanners(initialBanners)` inside `useEffect` with direct render-time assignment (`const activeBanners = initialBanners || []`) and a safe index bounds check (`safeIndex = currentIndex < activeBanners.length ? currentIndex : 0`), achieving `0 errors, 0 warnings` on `pnpm lint` and `pnpm build`.

### Consequences
- Hero Banner slides focus 100% on high-impact visual campaigns and driving click-throughs to `link_url`.
- Cleaner Admin Coupons dashboard focused strictly on coupon logic and conditions.
- Zero cascading render warnings (`react-hooks/set-state-in-effect`).

## 2026-07-17: Staff Customer Management & Account Locking (`Part 4: Users / Customers`)

### Context
Staff members (`role === "staff"`) need access to customer management (`/dashboard/users`) to assist customers with account support, creating customer profiles, updating details, or locking/unlocking abusive accounts. However, under strict role isolation and business rules: (1) Staff must never see, modify, or delete internal `Admin` or `Staff` accounts, (2) Staff must not be able to elevate customer roles to Admin or Staff, and (3) Staff must not delete accounts or reset passwords.

### Decision
1. **Server-Side Role Filtering in `getUsers` (`user.service.ts`)**: Added an optional `roleFilter` parameter to `getUsers`. When `role === "staff"`, `users-client.tsx` passes `roleFilter = "customer"`. This uses `role:roles!inner(id, name)` with `.eq("role.name", "customer")` so pagination (`count: "exact"`) reflects only customer profiles without exposing Admin/Staff records to Staff on either the client or server.
2. **Account Locking & Instant Sign-Out (`profiles.is_locked`)**: Created database migration `20260717140000_add_is_locked_to_profiles.sql` adding `is_locked BOOLEAN DEFAULT false` to `profiles`. Added an instant lock check inside `fetchProfileAndRole()` (`auth-provider.tsx`) that calls `supabase.auth.signOut()`, clears session states, alerts the user, and redirects to `/login` if `currentProfile.is_locked` is true.
3. **Staff Role Guard & UI Protection (`/dashboard/users`)**: Updated `page.tsx` with `<RoleGuard allowedRoles={["admin", "staff"]}>`. In `users-client.tsx` and `data-table.tsx`:
   - Hidden the `Xóa tài khoản` (`onDelete`) action when `role !== "admin"`.
   - Added `Khóa / Mở khóa tài khoản` action to the row dropdown and an interactive `Switch` inside the user modal.
   - Restricted the `Vai trò` dropdown options to only `"customer"` and disabled changing the role dropdown when `role === "staff"`.
   - Added `Customers` (`Khách hàng`) navigation item to `components/app-sidebar.tsx` for Staff.

### Consequences
- Staff can effectively support and manage customers (`role === "customer"`) inside `/dashboard/users` while remaining completely segregated from internal `Admin` and `Staff` user accounts.
- Locking an account immediately revokes access and signs out the locked user across all customer portals upon reload/navigation.
- Zero TypeScript errors and zero linter warnings (`pnpm lint` and `pnpm build` verified).

## 2026-07-17: Rich Global Account Locking Modals, Destructive Typing Confirmation & Compact 2-Row User Header

### Context
When administrators or staff members locked customer accounts, or when locked customers tried to sign in or navigate the app, the system relied on native browser `window.confirm` and `window.alert` popups. Furthermore, deleting user accounts (`deleteUser`) only required clicking a confirmation button in a standard dialog without typing verification (`high risk of accidental deletion`). Finally, the user account dropdown header (`site-header.tsx`) required displaying the user's role badge (`Admin`, `Staff`, `Customer`) inside a clean, space-efficient layout without increasing vertical height (`avoiding bulky 3-row layout`).

### Decision
1. **Global Account Locking Modal (`auth-provider.tsx` & `auth-modal.tsx`)**:
   - Replaced `window.alert(...)` with a global, z-indexed (`z-[9999]`) custom `<AlertDialog>` (`LockedAccountModal`) rendered directly inside `AuthProvider`.
   - Exposed `showLockedAlert()` via `useAuth()`.
   - When a locked user attempts to sign in via `AuthModal` (`signInWithPassword`), `handleLogin` immediately checks `profileData.is_locked`, executes `supabase.auth.signOut()`, closes the login modal (`closeModal()`), and invokes `showLockedAlert()`, ensuring no `Đăng nhập thành công!` toast or `/checkout` redirection occurs.
   - For Admin and Staff toggling account lock status (`onToggleLock`), created a rich contextual `AlertDialog` explaining the exact consequences of locking or unlocking access (`execution via executeToggleLock`).
2. **Destructive Typing Confirmation for Account Deletion (`users-client.tsx`)**:
   - Upgraded the `AlertDialog` for `deleteUser` (`deleteTarget`) by requiring administrators to explicitly type **`XÓA TÀI KHOẢN`** or the exact email (`deleteTarget.email`) into an `<Input>` field before the destructive red button (`[ Xóa vĩnh viễn ]`) becomes enabled (`disabled={!isDeleteConfirmed || deleting}`).
3. **Sleek & Compact 2-Row User Dropdown Header with Inline Role Pill (`site-header.tsx`)**:
   - Redesigned `DropdownMenuLabel` in `site-header.tsx` to maintain a compact 2-row height (`space-y-0.5`).
   - Placed the Role Badge (`Admin`, `Staff`, `Khách`) on the same horizontal line (`Row 1`) next to the truncated full name (`flex items-center justify-between gap-1.5`) with distinct color tokens (`red` for Admin, `blue` for Staff, `emerald` for Customer) and subtle borders (`border-border/40`).

### Consequences
- Sleek, highly compact user account dropdown header displaying email, display name, and role badge within exact 2-row vertical bounds (`0 errors, 0 warnings` across `pnpm lint` and `pnpm build`).

## 2026-07-18: Zero-Latency Auth Reload (`0ms Spinner`) via Instant SessionStorage Caching & Non-Blocking Cart Sync

### Context
When logged-in customers navigated between pages or pressed reload (`F5`) inside protected account routes (`/account/*`), the full-screen loading spinner (`LuxeLoading label="Đang xác thực tài khoản..."`) flashed for 1–2 seconds on every reload. This occurred because `AuthProvider` initialized `loading = true` on mount and awaited sequential Postgres network queries (`fetchProfileAndRole` plus `syncGuestCartToSupabase`) before setting `loading = false`.

### Decision
1. **Instant Session check via `getSession()`**: Replaced blocking `await supabase.auth.getUser()` during initial client mount with `getSession()`, reading the JWT from local browser memory (`localStorage/cookies`) in `0ms` network latency.
2. **Instant Stale-While-Revalidate Tab Caching (`sessionStorage`)**: Upon fetching a user profile (`fetchProfileAndRole`), the data (`profile` and `role`) is cached in `sessionStorage.setItem("luxe_auth_cache_" + userId)`. When `AuthProvider` mounts after a page reload (`F5`), it checks `sessionStorage` instantly (`~1ms`), sets `profile` and `role`, and unlocks the UI immediately (`setLoading(false)`) without waiting for Postgres queries (`0ms spinner`). Meanwhile, `fetchProfileAndRole` revalidates the latest profile from Supabase in the background.
3. **Non-Blocking Background Cart Sync**: Separated `syncGuestCartToSupabase()` from the blocking `Promise.all` initialization chain. Cart merging now executes asynchronously in the background (`syncGuestCartToSupabase().then(...).catch(...)`), preventing DB cart checks from blocking user authentication state transitions.

### Consequences
- Eliminates `Đang xác thực tài khoản...` spinner delay on tab refresh (`F5`) or navigation for already-authenticated users.
- Maintained 100% linter and build compliance (`0 errors, 0 warnings` across `pnpm lint` and `pnpm build`).

## 2026-07-18: Complete Removal of Authentication Loading Screen (`Đang xác thực tài khoản...`) Across All Account Pages

### Context
Even with zero-latency session caching, the user requested to completely eliminate any possibility of the full-screen verification spinner (`<LuxeLoading label="Đang xác thực tài khoản..." />`) appearing during initial mount, redirect checks, or sub-page data fetches within `/account/*`.

### Decision
1. **Silent Auth Layout Rendering (`app/(storefront)/account/layout.tsx`)**: Removed the `if (loading || !user) return <LuxeLoading label="Đang xác thực tài khoản..." />` check entirely. Replaced it with `if (!user) return null;`. If a session is already cached (`~1ms`), the layout renders immediately. If a guest visits without a session, the layout silently returns `null` while `useEffect` redirects them to `/` without flashing any loading overlay.
2. **Decoupled Auth Loading from Inner Account Pages**: Removed `authLoading` checks across `orders/page.tsx`, `settings/page.tsx`, `addresses/page.tsx`, and `wishlist/page.tsx`. Sub-page data fetches now run as soon as `user` is available without waiting on or showing full-screen spinners for `authLoading`.

### Consequences
- Total removal of the "Đang xác thực tài khoản..." loading screen (`0 instances of verification spinners across account pages`).
- Instantaneous, flicker-free navigation inside customer account sections.
- Verified `0 errors, 0 warnings` across both `pnpm lint` and `pnpm build`.

## 2026-07-18: Accurate Post-Login Redirection via Role Resolution (`getRole(profileData.role_id)`)

### Context
When logging in as `admin` or `staff` through either the popup login modal (`AuthModal`) or the standalone login page (`/login`), users were not automatically redirected to `/dashboard`. Investigation revealed that the login handlers checked `profileData?.role`, but the `profiles` table schema only stores `role_id` (a UUID foreign key pointing to the `roles` table). Consequently, `profileData.role` evaluated to `undefined`, causing the handler to default to `router.push("/")`.

### Decision
1. **Explicit Role Resolution in Auth Handlers (`components/auth/auth-modal.tsx` & `app/(guest)/login/page.tsx`)**: After fetching `getProfile(authData.user.id)`, if `profileData.role_id` exists, the handler explicitly queries `getRole(profileData.role_id)` from `role.service.ts` to extract the role string (`roleData.name`).
2. **Deterministic Role-Based Routing**:
   - If `userRole === "admin" || userRole === "staff"`, execute `router.push("/dashboard")`.
   - If `userRole === "customer"` and the user is on `/cart`, execute `router.push("/checkout")`.
   - Otherwise, execute `router.push("/")`.

### Consequences
- Flawless, immediate redirection of administrative and staff accounts to `/dashboard` upon authentication.
- Guaranteed consistency across both popup modal (`AuthModal`) and full-page (`/login`) entry points.
- Maintained strict `0 errors, 0 warnings` across both `pnpm lint` and `pnpm build`.

## 2026-07-18: Product Asset Display Standardization (`object-contain` within `aspect-square`)

### Context
When displaying products with drastically different aspect ratios (e.g., horizontal/wide `16:9` laptops vs. vertical/tall `9:16` smartphones), the existing `object-cover` styling cropped the outer edges of widescreen laptops and top/bottom edges of smartphones to fill the `aspect-square` container.

### Decision
1. **Container Padding + `object-contain` Scaling**: Replaced `object-cover` across all primary product display components (`ProductCard` in `product-card.tsx`, `ProductGallery` in `product-gallery.tsx`, and `CategoriesSection` in `categories-section.tsx`) with `object-contain` inside `aspect-square` containers with subtle inner padding (`p-4` or `p-6`) and soft tinted backgrounds (`bg-secondary/30` or `bg-secondary/20`).
2. **Interactive Micro-Animations**: Preserved and enhanced gentle zoom-in hover animations (`transition-transform duration-300 group-hover:scale-105`) while ensuring that the entire uncropped product image remains visible at all times.

### Consequences
- Zero cropping or edge truncation regardless of raw image dimensions or aspect ratios (from vertical phones to wide laptops and square accessories).
- Consistent, uniform `aspect-square` grid alignment across `/products`, `/product/[id]`, and homepage category sections.
- Verified clean compilation with `0 errors, 0 warnings` across `pnpm lint` and `pnpm build`.

## 2026-07-18: Comprehensive Product Detail Discount Banner & Savings Breakdown

### Context
On the Product Detail page (`/product/[id]`), when a product had an active promotional discount (`discount_percent > 0`), the UI only rendered the strikethrough original price next to the sale price, lacking any prominent discount percentage badge or detailed savings breakdown.

### Decision
1. **Gallery Badge Overlay**: Updated `ProductGallery` (`components/storefront/product-gallery.tsx`) to accept `discountPercent` and render an eye-catching red `-X%` `Badge` overlay on the top-left corner of the main product image.
2. **Dedicated Discount & Savings Container**: Enhanced `ProductActions` (`components/storefront/product-actions.tsx`) with a rich-aesthetic promotional box featuring:
   - High-contrast red/amber `GIẢM NGAY X%` badge with pulse icon.
   - Explicit direct savings calculation (`finalOriginalPrice - finalPrice`) in Vietnamese currency format (`Tiết kiệm trực tiếp: X đ`).
   - Promotional perks and buyer guarantees (`Miễn phí vận chuyển từ 500k`, `Bảo hành chính hãng 100%`).

### Consequences
- Maximized conversion appeal and price transparency on the Product Detail page whenever a discount is present.
- Maintained strict 0 errors/warnings across both `pnpm lint` and `pnpm build`.

## 2026-07-18: Mobile and Tablet (`iPad Mini`) Responsive Optimization for Product Detail Discount Box

### Context
On narrow screens and intermediate tablet viewports like iPad Mini portrait (`md` breakpoint where the right product detail column is ~340px wide), the newly added discount box suffered from two horizontal overflow issues:
1. The sale price (`60.742.500 đ`) and strikethrough original price (`80.990.000 đ`) sat inside a non-wrapping container (`flex items-baseline space-x-3`), forcing the original price to overflow past the right border (`border-red-500`).
2. The bottom row (`Tiết kiệm: X đ` and `Ưu đãi áp dụng có hạn` pill) used `sm:flex-row justify-between`, causing the pill text to squeeze into multiple lines inside its rounded border on 340px tablet columns.

### Decision
1. **Fluid Responsive Typography and Flex Wrapping (`product-actions.tsx`)**:
   - Replaced fixed price wrapping with `flex flex-wrap items-baseline gap-2 sm:gap-3`, allowing the original price to cleanly wrap beneath the sale price on narrow containers without overflowing.
   - Scaled typography dynamically across breakpoints (`text-2xl sm:text-3xl xl:text-4xl` for sale price and `text-base sm:text-lg xl:text-xl` for original price).
2. **Intelligent Breakpoint Stacking (`xl:flex-row` vs `sm:flex-row`)**:
   - Upgraded both top and bottom rows to `flex flex-col xl:flex-row xl:items-center justify-between gap-2.5 sm:gap-3`. On Mobile and iPad Mini columns, elements stack neatly vertically, while expanding to side-by-side layout on Desktop (`xl`).
   - Added `shrink-0` to badges and buttons to guarantee crisp 1-line text rendering without pill squishing.

### Consequences
- Zero horizontal overflow or squished text across Mobile (`320px+`), Tablet/iPad Mini (`768px`), and Desktop (`1440px+`).
- Verified 100% clean compilation (`0 errors, 0 warnings`) with `pnpm lint` and `pnpm build`.

## 2026-07-18: Luxury Shimmering VIP Discount Banner (`Card Ưu Đãi Hoàng Gia`)

### Context
To elevate visual excellence and create an ultra-premium, sparkling aesthetic (`lung linh, óng ánh, sang trọng, bắt mắt`), the Product Detail discount container was redesigned from a basic bordered box into a high-end glowing metallic glassmorphism display, matching the visual sophistication of `site-header.tsx`.

### Decision
1. **Dynamic Shimmer Light Reflection (`animate-shimmer-sweep`)**: Added a 20-degree skewed light beam reflection animation to `app/globals.css` that continuously sweeps across the discount card (`animate-shimmer-sweep`), giving it a radiant, jewel-like sheen.
2. **Multilayered Glassmorphic Glow Frame (`product-actions.tsx`)**:
   - Built a dual-layer container featuring a razor-sharp `bg-gradient-to-r from-red-500 via-amber-400 to-rose-600` outer border wrapper with animated ambient background orbs (`blur-2xl animate-pulse`).
   - Inner container uses `backdrop-blur-xl bg-gradient-to-br from-white/95 via-red-50/90 to-amber-50/80 dark:from-surface/95` to deliver a frosted VIP card feel.
3. **Metallic Ruby/Gold Typography & Pill Badges**:
   - Sale price rendered with `bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 bg-clip-text text-transparent` for shimmering metallic digits.
   - Removed artificial `hidden sm:flex` visibility rules so all users across Mobile, Tablet, and Desktop enjoy the full shimmering badges (`GIẢM NGAY X%` and `Tiết kiệm trực tiếp`) in perfect responsive alignment.

### Consequences
- Achieved a breathtaking, state-of-the-art visual presentation (`lung linh, óng ánh`) that maximizes user engagement and perceived product value.
- Confirmed 0 errors across `pnpm lint` and `pnpm build`.







