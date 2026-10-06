import type { Metadata } from "next";

export function generateMeta({
  title,
  description,
}: {
  title?: string;
  description: string;
}): Metadata {
  return {
    title: title
      ? `${title} – Shadcn UI Kit`
      : "Shadcn UI Kit: Free shadcn/ui Components, Blocks & Examples",
    description,
  };
}
