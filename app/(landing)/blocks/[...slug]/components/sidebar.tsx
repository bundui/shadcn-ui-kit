"use client";

import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { categories } from "../../categories";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";

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

  const filteredCategories = useMemo(() => {
    if (!searchTerm.trim()) {
      return categories;
    }

    const searchLower = searchTerm.toLowerCase().trim();

    return categories
      .map((category) => {
        const filteredItems = category.items?.filter((item) => {
          const matchesTitle = item.title.toLowerCase().includes(searchLower);
          const matchesDescription = item.description
            ?.toLowerCase()
            .includes(searchLower);
          const matchesCategory = category.title
            .toLowerCase()
            .includes(searchLower);

          return matchesTitle || matchesDescription || matchesCategory;
        });

        if (filteredItems && filteredItems.length > 0) {
          return {
            ...category,
            items: filteredItems,
          };
        }

        if (category.title.toLowerCase().includes(searchLower)) {
          return category;
        }

        return null;
      })
      .filter((category) => category !== null) as typeof categories;
  }, [searchTerm]);

  useEffect(() => {
    toggleSidebar();
  }, [pathname]);

  return (
    <Sidebar
      onClick={toggleSidebar}
      collapsible="none"
      className="bg-transparent!"
    >
      <SidebarHeader onClick={(e) => e.stopPropagation()}>
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative -ms-3">
            <Label htmlFor="search" className="sr-only">
              Search
            </Label>
            <SidebarInput
              id="search"
              placeholder="Search blocks..."
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="pl-8"
            />
            <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarHeader>
      <SidebarContent key={searchTerm.length} className="gap-0">
        {filteredCategories.length === 0 && searchTerm.trim() ? (
          <SidebarGroup className="px-4 lg:px-0">
            <SidebarGroupContent>
              <div className="text-muted-foreground py-8 text-center text-sm">
                No results found.
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        ) : (
          filteredCategories.map((item, key) => (
            <SidebarGroup key={key} className="px-4 lg:px-0">
              <SidebarGroupLabel className="text-foreground text-sm">
                {item.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenuSub className="ms-0 gap-0 border-l-0 ps-0">
                  {item.items?.length &&
                    item.items.map((subItem) => {
                      const newCount = subItem.components.filter(
                        (component) => "isNew" in component && component.isNew,
                      ).length;
                      const isNew = "isNew" in subItem && subItem.isNew;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === subItem.href}
                          >
                            <Link
                              href={subItem.href}
                              className="hover:bg-sidebar-accent/40 hover:text-accent-foreground! text-accent-foreground/70! data-[active=true]:text-accent-foreground! flex justify-between opacity-80 hover:opacity-100 data-[active=true]:opacity-100"
                            >
                              {subItem.sidebarTitle}
                              <span className="flex items-center gap-2">
                                {(newCount > 0 || isNew) && (
                                  <span className="rounded-full bg-emerald-50 px-1.5 py-px text-[10px] leading-4 font-medium text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                                    {newCount > 0 ? `+${newCount}` : "New"}
                                  </span>
                                )}
                                <span className="text-xs opacity-70">
                                  {subItem.components?.length}
                                </span>
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                </SidebarMenuSub>
              </SidebarGroupContent>
            </SidebarGroup>
          ))
        )}
      </SidebarContent>
    </Sidebar>
  );
}
