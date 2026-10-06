import { ExternalLinkIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PagesSection from "./pages-section";
import { dashboardData } from "@/components/sections/dashboard-data";

export default function DashboardSection() {
  return (
    <section>
      <div className="container border-x px-0 pt-8 lg:pt-16">
        <div className="space-y-6 lg:space-y-14">
          <header className="space-y-6 px-4">
            <div className="mx-auto max-w-4xl space-y-4 text-center">
              <h1 className="text-4xl font-heading font-semibold leading-tight text-balance lg:text-6xl">
                Powerful Shadcn Admin Dashboard Templates
              </h1>
              <p className="text-muted-foreground text-balance lg:text-lg/relaxed">
                Includes {dashboardData.dashboards.length} production-ready
                admin dashboards,{" "}
                {dashboardData.apps.length + dashboardData.aiApps.length} fully
                built web applications, and {dashboardData.subpages}+ additional
                pages. Comes packed with
                tables, menus, forms, charts, and a wide range of essential UI
                components, so you don’t have to build everything from scratch.
                This ready-made dashboard template saves you dozens of hours of
                development time and significantly reduces overall project
                costs, allowing you to focus on delivering value instead of
                rebuilding common features.
              </p>
            </div>
            <div className="flex justify-center gap-2">
              <Button size="lg" asChild>
                <Link href="https://shadcnuikit.com/pricing">Get All Access</Link>
              </Button>
              <Button variant="secondary" size="lg" asChild>
                <Link target="_blank" href="https://shadcnuikit.com/dashboard/default">
                  Preview Demo
                  <ExternalLinkIcon />
                </Link>
              </Button>
            </div>
          </header>

          <PagesSection />
        </div>
      </div>
    </section>
  );
}
