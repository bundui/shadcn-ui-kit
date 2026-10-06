"use client";

import { cn } from "@/lib/utils";
import { useIsFullContentPage } from "@/components/site-data-provider";

export function FooterTop({ children }: { children: React.ReactNode }) {
  const isFullContentPage = useIsFullContentPage();

  return (
    <div
      className={cn("relative py-8 lg:py-10", {
        "container border-x": !isFullContentPage,
        "px-4": isFullContentPage,
      })}
    >
      {!isFullContentPage && (
        <div className="pointer-events-none absolute top-0 right-0 left-0 hidden items-center justify-between xl:flex">
          <span className="bg-muted border-background block size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-3"></span>
          <span className="bg-muted border-background block size-3 translate-x-1/2 -translate-y-1/2 rounded-full border-3"></span>
        </div>
      )}
      {children}
    </div>
  );
}

export function FooterLinks({ children }: { children: React.ReactNode }) {
  const isFullContentPage = useIsFullContentPage();

  return (
    <div
      className={cn(
        "container grid space-y-6 border-t py-4 md:grid-cols-4 lg:space-y-0 lg:py-10",
        {
          "max-w-full px-4": isFullContentPage,
          "border-x": !isFullContentPage,
        },
      )}
    >
      {children}
    </div>
  );
}
