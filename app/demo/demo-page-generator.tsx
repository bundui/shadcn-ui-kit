"use client";

import { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BlocksIcon,
  ComponentIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  Loader2,
  MenuIcon,
  PanelsTopLeftIcon,
  PlugIcon,
  TagIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const libraryLinks = [
  { href: "/components", label: "Components", icon: ComponentIcon },
  { href: "/blocks", label: "Blocks", icon: BlocksIcon },
  { href: "/examples", label: "Examples", icon: PanelsTopLeftIcon },
];

const moreLinks = [
  {
    href: "/admin-dashboard",
    label: "Admin Dashboards",
    icon: LayoutDashboardIcon,
  },
  { href: "/templates", label: "Templates", icon: LayoutTemplateIcon },
  { href: "https://shadcnuikit.com/mcp", label: "MCP Server", icon: PlugIcon },
  { href: "https://shadcnuikit.com/pricing", label: "Pricing", icon: TagIcon },
];

const GOOGLE_FONTS = new Set([
  "Inter",
  "Roboto",
  "Poppins",
  "Nunito",
  "DM Sans",
]);

function applyFontFamily(fontFamily: string, root: HTMLElement) {
  let cssValue: string;

  if (fontFamily === "sans") {
    cssValue = "ui-sans-serif, system-ui, sans-serif";
  } else if (fontFamily === "serif") {
    cssValue = "ui-serif, Georgia, Cambria, serif";
  } else if (fontFamily === "mono") {
    cssValue = "ui-monospace, 'Courier New', monospace";
  } else if (GOOGLE_FONTS.has(fontFamily)) {
    const id = `gfont-${fontFamily.replace(/\s+/g, "-")}`;
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily)}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
    cssValue = `'${fontFamily}', sans-serif`;
  } else {
    cssValue = `'${fontFamily}', sans-serif`;
  }

  root.style.fontFamily = cssValue;
}

export default function DemoPageGenerator() {
  const [isInIframe, setIsInIframe] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const path = params.get("path");
    const iframeId = path ? path.split("/").filter(Boolean).at(-1) : null;

    const sendHeight = () => {
      const height = document.body.scrollHeight;
      window.parent.postMessage({ type: "setHeight", height, iframeId }, "*");
    };

    sendHeight();
    const interval = setInterval(sendHeight, 300);
    setTimeout(() => clearInterval(interval), 2000);

    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isInIframe ? "" : "hidden";
  }, [isInIframe]);

  useEffect(() => {
    document.body.classList.toggle(
      "bg-muted",
      searchParams.get("isBgMuted") === "true",
    );
  }, [searchParams]);

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      const data = e.data;
      if (!data?.type) return;
      const root = document.documentElement;

      if (data.type === "theme") {
        root.classList.toggle("dark", data.value === "dark");
      } else if (data.type === "theme-colors") {
        Object.entries(data.colors as Record<string, string>).forEach(
          ([key, value]) => root.style.setProperty(key, value),
        );
      } else if (data.type === "theme-typography") {
        const t = data.typography as Record<string, string>;
        if (t.fontFamily) applyFontFamily(t.fontFamily, root);
        if (t.fontSizeBase) root.style.fontSize = t.fontSizeBase;
        if (t.lineHeight) root.style.lineHeight = t.lineHeight;
        if (t.fontWeightNormal)
          root.style.setProperty("--font-weight-normal", t.fontWeightNormal);
        if (t.fontWeightBold)
          root.style.setProperty("--font-weight-bold", t.fontWeightBold);
      } else if (data.type === "theme-spacing") {
        const s = data.spacing as Record<string, string>;
        if (s.baseSpacingUnit)
          root.style.setProperty("--spacing", s.baseSpacingUnit);
      } else if (data.type === "theme-others") {
        const o = data.others as Record<string, string>;
        if (o.radius) root.style.setProperty("--radius", o.radius);
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  useEffect(() => {
    setIsInIframe(window.top === window.self);
  }, []);

  const pathParams = searchParams.get("path");

  if (!pathParams) return null;

  const parts = pathParams.split("/").filter(Boolean);
  const compKey = parts.at(-1);

  let Component;
  if (parts.length === 4) {
    const [page, category, component] = parts;
    Component = dynamic(
      () => import(`@/contents/${page}/${category}/${component}/${compKey}`),
      {
        ssr: true,
      },
    );
  } else if (parts.length === 3) {
    const [page, category] = parts;
    Component = dynamic(
      () => import(`@/contents/${page}/${category}/${compKey}`),
      {
        ssr: true,
      },
    );
  }

  const responsive = searchParams.get("responsive") === "true";
  const isBgMuted = searchParams.get("isBgMuted") === "true";

  return (
    <div
      className={cn("items-center justify-center", {
        "md:flex": responsive,
        flex: !responsive,
        "px-4 py-8": pathParams.includes("examples/") && isInIframe,
      })}
    >
      {" "}
      {isInIframe && (
        <div className="fixed right-0 bottom-0 z-50 p-4 lg:p-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon-lg" aria-label="Browse Shadcn UI Kit">
                <MenuIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              align="end"
              className="bg-popover w-52"
            >
              {[
                { label: "Library", links: libraryLinks },
                { label: "More", links: moreLinks },
              ].map((group, index) => (
                <DropdownMenuGroup key={group.label}>
                  {index > 0 && <DropdownMenuSeparator />}
                  <DropdownMenuLabel className="text-muted-foreground text-xs">
                    {group.label}
                  </DropdownMenuLabel>
                  {group.links.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} target="_blank">
                        <link.icon />
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div
        className={cn("flex w-full justify-center", {
          "px-4 py-8":
            (pathParams.includes("components/") ||
              pathParams.includes("examples/")) &&
            !isBgMuted,
          "p-6": isBgMuted,
        })}
        style={
          searchParams.get("height")
            ? { height: Number(searchParams.get("height")) }
            : undefined
        }
      >
        <Suspense
          fallback={
            <div>
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          }
        >
          {Component ? <Component /> : <div>Component not found</div>}
        </Suspense>
      </div>
    </div>
  );
}
