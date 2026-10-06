import Link from "next/link";
import {
  ArrowRightIcon,
  BoxIcon,
  GiftIcon,
  LayersIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  PanelsTopLeftIcon,
} from "lucide-react";

import { SuggestedLink } from "./suggested-link";
import { contentCounts } from "@/lib/content-count";

const sections = [
  {
    title: "Blocks",
    description: `${contentCounts.blocks.total} marketing, dashboard and app blocks.`,
    href: "/blocks",
    icon: LayersIcon,
  },
  {
    title: "Components",
    description: `${contentCounts.components.total} shadcn/ui components ready to copy or install.`,
    href: "/components",
    icon: BoxIcon,
  },
  {
    title: "Admin Dashboards",
    description: `${contentCounts.dashboards} dashboard templates built with Next.js and shadcn/ui.`,
    href: "/admin-dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Templates",
    description: "Website and landing page templates for Next.js.",
    href: "/templates",
    icon: LayoutTemplateIcon,
  },
  {
    title: "Examples",
    description: `${contentCounts.examples.total} real world examples of charts, cards and forms.`,
    href: "/examples",
    icon: PanelsTopLeftIcon,
  },
  {
    title: "Free Templates",
    description: "Free Next.js templates you can download and use today.",
    href: "/free-templates",
    icon: GiftIcon,
  },
];

const popular = [
  { label: "Hero sections", href: "/blocks/marketing/hero-sections" },
  { label: "FAQs", href: "/blocks/marketing/faqs" },
  { label: "Stat cards", href: "/blocks/dashboard-ui/stat-cards" },
  { label: "Tables", href: "/blocks/dashboard-ui/tables" },
  { label: "Modal dialogs", href: "/blocks/dashboard-ui/modal-dialogs" },
  { label: "Sign in forms", href: "/blocks/dashboard-ui/sign-in-forms" },
  { label: "Newsletter", href: "/blocks/marketing/newsletter-sections" },
  { label: "Todo app", href: "/blocks/application-ui/todo-app" },
];

export function NotFoundContent() {
  return (
    <>
      <section>
        <div className="container border-x px-4 py-16 lg:px-12 lg:py-24">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 text-center">
            <span className="text-muted-foreground rounded-full border px-3 py-1 text-sm font-medium tabular-nums">
              404
            </span>
            <h1 className="font-heading text-3xl font-semibold text-balance md:text-5xl">
              We couldn&apos;t find that page
            </h1>
            <p className="text-muted-foreground text-balance md:text-lg">
              The link may be old or the page may have moved. Pick up from one
              of the sections below, or press{" "}
              <kbd className="bg-muted rounded border px-1.5 py-0.5 font-mono text-xs">
                ⌘K
              </kbd>{" "}
              to search everything.
            </p>
            <SuggestedLink />
          </div>
        </div>
      </section>

      <section>
        <div className="container border-x px-4 py-10 lg:px-12 lg:py-16">
          <h2 className="font-heading mb-6 text-xl font-semibold">
            Explore Shadcn UI Kit
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sections.map((section) => (
              <Link
                key={section.href}
                href={section.href}
                className="group hover:bg-muted/50 flex flex-col gap-3 rounded-xl border p-5 transition-colors"
              >
                <span className="bg-muted flex size-9 items-center justify-center rounded-lg border">
                  <section.icon className="size-4" />
                </span>
                <span className="space-y-1">
                  <span className="flex items-center gap-1 font-medium">
                    {section.title}
                    <ArrowRightIcon className="text-muted-foreground size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="text-muted-foreground block text-sm text-balance">
                    {section.description}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-muted-foreground mr-1 text-sm">
                Popular:
              </span>
              {popular.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="hover:bg-muted rounded-full border px-3 py-1 text-sm transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
