"use client"

import {
  IconCreditCard,
  IconDotsVertical,
  IconHome,
  IconLogin,
  IconLogout,
  IconNotification,
  IconTruckReturn,
  IconUserCircle,
} from "@tabler/icons-react"
import Link from "next/link"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "./providers/auth-provider"
import Image from "next/image"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const { user: authUser, profile, role, loading, logout } = useAuth()

  // Loading state — skeleton
  if (loading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" className="animate-pulse">
            <div className="bg-muted h-8 w-8 rounded-lg" />
            <div className="grid flex-1 gap-1.5">
              <div className="bg-muted h-3.5 w-24 rounded" />
              <div className="bg-muted h-2.5 w-32 rounded" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Guest state — not logged in
  if (!authUser) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" asChild className="hover:bg-emerald-500/10 hover:text-emerald-600 transition-all duration-300 rounded-[16px] p-2 group">
            <Link href="/login" className="gap-3">
              <Avatar className="h-9 w-9 rounded-xl shadow-sm border border-border/50 group-hover:scale-105 transition-transform">
                <AvatarFallback className="bg-emerald-100 dark:bg-emerald-950/50 rounded-xl">
                  <IconUserCircle className="text-emerald-600 dark:text-emerald-400 size-5" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">Khách</span>
                <span className="text-muted-foreground group-hover:text-emerald-600/70 truncate text-xs transition-colors">
                  Đăng nhập vào tài khoản
                </span>
              </div>
              <IconLogin className="text-muted-foreground group-hover:text-emerald-600 ml-auto size-5 transition-colors" />
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  }

  // Authenticated state
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Home" className="hover:bg-emerald-500/10 hover:text-emerald-600 transition-all duration-300 rounded-[12px] mb-2 font-medium">
          <Link href="/">
            <Image width={20} height={20} src="/icons/back.png" alt="Home" />
            <span>Về trang chủ</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-emerald-500/10 data-[state=open]:text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 transition-all duration-300 rounded-[16px] p-2 group"
            >
              <Avatar className="h-9 w-9 rounded-xl shadow-sm border border-border/50 group-hover:scale-105 transition-transform">
                <AvatarImage src={profile?.avatar_url || authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture || ""} alt={profile?.full_name || authUser?.email || "User"} className="object-cover" />
                <AvatarFallback className="rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 font-bold">
                  {profile?.full_name?.substring(0, 2)?.toUpperCase() || authUser?.email?.substring(0, 2)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold">{profile?.full_name || "User"}</span>
                <span className="text-muted-foreground group-hover:text-emerald-600/70 truncate text-xs transition-colors">
                  {authUser?.email} • <span className="capitalize">{role || "User"}</span>
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-muted-foreground group-hover:text-emerald-600 transition-colors" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-[24px] border-border/50 bg-card/95 backdrop-blur-2xl shadow-2xl p-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={10}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 bg-muted/40 p-3 rounded-[16px] text-left text-sm mb-2 border border-border/50">
                <Avatar className="h-10 w-10 rounded-xl shadow-sm border border-border/50">
                  <AvatarImage src={profile?.avatar_url || authUser?.user_metadata?.avatar_url || authUser?.user_metadata?.picture || ""} alt={profile?.full_name || authUser?.email || "User"} className="object-cover" />
                  <AvatarFallback className="rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 font-bold">
                    {profile?.full_name?.substring(0, 2)?.toUpperCase() || authUser?.email?.substring(0, 2)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-base">{profile?.full_name || "User"}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {authUser?.email}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 truncate text-[10px] font-bold uppercase tracking-wider mt-0.5">
                    {role || "User"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="opacity-50" />
            <DropdownMenuItem onClick={logout} className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-500/10 hover:bg-red-500/10 cursor-pointer rounded-[12px] py-3 mt-1 font-bold transition-all flex items-center gap-2">
              <IconLogout className="size-5" />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

