"use client";

import { categories } from "./categories";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { blocksCount } from "@/lib/content-count";
import BlockListItem from "@/components/block-list-item";
import {
  categoriesWithAll,
  getCategoryDescription,
} from "./category-description";

export default function BlocksContent({ category }: { category?: string }) {
  const router = useRouter();

  const getCategorySlug = (href: string) => {
    return href.replace("/blocks/", "");
  };

  const currentCategorySlug = category || "all";

  const handleTabChange = (value: string) => {
    router.push(value === "all" ? "/blocks" : value);
  };

  const currentCategoryHref =
    currentCategorySlug === "all"
      ? "all"
      : (categories.find(
          (cat) => getCategorySlug(cat.href) === currentCategorySlug,
        )?.href ??
        categories[0]?.href ??
        "");

  const selectedCategory = categoriesWithAll.find(
    (cat) => cat.href === currentCategoryHref,
  );

  return (
    <section>
      <div className="relative container space-y-8 border-x py-6 lg:space-y-14 lg:py-10">
        <header className="space-y-3 text-balance lg:max-w-4xl">
          <h1 className="font-heading text-3xl font-semibold lg:text-4xl">
            {selectedCategory?.title === "All"
              ? `${blocksCount.rounded}+ Shadcn UI Blocks & Sections`
              : `Shadcn ${selectedCategory?.title ?? "All"} Blocks`}
          </h1>
          <p className="text-muted-foreground leading-relaxed text-balance">
            {selectedCategory && selectedCategory.title !== "All"
              ? getCategoryDescription(selectedCategory)
              : `A library of ${blocksCount.total} free shadcn/ui blocks and page sections: hero sections, newsletter forms, FAQs, sign in forms, stat cards, modal dialogs, tables and application screens. Preview any block live, then copy the code or install it in seconds with the shadcn CLI. Built with shadcn/ui, Tailwind CSS and React.`}
          </p>
        </header>

        <Tabs
          value={currentCategoryHref}
          onValueChange={handleTabChange}
          className="w-full gap-6 lg:gap-8"
        >
          <Select value={currentCategoryHref} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full sm:hidden">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categoriesWithAll.map((category) => (
                <SelectItem key={category.href} value={category.href}>
                  {category.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TabsList className="h-auto! max-sm:hidden">
            {categoriesWithAll.map((category) => (
              <TabsTrigger
                className="px-5 py-3"
                key={category.href}
                value={category.href}
              >
                {category.title}
              </TabsTrigger>
            ))}
          </TabsList>
          {categoriesWithAll.map((category) => (
            <TabsContent key={category.href} value={category.href}>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                {category.items?.map((item) => (
                  <BlockListItem
                    href={item.href}
                    title={item.sidebarTitle}
                    longTitle={item.title}
                    isNew={(item as any).isNew ?? false}
                    newCount={
                      item.components.filter(
                        (component) => "isNew" in component && component.isNew,
                      ).length
                    }
                    countText={
                      item.components.length > 1
                        ? `${item.components.length} blocks`
                        : `${item.components.length} block`
                    }
                    key={item.href}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
