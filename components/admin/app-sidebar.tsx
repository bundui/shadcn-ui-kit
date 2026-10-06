"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar, IconCircle,
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconFolder,
  IconInnerShadowTop,
  IconListDetails,
  IconUsers
} from "@tabler/icons-react";

import { NavMain } from "@/components/admin/nav-main"
import { NavSecondary } from "@/components/admin/nav-secondary"
import { NavUser } from "@/components/admin/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Toby Belhome",
    email: "m@example.com",
    avatar: "https://www.tobybelhome.com/toby-belhome.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
    },
    {
      title: "Users",
      url: "/admin/users",
      icon: IconListDetails,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconChartBar,
    },
    {
      title: "Login",
      url: "/admin/login",
      icon: IconFolder,
    },
    {
      title: "Register",
      url: "/admin/register",
      icon: IconUsers,
    },
    {
      title: "404 Page",
      url: "/admin/404-page",
      icon: IconFolder,
    },
    {
      title: "500 Page",
      url: "/admin/500-page",
      icon: IconUsers,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Get Pro",
      url: "https://shadcnuikit.com/pricing",
      icon: IconCircle,
    },
    {
      title: "Shadcn UI Kit",
      url: "https://shadcnuikit.com/",
      icon: IconCircle,
    },
    {
      title: "Bundui Component",
      url: "https://bundui.io",
      icon: IconCircle,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img src="/logo.png" className="size-6 rounded-sm group-data-[collapsible=icon]:size-5" alt="shadcn ui kit svg logo" />
                <span className="text-base font-medium">Shadcn UI Kit</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
