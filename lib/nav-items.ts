import {
  ComponentIcon,
  CrownIcon,
  LayoutDashboardIcon,
  LayoutGridIcon,
  PanelsTopLeftIcon,
  PlugIcon,
  ShapesIcon,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
  isNew?: boolean;
};

export const ADMIN_DASHBOARD_ITEMS: NavItem[] = [
  {
    title: "Premium",
    href: "/admin-dashboard",
    description: "Production-ready admin dashboard templates.",
    icon: CrownIcon,
  },
  {
    title: "Free",
    href: "/admin",
    description: "Free admin dashboard with users, settings and auth pages.",
    icon: LayoutDashboardIcon,
  },
];

export const TEMPLATES_LINK: NavItem = {
  title: "Templates",
  href: "/templates",
  description: "Website and app templates built with Next.js.",
  icon: PanelsTopLeftIcon,
};

export const CONTENT_ITEMS: NavItem[] = [
  {
    title: "Components",
    href: "/components",
    description: "Hundreds of shadcn/ui component variants.",
    icon: ComponentIcon,
  },
  {
    title: "Blocks",
    href: "/blocks",
    description: "Full-page sections: hero, pricing, features and more.",
    icon: LayoutGridIcon,
  },
  {
    title: "Examples",
    href: "/examples",
    description: "Cards, charts and standalone UI examples.",
    icon: ShapesIcon,
  },
];

export const MCP_LINK: NavItem = {
  title: "MCP Server",
  href: "https://shadcnuikit.com/mcp",
  description: "Use the kit from Claude Code, Cursor and other AI editors.",
  icon: PlugIcon,
};
