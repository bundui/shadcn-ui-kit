import React from "react";
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import AuthGuard from "@/components/guards/auth-guard";
import RoleGuard from "@/components/guards/role-guard";
import { AdminRealtimeNotifier } from "@/components/admin-realtime-notifier";


export default function Page({children}: { children: React.ReactNode}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4  md:gap-6 p-4 lg:p-6">
              <AuthGuard>
                <RoleGuard allowedRoles={["admin", "staff"]}>
                  <AdminRealtimeNotifier />
                  {children}
                </RoleGuard>
              </AuthGuard>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
