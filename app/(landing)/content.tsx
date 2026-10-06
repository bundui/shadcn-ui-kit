"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { useIsFullContentPage } from "@/components/site-data-provider";

export default function Content({
  className,
  children,
}: Readonly<{
  className?: string;
  children: React.ReactNode;
}>) {
  const isFullContentPage = useIsFullContentPage();
  return (
    <main
      className={cn(
        "relative container mx-auto min-h-[55vh] border-x px-4",
        className,
        {
          "max-w-full": isFullContentPage,
        },
      )}
    >
      {children}
    </main>
  );
}
