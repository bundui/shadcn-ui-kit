import type { Metadata } from "next";
import FaqSection from "@/components/sections/FaqSection";
import { generateMeta } from "@/lib/metadata";
import ReviewsSection from "@/components/sections/reviews";
import HeroSection from "@/components/sections/hero-section";
import BentoSection from "@/components/sections/bento";
import DashboardSection from "@/components/sections/dashboard-section";
import ComponentsSection from "@/components/sections/components-section";
import StatSection from "@/components/sections/stat-section";
import CTASection from "@/components/sections/cta-section";
import TemplatesSection from "@/components/sections/templates-section";

export const metadata: Metadata = generateMeta({
  title: "",
  description:
    "Shadcn UI Kit is a collection of admin dashboards, website templates, components, UI blocks and Figma UI kit. Built with Tailwind CSS and React. It helps save time by minimizing development time.",
});

export default function Home() {
  return (
    <>
      <HeroSection />
      <BentoSection />
      <DashboardSection />
      <ComponentsSection />
      <TemplatesSection />
      <ReviewsSection />
      <StatSection />
      <FaqSection />
      <CTASection />
    </>
  );
}
