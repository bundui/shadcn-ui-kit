import Link from "next/link";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { Badge } from "./ui/badge";
import { cn } from "@/lib/utils";

export default function BlockListItem({
  href,
  title,
  longTitle,
  countText,
  isNew,
  newCount = 0,
  className,
}: {
  href: string;
  title: string;
  longTitle: string;
  countText: string;
  isNew: boolean;
  newCount?: number;
  className?: string;
}) {
  return (
    <Link href={href} key={href} className={cn("group", className)}>
      <Card className="gap-0 overflow-hidden py-0 border ring-0 shadow-none group-hover:border-primary/20 transition-colors">
        <figure className="bg-muted w-full rounded-2xl p-2.5">
          <Image
            src={`/images${href}.png`}
            alt={`${longTitle.toLowerCase()}`}
            width={400}
            height={300}
            className="h-full w-full rounded-2xl object-contain dark:hidden"
            loading="lazy"
          />
          <Image
            src={`/images${href}-dark.png`}
            alt={`${longTitle.toLowerCase()} dark`}
            width={400}
            height={300}
            className="hidden h-full w-full rounded-2xl object-contain dark:block"
            loading="lazy"
          />
        </figure>
        <CardContent className="flex items-center justify-between gap-3 py-4">
          <div className="min-w-0">
            <span className="font-medium">{title}</span>
            <div className="text-muted-foreground text-xs">{countText}</div>
          </div>
          {(isNew || newCount > 0) && (
            <Badge
              variant="outline"
              className="shrink-0 border-emerald-400 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400"
            >
              {newCount > 0 ? `+${newCount} new` : "New"}
            </Badge>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
