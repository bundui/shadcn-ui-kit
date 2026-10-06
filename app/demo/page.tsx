import DemoPageGenerator from "@/app/demo/demo-page-generator";
import { Suspense } from "react";
import type { Metadata } from "next";
import { componentCategories } from "@/app/(landing)/components/component-categories";
import { categories as blocksCategories } from "@/app/(landing)/blocks/categories";
import { categories as examplesCategories } from "@/app/(landing)/examples/categories";
import { generateMeta } from "@/lib/metadata";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

function findDemoItem(path: string) {
  const segments = path.split("/").filter(Boolean);
  const normalizedPath = "/" + segments.slice(0, -1).join("/");

  if (path.includes("components")) {
    return componentCategories.find((cat) => cat.href === normalizedPath)
      ?.title;
  }
  if (path.includes("blocks")) {
    return blocksCategories
      .flatMap((cat) => cat.items)
      .flatMap((item) => item.components)
      .find((item) => item.href === path)?.title;
  }
  if (path.includes("examples")) {
    return examplesCategories
      .flatMap((cat) => cat.items)
      .flatMap((item) => item.components)
      .find((item) => item.href === path)?.title;
  }
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const params = await searchParams;
  const title = findDemoItem(params.path as string);

  return generateMeta({
    title: `Shadcn ${title}`,
    description: `Live preview of the ${title ?? "component"} from Shadcn UI Kit. Explore the demo in full screen, then copy and paste it or install it via the shadcn CLI.`,
  });
}

export default async function Page() {
  return (
    <Suspense>
      <DemoPageGenerator />
    </Suspense>
  );
}
