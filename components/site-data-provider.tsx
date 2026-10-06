"use client";

import { createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import type { ContentCounts } from "@/lib/content-count";
import { isFullContentPage } from "@/lib/full-content-page";

type SiteData = {
  counts: ContentCounts;
  componentGroups: string[];
};

const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({
  children,
  ...value
}: SiteData & { children: React.ReactNode }) {
  return (
    <SiteDataContext.Provider value={value}>
      {children}
    </SiteDataContext.Provider>
  );
}

function useSiteData() {
  const value = useContext(SiteDataContext);
  if (!value) {
    throw new Error("useSiteData must be used inside SiteDataProvider");
  }
  return value;
}

export function useContentCounts() {
  return useSiteData().counts;
}

export function useIsFullContentPage() {
  const pathname = usePathname();
  const { componentGroups } = useSiteData();
  return isFullContentPage(pathname, componentGroups);
}
