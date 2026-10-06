import { cn } from "@/lib/utils";

type ComponentIframeProps = {
  categoryData: {
    href: string;
    columns?: number;
  };
  compData: {
    key: string;
  };
};

export default async function ComponentIframe({ categoryData, compData }: ComponentIframeProps) {
  const [page, category] = categoryData.href.split("/").filter(Boolean);
  const { default: Component } = await import(
    `@/contents/${page}/${category}/${compData.key}/index.tsx`
  );

  return (
    <div className={cn("flex w-full items-center justify-center py-8")}>
      <Component />
    </div>
  );
}
