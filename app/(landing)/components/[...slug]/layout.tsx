import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";
import ComponentsSidebar from "./components/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { isComponentGroup } from "@/lib/data-contents";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  if (slug.length === 1 && isComponentGroup(slug[0])) {
    return <>{children}</>;
  }

  if (slug[0] === "blog") {
    return (
      <div className="prose prose-headings:mt-8 prose-headings:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-h1:text-5xl prose-h1:font-semibold prose-h2:text-3xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg w-full max-w-full border-x">
        <div className="mx-auto max-w-3xl lg:py-14">{children}</div>
      </div>
    );
  }

  return (
    <SidebarProvider className="xl:items-start xl:ps-4">
      <div className="flex w-full flex-col items-start xl:flex-row">
        <div className="-mt-2 hidden h-[calc(100dvh-(--spacing(30)))] xl:sticky xl:top-28 xl:block">
          <ScrollArea className="h-full w-full border-r">
            <ComponentsSidebar />
          </ScrollArea>
        </div>

        <div
          className={cn("mx-auto w-full px-0", {
            "max-w-full": slug[0] === "blocks",
            "max-w-5xl": slug[0] === "components",
          })}
        >
          <div className="w-full min-w-0 grow py-8">{children}</div>
        </div>
      </div>
    </SidebarProvider>
  );
}
