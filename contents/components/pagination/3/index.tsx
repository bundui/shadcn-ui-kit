import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function PaginationComponent() {
  return <PaginationRender currentPage={1} totalPages={10} />;
}

function PaginationRender({ currentPage, totalPages }: PaginationProps) {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between">
        <PaginationItem>
          <PaginationLink
            aria-disabled={currentPage === 1 ? true : undefined}
            aria-label="Go to previous page"
            className={cn(
              "aria-disabled:pointer-events-none aria-disabled:opacity-50",
              buttonVariants({
                variant: "outline"
              })
            )}
            href={currentPage === 1 ? undefined : `#/page/${currentPage - 1}`}
            role={currentPage === 1 ? "link" : undefined}>
            <ChevronLeftIcon aria-hidden="true" size={16} />
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <p aria-live="polite" className="text-muted-foreground text-sm">
            Page <span className="text-foreground">{currentPage}</span> of{" "}
            <span className="text-foreground">{totalPages}</span>
          </p>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            aria-disabled={currentPage === totalPages ? true : undefined}
            aria-label="Go to next page"
            className={cn(
              "aria-disabled:pointer-events-none aria-disabled:opacity-50",
              buttonVariants({
                variant: "outline"
              })
            )}
            href={currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`}
            role={currentPage === totalPages ? "link" : undefined}>
            <ChevronRightIcon aria-hidden="true" size={16} />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
