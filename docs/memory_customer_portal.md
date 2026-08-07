# Memory Chunk: Customer Account Portal & Coupons

## 1. Architecture
- **Customer Account Portal (`/account`)**: Designed with a responsive sidebar layout (`app/(storefront)/account/layout.tsx`). Utilizes the global `useAuth` hook to protect all nested routes. Unauthenticated users are redirected to `/login` seamlessly.
- **Service Layer Abstraction**: Introduced domain-specific services (`lib/services/coupon.service.ts`, `address.service.ts`, `wishlist.service.ts`, `profile.service.ts`) to cleanly separate business logic from UI components.

## 2. Database Design
- **Wishlists & Addresses**: Built upon the existing Supabase tables (`wishlists`, `addresses`). Both tables enforce strict Row Level Security (RLS) ensuring `auth.uid() = user_id`.
- **Coupons**: The `coupons` table is publicly readable (`SELECT` policy) but modifications are restricted to Admin (`is_admin` via RPC/Role check). Uses `used_count` and `usage_limit` fields.

## 3. Business Rules
- **Coupons**: Validation must happen server-side during checkout (`placeOrder` function) to prevent client-side manipulation. Each order accepts at most one coupon. Upon success, `used_count` increments atomically. Guest users cannot use coupons.
- **Addresses**: A user can have multiple delivery addresses, but only ONE can be marked as `is_default`. Setting a new default automatically unsets the previous ones.
- **Wishlists**: Users can toggle products directly from the Product Details Page or via their Wishlist Grid. 
- **Orders**: Users can cancel an order ONLY IF it is still in the `pending` state.

## 4. Technical Decisions
- **Real-time Price Recalculation**: On the Checkout page, applying a coupon instantly recalculates the grand total on the client for UX, while the final strict validation happens on the server during submission.
- **Header Integrations**: The global `site-header` utilizes centralized `auth` state to handle the "Wishlist" heart icon click - triggering the Auth Modal automatically if the user is not logged in, keeping the conversion funnel smooth.
