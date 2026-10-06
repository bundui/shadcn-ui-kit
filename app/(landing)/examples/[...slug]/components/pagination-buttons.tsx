import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type PaginationItem = {
  href: string;
  sidebarTitle: string;
};

type PaginationButtonsProps = {
  previousItem: PaginationItem | null;
  nextItem: PaginationItem | null;
};

export default function PaginationButtons({
  previousItem,
  nextItem,
}: PaginationButtonsProps) {
  if (!previousItem && !nextItem) return null;

  return (
    <div className="grid grid-cols-1 gap-3 pt-4 md:grid-cols-2">
      {previousItem ? (
        <Button
          asChild
          variant="outline"
          className="group hover:bg-accent h-auto w-full flex-row items-center justify-start gap-4 p-4 text-left"
        >
          <Link href={previousItem.href} className="flex w-full items-center">
            <span className="bg-background flex size-9 items-center justify-center rounded-full border">
              <ArrowLeft className="size-4 shrink-0" />
            </span>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-muted-foreground text-xs">Previous</span>
              <span className="font-semibold">{previousItem.sidebarTitle}</span>
            </div>
          </Link>
        </Button>
      ) : (
        <div />
      )}

      {nextItem ? (
        <Button
          asChild
          variant="outline"
          className="group hover:bg-accent h-auto w-full flex-row items-center justify-end gap-4 p-4 text-left md:ml-auto"
        >
          <Link
            href={nextItem.href}
            className="flex w-full items-center justify-end"
          >
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-muted-foreground text-xs">Next</span>
              <span className="font-semibold">{nextItem.sidebarTitle}</span>
            </div>
            <span className="bg-background flex size-9 items-center justify-center rounded-full border">
              <ArrowRight className="size-4 shrink-0" />
            </span>
          </Link>
        </Button>
      ) : null}
    </div>
  );
}
