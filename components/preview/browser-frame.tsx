import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function BrowserFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("bg-muted/60 overflow-hidden rounded-2xl border", className)}
    >
      <div className="flex h-9 items-center gap-1.5 px-4" aria-hidden>
        <span className="size-2.5 rounded-full bg-red-400" />
        <span className="size-2.5 rounded-full bg-amber-400" />
        <span className="size-2.5 rounded-full bg-green-500" />
      </div>
      <div className="-mx-px -mb-px overflow-hidden rounded-t-xl border">
        {children}
      </div>
    </div>
  );
}
