import type { Metadata } from "next";

import { generateMeta } from "@/lib/metadata";
import DashboardSection from "./components/dashboard-section";
import CTASection from "@/components/sections/cta-section";
import ReviewsSection from "@/components/sections/reviews";

import PluginsSection from "./components/plugins-section";
import { dashboardData } from "@/components/sections/dashboard-data";

const dashboardsCount = dashboardData.dashboards.length;
const webAppsCount = dashboardData.apps.length + dashboardData.aiApps.length;
const subpagesCount = dashboardData.subpages;

export const metadata: Metadata = generateMeta({
  title: "Shadcn Admin Dashboard Templates",
  description:
    `Start with ${dashboardsCount} production-ready admin dashboard templates, ${webAppsCount} complete web apps and ${subpagesCount}+ extra pages instead of building from scratch. Each template includes tables, menus, forms, charts and essential UI components, saving you dozens of development hours. Built with Next.js, React, Tailwind CSS and shadcn/ui.`,
});

export default function Page() {
  return (
    <>
      <DashboardSection />
      <PluginsSection />
      <CTASection
        title={`Get All ${dashboardsCount} Admin Dashboards with One Payment`}
        description={`Stop rebuilding the same tables, forms and charts for every project. Pay once and keep all ${dashboardsCount} admin dashboard templates, ${webAppsCount} web apps and ${subpagesCount}+ extra pages forever. New dashboards and free updates are included as the collection grows.`}
        buttonText="Get All Access"
      />
      <ReviewsSection />
    </>
  );
}
