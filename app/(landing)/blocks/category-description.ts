import { categories } from "./categories";

const allItems = categories.flatMap((c) => c.items ?? []);

export const categoriesWithAll = [
  { title: "All", href: "all", items: allItems },
  ...categories,
];

export function getCategoryDescription(
  category: (typeof categoriesWithAll)[number],
) {
  const items = category.items ?? [];
  if (items.length === 1 && items[0].description) {
    return items[0].description;
  }
  const count = items.reduce(
    (acc, item) =>
      acc + (Array.isArray(item.components) ? item.components.length : 0),
    0,
  );
  const topics = items
    .slice(0, 6)
    .map((item) => item.sidebarTitle.toLowerCase())
    .join(", ");
  const suffix = items.length > 6 ? " and more" : "";
  return `Browse ${count} ${category.title} blocks for shadcn/ui, including ${topics}${suffix}. Preview each block live, then copy and paste the code or install it with the shadcn CLI. Built with shadcn/ui, Tailwind CSS and React.`;
}
