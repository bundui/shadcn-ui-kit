"use client";

import { useEffect, useState } from "react";

import BlockListItem from "@/components/block-list-item";

export type RelatedBlockItem = {
  href: string;
  title: string;
  longTitle: string;
  isNew: boolean;
  countText: string;
};

function shuffle<T>(items: T[]) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function RelatedBlocksGrid({
  items,
  count,
}: {
  items: RelatedBlockItem[];
  count: number;
}) {
  const [visible, setVisible] = useState(() => items.slice(0, count));

  useEffect(() => {
    setVisible(shuffle(items).slice(0, count));
  }, [items, count]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
      {visible.map((item) => (
        <BlockListItem
          key={item.href}
          href={item.href}
          title={item.title}
          longTitle={item.longTitle}
          isNew={item.isNew}
          countText={item.countText}
        />
      ))}
    </div>
  );
}
