import { Metadata } from "next";
import { generateMeta } from "@/lib/metadata";
import { notFound } from "next/navigation";
import { categories } from "../categories";
import ComponentIframe from "./components/component-iframe";
import CodeDialog from "./components/code-dialog";
import ComponentsMobileSidebar from "./components/mobile-sidebar";
import PaginationButtons from "./components/pagination-buttons";
import { HomeIcon } from "lucide-react";
import ViewportToolbar from "@/components/viewport-toolbar";
import { BrowserFrame } from "@/components/preview/browser-frame";
import { FullscreenLink } from "@/components/preview/fullscreen-link";
import IframeDarkToggle from "./components/iframe-dark-toggle";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const url = `/examples/${slug.join("/")}`;
  const category = categories
    .flatMap((c) => c.items)
    .find((c) => c.href === url);

  if (!category) {
    notFound();
  }

  const title = category.title;
  const description = `${category.description || `Browse ${category.title.toLowerCase()} examples from Shadcn UI. More than ${category.components?.length || 0} example variants. The ${category.title.toLowerCase()} examples are compatible with Shadcn UI, which was built with Tailwind CSS and React. Copy and paste instantly or install via the shadcn CLI.`}`;

  return generateMeta({
    title,
    description,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  const url = `/examples/${slug.join("/")}`;
  const urlExploded = url.split("/").filter(Boolean);

  const category = categories
    .flatMap((c) => c.items)
    .find((c) => c.href === url);

  if (!category) {
    notFound();
  }

  const components = categories
    .flatMap((c) => c.items)
    .find((c) => c.href === url)?.components;

  const allItems = categories.flatMap((c) => c.items);
  const currentIndex = allItems.findIndex((item) => item.href === url);
  const previousItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem =
    currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  return (
    <div className="space-y-4">
      <div className="mb-10 flex justify-between">
        <header className="max-w-4xl space-y-3">
          <Breadcrumb className="lg:mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <HomeIcon className="size-3.5" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/examples">Examples</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{category?.sidebarTitle}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-heading font-semibold text-3xl lg:text-4xl">
            {category?.title}
          </h1>
          <p className="text-muted-foreground leading-relaxed text-balance">
            {category?.description}
          </p>
        </header>
        <div className="flex shrink-0 items-start gap-2">
          <ComponentsMobileSidebar />
        </div>
      </div>
      {components?.map((component, index) => {
        const urlParams = new URLSearchParams();
        const compKey = component.href.split("/").pop() || "";
        const viewportKey = `${slug.join("-")}-${compKey}`;
        urlParams.set("path", component.href);

        if ("height" in component && component.height) {
          urlParams.set("height", String(component.height));
        }
        if ("responsive" in component && component.responsive) {
          urlParams.set("responsive", String(component.responsive));
        }
        if ("isBgMuted" in component && component.isBgMuted) {
          urlParams.set("isBgMuted", "true");
        }

        const iframeUrl = `/demo?${urlParams.toString()}`;

        return (
          <div key={compKey}>
            <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <h2 className="font-heading flex items-center gap-3 text-xl font-semibold">
                {component.title}{" "}
                {component.isPro ? (
                  <Badge
                    variant="outline"
                    className="border-amber-300 bg-amber-50 text-[10px] tracking-widest text-amber-600 uppercase dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400"
                  >
                    Pro
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="border-green-300 bg-green-50 text-[10px] tracking-widest text-green-600 uppercase dark:border-green-800 dark:bg-green-950 dark:text-green-400"
                  >
                    Free
                  </Badge>
                )}
              </h2>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                <ViewportToolbar componentId={viewportKey} />
                <IframeDarkToggle viewportKey={viewportKey} />
                <FullscreenLink href={iframeUrl} />
                <CodeDialog
                  filePath={`${urlExploded[0]}/${urlExploded[1]}/${urlExploded[2]}/${compKey}`}
                  comp={component}
                />
              </div>
            </div>
            <BrowserFrame>
              <ComponentIframe
                id={index + 1}
                url={iframeUrl}
                viewportKey={viewportKey}
              />
            </BrowserFrame>
          </div>
        );
      })}

      <PaginationButtons previousItem={previousItem} nextItem={nextItem} />    </div>
  );
}
