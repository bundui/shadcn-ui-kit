import { generateMeta } from "@/lib/metadata";
import { componentCategories } from "../component-categories";
import ComponentIframe from "./components/component-iframe";
import CodeDialog from "./components/code-dialog";
import RelatedBlocks from "./components/related-blocks";
import ComponentsMobileSidebar from "./components/mobile-sidebar";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  LockIcon,
  HomeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";
import ComponentsContent from "../components-content";
import { getCategoryDescription } from "../category-description";
import {
  getGroupedComponentCategories,
  isComponentGroup,
} from "@/lib/data-contents";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const url = `/components/${slug.join("/")}`;

  if (slug.length === 1 && isComponentGroup(slug[0])) {
    const group = getGroupedComponentCategories({ withoutAll: true }).find(
      (g) => g.href === slug[0],
    )!;
    return generateMeta({
      title: `Shadcn ${group.title.charAt(0).toUpperCase()}${group.title.slice(1)} Components`,
      description: getCategoryDescription(group),
    });
  }

  const category = componentCategories.find((c) => c.href === url);

  const variantCount = category?.components?.length ?? 0;
  const allFree = !category?.components?.some(
    (component: { isPro?: boolean }) => component.isPro,
  );
  const title = category
    ? `Shadcn ${category.title}: ${variantCount} ${allFree ? "Free " : ""}React ${variantCount === 1 ? "Component" : "Components"}`
    : "Shadcn Components";
  const description = category
    ? `${category.description ? `${category.description} ` : ""}Browse our collection of ${category.components?.length ?? 0} Shadcn ${category.title} variants.`
    : "Browse 500+ Shadcn UI Blocks & Sections. Copy and paste instantly or install via the shadcn CLI.";

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

  const url = `/components/${slug.join("/")}`;

  if (slug.length === 1 && isComponentGroup(slug[0])) {
    return (
      <>
        <ComponentsContent category={slug[0]} />
      </>
    );
  }

  const category = componentCategories.find((c) => c.href === url);

  if (!category) {
    notFound();
  }

  const grouped = componentCategories.reduce(
    (acc, item) => {
      const categoryType = item.category || "base";
      if (!acc[categoryType]) {
        acc[categoryType] = [];
      }
      acc[categoryType].push(item);
      return acc;
    },
    {} as Record<string, typeof componentCategories>,
  );

  const categoryFirstIndex = new Map<string, number>();
  componentCategories.forEach((item, index) => {
    const categoryType = item.category || "base";
    if (!categoryFirstIndex.has(categoryType)) {
      categoryFirstIndex.set(categoryType, index);
    }
  });

  const sortedCategoryEntries = Object.entries(grouped).sort(
    ([catA], [catB]) => {
      const indexA = categoryFirstIndex.get(catA) ?? Infinity;
      const indexB = categoryFirstIndex.get(catB) ?? Infinity;
      return indexA - indexB;
    },
  );

  const orderedCategories = sortedCategoryEntries.flatMap(([, items]) => items);

  const currentIndex = orderedCategories.findIndex((c) => c.href === url);
  const previousCategory =
    currentIndex > 0 ? orderedCategories[currentIndex - 1] : null;
  const nextCategory =
    currentIndex < orderedCategories.length - 1
      ? orderedCategories[currentIndex + 1]
      : null;

  return (
    <div className="space-y-4">
      <div className="mb-10 flex justify-between px-4 lg:px-6">
        <header className="max-w-5xl space-y-3">
          <Breadcrumb className="lg:mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">
                  <HomeIcon className="size-3.5" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/components">Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>{category?.title}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="font-heading text-3xl font-semibold lg:text-4xl">
            Shadcn {category?.title} Components
          </h1>
          <p className="text-muted-foreground leading-relaxed text-balance">
            {category?.description} Browse our collection of{" "}
            <b>
              {category?.components?.length} Shadcn {category?.title}
            </b>{" "}
            variants.
          </p>
        </header>
        <ComponentsMobileSidebar />
      </div>
      <div
        className={cn("grid divide-y border-y", {
          "md:grid-cols-2 lg:grid-cols-3 [&>*:not(:nth-child(3n))]:border-e":
            !category?.columns,
          "lg:grid-cols-2 [&>*:not(:nth-child(2n))]:border-e":
            category?.columns && category?.columns === 2,
          "grid-cols-1": category?.columns && category?.columns === 1,
        })}
      >
        {category?.components
          ?.sort((a: any, b: any) => a.order - b.order)
          .map((component: any) => {
            const [page, categoryName, componentKey] = component.href
              .split("/")
              .filter(Boolean);
            const filePath = `${page}/${categoryName}/${componentKey}`;

            return (
              <div
                key={componentKey}
                className={cn(
                  "group relative flex flex-col items-center justify-center p-4 lg:min-h-56 lg:p-8",
                  {
                    "lg:col-span-2": component?.span && component?.span === 2,
                    "lg:row-span-2": component?.row && component?.row === 2,
                  },
                )}
              >
                <div className="absolute inset-x-0 top-0 mb-4 flex items-start justify-between p-3 transition-opacity">
                  <div className="opacity-0 transition-opacity group-hover:opacity-100">
                    <CodeDialog filePath={filePath} comp={component} />
                  </div>
                  <p className="text-muted-foreground/50 group-hover:text-muted-foreground text-xs transition-colors">
                    {component.title}
                  </p>
                </div>
                <ComponentIframe
                  categoryData={category}
                  compData={{ key: componentKey }}
                />
              </div>
            );
          })}
      </div>

      {(previousCategory || nextCategory) && (
        <div className="grid grid-cols-1 gap-3 px-4 pt-4 md:grid-cols-2 lg:px-6">
          {previousCategory ? (
            <Button
              asChild
              variant="outline"
              className="group hover:bg-accent h-auto w-full flex-row items-center justify-start gap-4 p-4 text-left"
            >
              <Link
                href={previousCategory.href}
                className="flex w-full items-center"
              >
                <span className="bg-background flex size-9 items-center justify-center rounded-full border">
                  <ArrowLeft className="size-4 shrink-0" />
                </span>
                <div className="flex flex-col items-start gap-0.5">
                  <span className="text-muted-foreground text-xs">
                    Previous
                  </span>
                  <span className="font-semibold">
                    {previousCategory.title}
                  </span>
                </div>
              </Link>
            </Button>
          ) : (
            <div />
          )}

          {nextCategory ? (
            <Button
              asChild
              variant="outline"
              className="group hover:bg-accent h-auto w-full flex-row items-center justify-end gap-4 p-4 text-left md:ml-auto"
            >
              <Link
                href={nextCategory.href}
                className="flex w-full items-center justify-end"
              >
                <div className="flex flex-col items-end gap-0.5">
                  <span className="text-muted-foreground text-xs">Next</span>
                  <span className="font-semibold">{nextCategory.title}</span>
                </div>
                <span className="bg-background flex size-9 items-center justify-center rounded-full border">
                  <ArrowRight className="size-4 shrink-0" />
                </span>
              </Link>
            </Button>
          ) : null}
        </div>
      )}

      <div className="space-y-10 px-4 lg:px-6">
        <Card className="from-background mt-4 bg-linear-to-r to-pink-100 shadow-none lg:mt-8 lg:pb-0 dark:to-pink-950">
          <CardHeader className="block lg:grid">
            <CardTitle>
              <h5 className="flex items-center gap-3 text-lg font-semibold lg:text-2xl">
                <LockIcon className="size-5 opacity-50" /> Unlock premium
                components
              </h5>
            </CardTitle>
            <CardDescription className="text-base">
              Get full control of shadcn/ui components, blocks and instances,
              including future additions.
            </CardDescription>
            <CardAction className="hidden lg:flex">
              <Button asChild>
                <Link href="https://shadcnuikit.com/pricing">
                  Unlock Now <ChevronRight />
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="block lg:hidden">
              <Button className="w-full lg:w-auto" size="lg" asChild>
                <Link href="https://shadcnuikit.com/pricing">
                  Unlock Now <ChevronRight />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <RelatedBlocks />
      </div>
    </div>
  );
}
