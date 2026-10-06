"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarInput,
  useSidebar
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { componentCategories } from "../../component-categories";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

const categoryLabels: Record<string, string> = {
  base: "Base",
  feedback: "Feedback",
  forms: "Forms",
  "data-display": "Data Display",
  navigation: "Navigation",
  graph: "Graph"
};

export type ComponentCategoriesProps = {
  title: string;
  href: string;
  search_keys?: string[];
  isPro?: boolean;
  isView?: boolean;
  items?: any[];
};

export default function ComponentsSidebar() {
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState("");
  const { toggleSidebar } = useSidebar();

  const groupedByCategory = useMemo(() => {
    const grouped = componentCategories.reduce(
      (acc, item) => {
        const category = item.category || "base";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      },
      {} as Record<string, typeof componentCategories>
    );

    let categories = Object.entries(grouped).map(([category, items]) => ({
      category,
      title: categoryLabels[category] || category,
      items: items
    }));

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      categories = categories
        .map((categoryGroup) => ({
          ...categoryGroup,
          items: categoryGroup.items.filter((item) =>
            item.title.toLowerCase().includes(searchLower)
          )
        }))
        .filter((categoryGroup) => categoryGroup.items.length > 0);
    }

    return categories;
  }, [searchTerm]);

  useEffect(() => {
    toggleSidebar();
  }, [pathname]);

  return (
    <Sidebar onClick={toggleSidebar} collapsible="none" className="bg-transparent! pb-10 lg:pb-20">
      <SidebarHeader
        onClick={(e) => e.stopPropagation()}
        className="bg-background sticky top-0 z-1 pt-4">
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative lg:-ms-3">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <SidebarInput
              id="search"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="pl-8"
            />
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent key={searchTerm.length} className="gap-0">
        {groupedByCategory.length === 0 && searchTerm.trim() ? (
          <div className="text-muted-foreground px-4 py-8 text-center text-sm">
            No results found.
          </div>
        ) : (
          groupedByCategory.map((categoryGroup, key) => (
            <SidebarGroup key={key} className="px-4 lg:px-0">
              <SidebarGroupLabel className="text-foreground text-sm">
                {categoryGroup.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenuSub className="ms-0 gap-0 border-l-0 ps-0">
                  {categoryGroup.items.map((item) => (
                    <SidebarMenuSubItem key={item.href}>
                      <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                        <Link
                          href={item.href}
                          className="hover:bg-sidebar-accent/40 hover:text-accent-foreground! text-accent-foreground/70! flex justify-between opacity-80 hover:opacity-100 data-[active=true]:opacity-100 data-[active=true]:text-accent-foreground!">
                          {item.title}
                          <span className="text-xs opacity-70">{item.components?.length || 0}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
    </Sidebar>
  );
}
