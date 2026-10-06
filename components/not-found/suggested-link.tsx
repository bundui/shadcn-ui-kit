"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

const sections: Record<string, { label: string; href: string }> = {
  blocks: { label: "Browse all blocks", href: "/blocks" },
  components: { label: "Browse all components", href: "/components" },
  examples: { label: "Browse all examples", href: "/examples" },
  templates: { label: "Browse all templates", href: "/templates" },
  template: { label: "Browse all templates", href: "/templates" },
  "admin-dashboard": { label: "See admin dashboards", href: "/admin-dashboard" },
  dashboard: { label: "See admin dashboards", href: "/admin-dashboard" },
};

export function SuggestedLink() {
  const pathname = usePathname();
  const segment = pathname?.split("/").filter(Boolean)[0] ?? "";
  const section = sections[segment];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {section && (
        <Button asChild>
          <Link href={section.href}>
            {section.label}
            <ArrowRightIcon />
          </Link>
        </Button>
      )}
      <Button variant={section ? "outline" : "default"} asChild>
        <Link href="/">Back to homepage</Link>
      </Button>
    </div>
  );
}
