"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SheetClose } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";
import { useContentCounts } from "@/components/site-data-provider";
import {
  ADMIN_DASHBOARD_ITEMS,
  CONTENT_ITEMS,
  MCP_LINK,
  TEMPLATES_LINK,
  type NavItem,
} from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import Anchor from "./anchor";

type DropdownItem = Pick<NavItem, "title" | "href" | "description" | "isNew">;

const SIMPLE_LINKS = [TEMPLATES_LINK, MCP_LINK];

export const NAVLINKS: {
  title: string;
  href: string;
  blankTarget?: boolean;
  isNew?: boolean;
}[] = [
  ...ADMIN_DASHBOARD_ITEMS.map((item) => ({
    ...item,
    title: `${item.title} Admin Dashboard`,
  })),
  ...CONTENT_ITEMS,
  TEMPLATES_LINK,
  MCP_LINK,
].map(({ title, href, isNew }) => ({ title, href, isNew }));

function NewBadge() {
  return (
    <Badge variant="outline" className="h-4 px-1.5 text-[10px] leading-none">
      New
    </Badge>
  );
}

const isSection = (href: string, pathname: string) =>
  !/^https?:\/\//.test(href) &&
  href.split("/")[1] === pathname.split("/")[1];

function SimpleLink({ item }: { item: { title: string; href: string } }) {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild>
        <Anchor
          className={navLinkClass}
          activeClassName={navLinkActiveClass}
          absolute
          href={item.href}
        >
          {item.title}
        </Anchor>
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
}

function NavDropdown({
  title,
  items,
  pathname,
  counts,
}: {
  title: string;
  items: DropdownItem[];
  pathname: string;
  counts?: Record<string, number>;
}) {
  const isActive = items.some((item) => isSection(item.href, pathname));

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger
        className={cn(
          "h-auto bg-transparent px-2.5 py-2 text-sm font-normal shadow-none hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent",
          isActive ? "text-foreground font-semibold" : "text-muted-foreground",
        )}
      >
        {title}
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <ul className="grid w-sm grid-cols-2 gap-1">
          {items.map((item) => (
            <li key={item.href}>
              <NavigationMenuLink asChild>
                <Link
                  href={item.href}
                  className={cn(
                    "hover:bg-accent flex flex-col items-start gap-0.5 rounded-md p-3 transition-colors",
                    isSection(item.href, pathname) && "bg-accent",
                  )}
                >
                  <p className="text-foreground flex items-center gap-1.5 text-sm leading-none font-medium">
                    {item.title}
                    {counts?.[item.href] !== undefined && (
                      <span className="text-muted-foreground font-normal tabular-nums">
                        {counts[item.href]}
                      </span>
                    )}
                    {item.isNew && <NewBadge />}
                  </p>
                  <p className="text-muted-foreground text-xs leading-snug">
                    {item.description}
                  </p>
                </Link>
              </NavigationMenuLink>
            </li>
          ))}
        </ul>
      </NavigationMenuContent>
    </NavigationMenuItem>
  );
}

const navLinkClass =
  "hover:text-foreground text-muted-foreground py-2 font-normal lg:p-2.5 text-sm transition-colors";
const navLinkActiveClass = "text-foreground font-semibold";

export function NavMenu({ isSheet = false }) {
  const pathname = usePathname();
  const counts = useContentCounts();
  const contentCounts: Record<string, number> = {
    "/components": counts.components.total,
    "/blocks": counts.blocks.total,
    "/examples": counts.examples.total,
  };

  if (isSheet) {
    return (
      <>
        {NAVLINKS.map((item) => (
          <SheetClose key={item.title + item.href} asChild>
            <Anchor
              className={navLinkClass}
              activeClassName={navLinkActiveClass}
              absolute
              blankTarget={item.blankTarget}
              href={item.href}
            >
              <span className="inline-flex items-center gap-1.5">
                {item.title}
                {item.isNew && <NewBadge />}
              </span>
            </Anchor>
          </SheetClose>
        ))}
      </>
    );
  }

  return (
    <NavigationMenu viewport={false}>
      <NavigationMenuList className="gap-0">
        <NavDropdown
          title="Admin Dashboards"
          items={ADMIN_DASHBOARD_ITEMS}
          pathname={pathname}
        />
        <NavDropdown
          title="Components & Blocks"
          items={CONTENT_ITEMS}
          pathname={pathname}
          counts={contentCounts}
        />
        <SimpleLink item={SIMPLE_LINKS[0]} />
        <SimpleLink item={SIMPLE_LINKS[1]} />
      </NavigationMenuList>
    </NavigationMenu>
  );
}
