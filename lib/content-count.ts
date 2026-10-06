import { componentCategories } from "../app/(landing)/components/component-categories";
import { categories as blockCategories } from "../app/(landing)/blocks/categories";
import { categories as exampleCategories } from "../app/(landing)/examples/categories";
import { products } from "./products";
import { dashboardData } from "@/components/sections/dashboard-data";
import { ProductTypeEnum } from "@/lib/products";

export const templatesCount = {
  free: products.filter(
    (e) =>
      e.type.key === ProductTypeEnum.Template &&
      e.price === "0" &&
      e.inTemplates,
  ).length,
  pro: products.filter(
    (e) =>
      e.type.key === ProductTypeEnum.Template &&
      e.price !== "0" &&
      e.inTemplates,
  ).length,
};

const roundDown = (num: number) => {
  if (num < 100) return Math.floor(num / 10) * 10;
  return Math.floor(num / 10) * 10;
};

export const blocksCount = blockCategories.reduce<{
  free: number;
  pro: number;
  total: number;
  rounded: number;
}>(
  (acc, category) => {
    if (!Array.isArray(category.items)) return acc;
    for (const item of category.items) {
      if (!Array.isArray(item.components)) continue;
      for (const comp of item.components) {
        if (comp.isPro) acc.pro += 1;
        else acc.free += 1;
        acc.total += 1;
      }
    }
    acc.rounded = roundDown(acc.total);
    return acc;
  },
  { free: 0, pro: 0, total: 0, rounded: 0 },
);

export const componentsCount = (() => {
  const total = componentCategories.reduce((acc, item) => {
    if (Array.isArray(item.components)) {
      acc += item.components.length;
    }
    return acc;
  }, 0);

  const pro = componentCategories.reduce((acc, item) => {
    if (Array.isArray(item.components)) {
      acc += item.components.filter(
        (component) => (component as { isPro?: boolean }).isPro,
      ).length;
    }
    return acc;
  }, 0);

  return {
    total,
    rounded: roundDown(total),
    free: total - pro,
    pro,
    categories: componentCategories.length,
  };
})();

export const examplesCount = exampleCategories.reduce<{
  free: number;
  pro: number;
  total: number;
  rounded: number;
}>(
  (acc, category) => {
    if (!Array.isArray(category.items)) return acc;
    for (const item of category.items) {
      if (!Array.isArray(item.components)) continue;
      for (const comp of item.components) {
        if (comp.isPro) acc.pro += 1;
        else acc.free += 1;
        acc.total += 1;
      }
    }
    acc.rounded = roundDown(acc.total);
    return acc;
  },
  { free: 0, pro: 0, total: 0, rounded: 0 },
);

export const contentCounts = {
  blocks: blocksCount,
  components: componentsCount,
  examples: examplesCount,
  templates: templatesCount,
  dashboards: dashboardData.dashboards.length,
  apps: dashboardData.apps.length + dashboardData.aiApps.length,
};

export type ContentCounts = typeof contentCounts;
