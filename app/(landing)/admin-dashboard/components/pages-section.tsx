"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  dashboardData,
  ListItem as DashboardListItem,
} from "@/components/sections/dashboard-section";
import {
  upcomingApps,
  upcomingDashboards,
} from "@/components/sections/dashboard-data";
import ComingSoonItem from "./coming-soon-item";

export default function PagesSection() {
  return (
    <Tabs defaultValue="blocks" className="gap-0">
      <TabsList className="bg-background sticky top-14 z-20 h-auto! w-auto gap-0 rounded-none border-0 border-t border-b p-0 lg:top-26">
        <TabsTrigger
          value="blocks"
          className="data-[state=active]:bg-muted hover:bg-muted/30 data-[state=active]:text-foreground hover:text-foreground flex flex-col gap-0 rounded-none border-0 bg-transparent p-4 data-[state=active]:shadow-none!"
        >
          <span className="text-foreground font-medium lg:text-base">
            {dashboardData.dashboards.length} Dashboards
          </span>
          <span className="text-muted-foreground hidden text-sm lg:inline">
            CRM, E-commerce, Sales, Finance, Payment, and more
          </span>
        </TabsTrigger>
        <span aria-hidden="true" className="bg-border w-px self-stretch" />
        <TabsTrigger
          value="components"
          className="data-[state=active]:bg-muted hover:bg-muted/30 data-[state=active]:text-foreground hover:text-foreground flex flex-col gap-0 rounded-none border-0 bg-transparent p-4 data-[state=active]:shadow-none!"
        >
          <span className="text-foreground font-medium lg:text-base">
            {dashboardData.apps.length + dashboardData.aiApps.length} Web Apps
          </span>
          <span className="text-muted-foreground hidden text-sm lg:inline">
            Kanban, Todo List, Calendar, File Manager, and more
          </span>
        </TabsTrigger>
        <span aria-hidden="true" className="bg-border w-px self-stretch" />
        <Link
          href="https://shadcnuikit.com/dashboard/default"
          target="_blank"
          className="hover:bg-muted/30 hover:text-foreground flex flex-1 flex-col items-center justify-center gap-0 p-4 text-sm whitespace-nowrap"
        >
          <span className="text-foreground font-medium lg:text-base">
            {dashboardData.subpages}+ Subpages
          </span>
          <span className="text-muted-foreground hidden text-sm lg:inline">
            Error Pages, Widgets, and more
          </span>
        </Link>
      </TabsList>

      <TabsContent value="blocks" className="space-y-4 p-4 lg:space-y-8 lg:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {dashboardData.dashboards.map((item, key: number) => (
            <DashboardListItem key={key} item={item} />
          ))}
          {upcomingDashboards.map((item, key: number) => (
            <ComingSoonItem key={key} name={item.name} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-3 pb-10">
          <Button size="lg" asChild>
            <Link href="https://shadcnuikit.com/dashboard/default">Browse all dashboards.</Link>
          </Button>
        </div>
      </TabsContent>

      <TabsContent
        value="components"
        className="space-y-4 p-4 lg:space-y-8 lg:p-6"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {[...dashboardData.apps, ...dashboardData.aiApps].map(
            (item, key: number) => (
              <DashboardListItem key={key} item={item} />
            ),
          )}
          {upcomingApps.map((item, key: number) => (
            <ComingSoonItem key={key} name={item.name} />
          ))}
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-3 pb-10">
          <Button size="lg" asChild>
            <Link href="https://shadcnuikit.com/dashboard/default">Browse all apps.</Link>
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
