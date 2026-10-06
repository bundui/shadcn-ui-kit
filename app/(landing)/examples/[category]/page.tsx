import { Metadata } from "next";
import { notFound } from "next/navigation";
import ExamplesContent from "../examples-content";
import { generateMeta } from "@/lib/metadata";
import { categories } from "../categories";
import { getCategoryDescription } from "../category-description";

const getCategorySlug = (href: string) => href.replace("/examples/", "");

const findCategory = (slug: string) =>
  categories.find((cat) => getCategorySlug(cat.href) === slug);

export function generateStaticParams() {
  return categories.map((cat) => ({ category: getCategorySlug(cat.href) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const currentCategory = findCategory(category);

  if (!currentCategory) {
    notFound();
  }

  return generateMeta({
    title: `Shadcn ${currentCategory.title} Examples`,
    description: getCategoryDescription(currentCategory),
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;

  if (!findCategory(category)) {
    notFound();
  }

  return (
    <>
      <ExamplesContent category={category} />
    </>
  );
}
