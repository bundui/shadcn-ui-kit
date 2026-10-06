import React from "react";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteDataProvider } from "@/components/site-data-provider";
import { contentCounts } from "@/lib/content-count";
import { getGroupedComponentCategories } from "@/lib/data-contents";

export const revalidate = 3600;

const componentGroups = getGroupedComponentCategories({
  withoutAll: true,
}).map((group) => group.href);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SiteDataProvider counts={contentCounts} componentGroups={componentGroups}>
      <TooltipProvider>
        <div className="overflow-x-clip">
          <Navbar />
          <main className="divide-y">
            {children}
            <Footer />
          </main>
        </div>
      </TooltipProvider>
      <Toaster position="top-center" />
    </SiteDataProvider>
  );
}
