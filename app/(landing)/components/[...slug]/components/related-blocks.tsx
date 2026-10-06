import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { categories } from "@/app/(landing)/blocks/categories";
import RelatedBlocksGrid, { type RelatedBlockItem } from "./related-blocks-grid";

const COUNT = 8;

const ITEMS: RelatedBlockItem[] = categories
  .flatMap((category) => category.items ?? [])
  .map((item) => ({
    href: item.href,
    title: item.sidebarTitle,
    longTitle: item.title,
    isNew: "isNew" in item ? Boolean(item.isNew) : false,
    countText:
      item.components.length > 1
        ? `${item.components.length} blocks`
        : `${item.components.length} block`,
  }));

export default function RelatedBlocks() {
  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="font-heading text-xl font-semibold lg:text-2xl">
            Explore Shadcn Blocks
          </h2>
          <p className="text-muted-foreground">
            Ready-made page sections built with the same components.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/blocks">
            View all blocks
            <ArrowRightIcon />
          </Link>
        </Button>
      </div>

      <RelatedBlocksGrid items={ITEMS} count={COUNT} />
    </section>
  );
}
