import { HeroBanner } from "@/components/storefront/hero-banner";
import { FlashSale } from "@/components/storefront/flash-sale";
import { CategoriesSection } from "@/components/storefront/categories-section";
import { NewArrivals } from "@/components/storefront/new-arrivals";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function StorefrontHomePage() {
  return (
    <>
      <HeroBanner />
      <CategoriesSection />
      <FlashSale />
      <NewArrivals />
    </>
  );
}
