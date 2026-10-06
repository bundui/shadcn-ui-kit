import { componentCategories } from "@/app/(landing)/components/component-categories";

export const categoryLabels: Record<string, string> = {
  base: "Base",
  feedback: "Feedback",
  forms: "Forms",
  "data-display": "Data Display",
  navigation: "Navigation",
  graph: "Graph",
};

export function getGroupedComponentCategories(
  options: {
    withoutAll?: boolean;
  } = { withoutAll: false },
) {
  const grouped = componentCategories.reduce(
    (acc, item) => {
      const category = item.category || "base";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    },
    {} as Record<string, typeof componentCategories>,
  );

  const categoryTabs = Object.entries(grouped).map(([category, items]) => ({
    title: categoryLabels[category] || category,
    href: category,
    items: items,
  }));

  if (options.withoutAll) {
    return categoryTabs;
  }

  return [
    {
      title: "All",
      href: "all",
      items: componentCategories,
    },
    ...categoryTabs,
  ];
}

export function isComponentGroup(slug: string) {
  return getGroupedComponentCategories({ withoutAll: true }).some(
    (group) => group.href === slug,
  );
}
