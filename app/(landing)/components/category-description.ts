import { getGroupedComponentCategories } from "@/lib/data-contents";

export function getCategoryDescription(
  category: ReturnType<typeof getGroupedComponentCategories>[number],
) {
  const items = category.items ?? [];
  const count = items.reduce(
    (acc, item) =>
      acc + (Array.isArray(item.components) ? item.components.length : 0),
    0,
  );
  const topics = items
    .slice(0, 6)
    .map((item) => item.title.toLowerCase())
    .join(", ");
  const suffix = items.length > 6 ? " and more" : "";
  const title = `${category.title.charAt(0).toUpperCase()}${category.title.slice(1)}`;
  return `Browse ${count} ${title} components for shadcn/ui, including ${topics}${suffix}. Preview each component live, then copy and paste the code or install it with the shadcn CLI. Built with shadcn/ui, Tailwind CSS and React.`;
}
