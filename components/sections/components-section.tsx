import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { categories as blocksCategories } from "@/app/(landing)/blocks/categories";
import { componentCategories } from "@/app/(landing)/components/component-categories";
import { categories as examplesCategories } from "@/app/(landing)/examples/categories";
import Link from "next/link";
import { Card, CardContent } from "../ui/card";
import { ComponentPlaceholder } from "./component-placeholder";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import {
  blocksCount,
  componentsCount,
  examplesCount,
} from "@/lib/content-count";
import BlockListItem from "../block-list-item";

export default function ComponentsSection() {
  const blockItems = blocksCategories.flatMap((c) => c.items).slice(0, 16);
  const componentItems = componentCategories.slice(0, 20);
  const exampleItems = examplesCategories.flatMap((c) => c.items).slice(0, 16);

  return (
    <section id="components-section">
      <div className="container border-x px-0">
        <header className="space-y-4 px-4 py-10 text-center lg:py-16">
          <h2 className="font-heading mx-auto max-w-3xl text-2xl font-semibold text-balance lg:text-4xl/tight">
            Hundreds of Production-Ready Blocks & Components
          </h2>
          <p className="text-muted-foreground mx-auto max-w-5xl leading-relaxed text-balance lg:text-lg">
            Discover {componentsCount.rounded + blocksCount.rounded + examplesCount.rounded}+ free shadcn/ui components, blocks, and
            real-world examples designed to accelerate your development
            workflow. Each component is easy to use, fully customizable, and
            built with clean, maintainable code. Download them via the shadcn
            registry or simply copy and paste directly into your project to
            start building instantly.
          </p>
        </header>
        <Tabs defaultValue="blocks" className="gap-0">
          <TabsList className="bg-background sticky top-14 z-20 h-auto! w-auto gap-0 rounded-none border-0 border-t border-b p-0 lg:top-26">
            <TabsTrigger
              value="blocks"
              className="data-[state=active]:bg-muted hover:bg-muted/30 data-[state=active]:text-foreground hover:text-foreground flex w-full flex-col gap-0 rounded-none border-0 bg-transparent p-4 data-[state=active]:shadow-none! lg:w-fit"
            >
              <span className="text-foreground text-xs font-medium lg:text-base">
                {blocksCount.total} Blocks
              </span>
              <span className="text-muted-foreground hidden text-sm lg:inline">
                Marketing, dashboard and application blocks
              </span>
            </TabsTrigger>
            <span aria-hidden="true" className="bg-border w-px self-stretch" />
            <TabsTrigger
              value="components"
              className="data-[state=active]:bg-muted hover:bg-muted/30 data-[state=active]:text-foreground hover:text-foreground flex w-full flex-col gap-0 rounded-none border-0 bg-transparent p-4 data-[state=active]:shadow-none! lg:w-fit"
            >
              <span className="text-foreground text-xs font-medium lg:text-base">
                {componentsCount.total} Free Components
              </span>
              <span className="text-muted-foreground hidden text-sm lg:inline">
                Extra shadcn/ui components
              </span>
            </TabsTrigger>
            <span aria-hidden="true" className="bg-border w-px self-stretch" />
            <TabsTrigger
              value="examples"
              className="data-[state=active]:bg-muted hover:bg-muted/30 data-[state=active]:text-foreground hover:text-foreground flex w-full flex-col gap-0 rounded-none border-0 bg-transparent p-4 data-[state=active]:shadow-none! lg:w-fit"
            >
              <span className="text-foreground text-xs font-medium lg:text-base">
                {examplesCount.total} Examples
              </span>
              <span className="text-muted-foreground hidden text-sm lg:inline">
                A curated collection of real-world examples
              </span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blocks" className="p-4 lg:p-6">
            <div className="grid grid-cols-1 gap-4 mask-b-from-85% mask-b-to-95% md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {blockItems.map((item, index) => (
                <BlockListItem
                  className={cn(index >= 8 && "max-md:hidden")}
                  isNew={(item as any).isNew ?? false}
                  href={item.href}
                  title={item.sidebarTitle}
                  longTitle={item.title}
                  countText={
                    item.components.length > 1
                      ? `${item.components.length} blocks`
                      : `${item.components.length} block`
                  }
                  key={item.href}
                />
              ))}
            </div>
            <div className="relative z-10 -mt-10 flex flex-col items-center justify-center gap-3 pb-10">
              <Button size="lg" asChild>
                <Link href="/blocks">
                  Browse all {blocksCount.total} blocks.
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="components" className="p-4 lg:p-6">
            <div className="grid grid-cols-1 gap-4 mask-b-from-85% mask-b-to-95% md:grid-cols-2 lg:grid-cols-5 lg:gap-6">
              {componentItems.map((item, index) => (
                <Link
                  href={item.href}
                  key={item.href}
                  className={cn("group", index >= 8 && "max-md:hidden")}
                >
                  <Card className="bg-muted group-hover:border-primary/20 shadow-none transition-colors">
                    <CardContent className="relative flex aspect-video items-center justify-center">
                      <ComponentPlaceholder href={item.href} />
                    </CardContent>
                  </Card>
                  <div className="flex flex-col justify-between pt-2">
                    <span className="font-medium">
                      {item.title || item.href}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {item.components.length} variants
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="relative z-10 -mt-10 flex flex-col items-center justify-center gap-3 pb-10">
              <Button size="lg" asChild>
                <Link href="/components">
                  Browse all {componentsCount.total} components.
                </Link>
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="examples" className="p-4 lg:p-6">
            <div className="grid grid-cols-1 gap-4 mask-b-from-85% mask-b-to-95% md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
              {exampleItems.map((item, index) => (
                <BlockListItem
                  className={cn(index >= 8 && "max-md:hidden")}
                  isNew={(item as any).isNew ?? false}
                  href={item.href}
                  title={item.sidebarTitle}
                  longTitle={item.title}
                  countText={
                    item.components.length > 1
                      ? `${item.components.length} examples`
                      : `${item.components.length} example`
                  }
                  key={item.href}
                />
              ))}
            </div>
            <div className="relative z-10 -mt-10 flex flex-col items-center justify-center gap-3 pb-10">
              <Button size="lg" asChild>
                <Link href="/examples">
                  Browse all {examplesCount.total} examples.
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
