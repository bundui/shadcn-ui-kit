"use client";

import Link from "next/link";
import { componentPlaceholders } from "./component-placeholders";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { componentsCount } from "@/lib/content-count";
import { getGroupedComponentCategories } from "@/lib/data-contents";
import { getCategoryDescription } from "./category-description";

export default function ComponentsContent({ category }: { category?: string }) {
  const router = useRouter();
  const currentCategory = category || "all";
  const selectedCategory = getGroupedComponentCategories().find(
    (cat) => cat.href === currentCategory,
  );

  const getGroupHref = (value: string) =>
    value === "all" ? "/components" : `/components/${value}`;

  const handleTabChange = (value: string) => {
    router.push(getGroupHref(value));
  };

  return (
    <section>
      <div className="relative container space-y-8 border-x py-6 lg:space-y-14 lg:py-10">
        <header className="space-y-3 text-balance lg:max-w-4xl">
          <h1 className="font-heading text-3xl font-semibold lg:text-4xl">
            {selectedCategory?.title === "All"
              ? `${componentsCount.rounded}+ Free Shadcn UI Components`
              : `Shadcn ${selectedCategory?.title.charAt(0).toUpperCase()}${selectedCategory?.title.slice(1)} Components`}
          </h1>
          <p className="text-muted-foreground max-w-4xl leading-relaxed text-balance">
            {selectedCategory && selectedCategory.title !== "All"
              ? getCategoryDescription(selectedCategory)
              : `Browse ${componentsCount.total} free shadcn/ui component variants covering base elements, forms, data display, navigation, feedback and charts. Preview every component live, then copy and paste the code or install it with the shadcn CLI. Built with shadcn/ui, Tailwind CSS and React.`}
          </p>
        </header>

        <Tabs value={currentCategory} className="w-full gap-6 lg:gap-8"
        >
          <Select value={currentCategory} onValueChange={handleTabChange}>
            <SelectTrigger className="w-full sm:hidden">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {getGroupedComponentCategories().map((category) => (
                <SelectItem key={category.href} value={category.href}>
                  {category.title.charAt(0).toUpperCase() +
                    category.title.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <TabsList className="h-auto! max-sm:hidden">
            {getGroupedComponentCategories().map((category) => {
              return (
                <TabsTrigger
                  className="px-5 py-3"
                  key={category.href}
                  value={category.href}
                  asChild
                >
                  <Link href={getGroupHref(category.href)}>
                    {category.title.charAt(0).toUpperCase() +
                      category.title.slice(1)}
                  </Link>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {getGroupedComponentCategories().map((category) => (
            <TabsContent key={category.href} value={category.href}>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6 xl:grid-cols-5">
                {category.items?.map((item) => {
                  const { isNew, newCount } = item as {
                    isNew?: boolean;
                    newCount?: number;
                  };
                  const badge = isNew ? "New" : newCount ? `+${newCount}` : null;

                  return (
                    <Link
                      href={item.href}
                      key={item.href}
                      className="space-y-2 hover:opacity-70"
                    >
                      <Card className="bg-muted shadow-none">
                        <CardContent className="relative flex aspect-video items-center justify-center">
                          {
                            componentPlaceholders.find((p) =>
                              item.href
                                .split("/")
                                .some((segment) => segment === p.name),
                            )?.placeholder
                          }
                        </CardContent>
                      </Card>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-sans font-medium">{item.title}</h4>
                          {badge && (
                            <span className="text-xs font-medium text-green-600">
                              {badge}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground text-xs">
                          {item.components.length} variants
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}
