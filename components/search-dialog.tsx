"use client";

import React, { useMemo, useRef, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { dashboard_routes, PageRouteItem } from "@/lib/routes-config";
import { useEffect } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import Icon from "@/components/icon";
import { componentCategories } from "@/app/(landing)/components/component-categories";
import { categories as blocksCategories } from "@/app/(landing)/blocks/categories";
import { categories as examplesCategories } from "@/app/(landing)/examples/categories";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ADMIN_DASHBOARD_ITEMS,
  CONTENT_ITEMS,
  MCP_LINK,
  TEMPLATES_LINK,
  type NavItem,
} from "@/lib/nav-items";

const NAV_GROUPS: { heading: string; items: NavItem[] }[] = [
  { heading: "Admin Dashboards", items: ADMIN_DASHBOARD_ITEMS },
  {
    heading: "Browse",
    items: [TEMPLATES_LINK, MCP_LINK],
  },
  { heading: "Components & Blocks", items: CONTENT_ITEMS },
];

function isExternal(href: string) {
  return /^https?:\/\//.test(href);
}

type CommandItemProps = {
  item: PageRouteItem;
  parentItem?: PageRouteItem;
  parentTitle?: string;
  searchKeys: string[];
  showBadge?: boolean;
};

export default function SearchDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const navigate = (href: string) => {
    if (isExternal(href)) window.location.href = href;
    else router.push(href);
  };

  useEffect(() => {
    if (!open) {
      setSearch("");
      setActiveTab("All");
    }
  }, [open]);

  const CommandItemComponent: React.FC<CommandItemProps> = ({
    item,
    parentItem,
    parentTitle,
    searchKeys,
    showBadge = false,
  }) => {
    if (!item.href) return null;

    return (
      <CommandItem
        value={searchKeys.join(" ")}
        onSelect={() => {
          if (item.href) {
            setOpen(false);
            navigate(item.href);
          }
        }}
      >
        {item.icon && <Icon name={item.icon} className="size-4! opacity-65" />}
        <span className="flex flex-1 items-center gap-1">
          {parentItem ? `${parentItem.title}` : null}{" "}
          {parentItem ? <ChevronRightIcon className="size-3!" /> : null}{" "}
          {(item as any).sidebarTitle ?? item.title}
        </span>
        {showBadge && (
          <Badge
            variant="outline"
            className="text-muted-foreground border-0 font-normal opacity-70"
          >
            {parentTitle}
          </Badge>
        )}
      </CommandItem>
    );
  };

  const allItems = useMemo(() => {
    const dashboardPages = dashboard_routes.flatMap((route) => route.items);
    const items: any[] = dashboardPages.flatMap((item) => {
      const result = [{ ...item, icon: "Circle", badge: "Dashboard" }];
      item.items?.forEach((subItem) => {
        result.push({
          ...subItem,
          title: `${item.title} -> ${subItem.title}`,
          icon: "Circle",
          badge: "Dashboard",
        });
      });
      return result;
    });

    componentCategories.forEach((category) => {
      items.push({
        title: category.title,
        sidebarTitle: (category as any).sidebarTitle,
        href: category.href,
        icon: "Component",
        badge: "Components",
        searchKeys: category.title.toLowerCase().split(" "),
      });
    });

    blocksCategories
      .flatMap((category) => category.items)
      .forEach((category) => {
        items.push({
          title: category.title,
          sidebarTitle: (category as any).sidebarTitle,
          href: category.href,
          icon: "CircleDashed",
          badge: "Blocks",
          searchKeys: category.title.toLowerCase().split(" "),
        });
      });

    examplesCategories
      .flatMap((category) => category.items)
      .forEach((category) => {
        items.push({
          title: category.title,
          sidebarTitle: (category as any).sidebarTitle,
          href: category.href,
          icon: "Shapes",
          badge: "Examples",
          searchKeys: category.title.toLowerCase().split(" "),
        });
      });

    return items;
  }, []);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return allItems;
    const q = search.toLowerCase();
    return allItems.filter((item) => {
      const keys: string[] =
        item.searchKeys ?? item.title.toLowerCase().split(" ");
      return (
        item.title.toLowerCase().includes(q) ||
        keys.some((k: string) => k.includes(q))
      );
    });
  }, [allItems, search]);

  const availableTabs = useMemo(() => {
    const badges = [...new Set(filteredItems.map((i) => i.badge as string))];
    return ["All", ...badges];
  }, [filteredItems]);

  useEffect(() => {
    if (activeTab !== "All" && !availableTabs.includes(activeTab)) {
      setActiveTab("All");
    }
  }, [availableTabs, activeTab]);

  const visibleItems = useMemo(() => {
    if (activeTab === "All") return filteredItems;
    return filteredItems.filter((i) => i.badge === activeTab);
  }, [filteredItems, activeTab]);

  const showNavigation = !search.trim() && activeTab === "All";

  const groupedItems = useMemo(() => {
    return visibleItems.reduce(
      (acc, item) => {
        const key = item.badge || "Others";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      },
      {} as Record<string, any[]>,
    );
  }, [visibleItems]);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="top-1/3 translate-y-0 overflow-hidden rounded-4xl! p-4"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Search</DialogTitle>
          <DialogDescription className="sr-only">
            Search components, blocks, examples and pages.
          </DialogDescription>
          <Command className="overflow-visible bg-transparent p-0">
            <h4 className="font-heading mb-4 text-xl font-semibold">Search</h4>
            {availableTabs.length > 1 && (
              <Tabs
                value={activeTab}
                onValueChange={(val) => {
                  setActiveTab(val);
                  listRef.current?.scrollTo({ top: 0 });
                }}
              >
                <TabsList className="w-full">
                  {availableTabs.map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="h-7 rounded-full px-3 text-xs"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            )}

            <div className="-mx-1 py-2">
              <CommandInput
                autoFocus
                placeholder="Search in Shadcn UI Kit..."
                value={search}
                onValueChange={setSearch}
              />
            </div>
            <CommandList ref={listRef}>
              <CommandEmpty>No results found.</CommandEmpty>
              {showNavigation &&
                NAV_GROUPS.map((group) => (
                  <CommandGroup
                    key={group.heading}
                    className="p-0"
                    heading={group.heading}
                  >
                    {group.items.map((item) => (
                      <CommandItem
                        key={item.href}
                        value={`${item.title} ${item.description}`}
                        onSelect={() => {
                          setOpen(false);
                          navigate(item.href);
                        }}
                        className="gap-3"
                      >
                        <span className="bg-background flex size-8 shrink-0 items-center justify-center rounded-md border">
                          <item.icon className="size-4" />
                        </span>
                        <span className="flex min-w-0 flex-col">
                          <span className="flex items-center gap-1.5 font-medium">
                            {item.title}
                            {item.isNew && (
                              <Badge
                                variant="outline"
                                className="h-4 px-1.5 text-[10px]"
                              >
                                New
                              </Badge>
                            )}
                          </span>
                          <span className="text-muted-foreground truncate text-xs">
                            {item.description}
                          </span>
                        </span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              {!showNavigation &&
                (Object.entries(groupedItems) as [string, any[]][]).map(
                  ([badge, items]) => (
                    <CommandGroup
                      className="p-0"
                      key={badge}
                      heading={activeTab === "All" ? badge : undefined}
                    >
                      {items.map((item, index: number) => (
                        <React.Fragment key={index}>
                          <CommandItemComponent
                            item={item}
                            parentTitle={badge}
                            searchKeys={
                              item.searchKeys ??
                              item.title.toLowerCase().split(" ")
                            }
                            showBadge={activeTab === "All"}
                          />
                        </React.Fragment>
                      ))}
                    </CommandGroup>
                  ),
                )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
