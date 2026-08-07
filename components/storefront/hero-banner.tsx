import { getPromoBanners, PromoBanner } from "@/lib/services/banner.service";
import { HeroBannerClient } from "@/components/storefront/hero-banner-client";

const FALLBACK_BANNERS: PromoBanner[] = [
  {
    id: "fallback-banner-1",
    title: "Bộ Sưu Tập\nThời Trang Cao Cấp",
    description: "Khám phá những mẫu thiết kế độc quyền với chất lượng vượt trội, tôn vinh phong cách sang trọng và đẳng cấp của bạn.",
    image_url: "/seo.jpg",
    link_url: "/products",
    badge_text: "MỚI RA MẮT 2026",
    order_index: 1,
    is_active: true,
  },
];

export async function HeroBanner() {
  // Tải dữ liệu trực tiếp trên máy chủ Next.js (Server-Side Fetching)
  const bannerRes = await getPromoBanners().catch(() => ({ data: null }));

  const banners = bannerRes && bannerRes.data && bannerRes.data.length > 0
    ? bannerRes.data
    : FALLBACK_BANNERS;

  return <HeroBannerClient initialBanners={banners} />;
}

