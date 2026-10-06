import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  paginationItemsToDisplay?: number;
};

export default function PaginationComponent() {
  return <PaginationRender currentPage={1} totalPages={10} paginationItemsToDisplay={5} />;
}

function PaginationRender({
  currentPage,
  totalPages,
  paginationItemsToDisplay = 5
}: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    paginationItemsToDisplay: paginationItemsToDisplay ?? 5,
    totalPages
  });

  return (
    <Pagination>
      <PaginationContent className="inline-flex gap-0 -space-x-px rounded-md shadow-xs rtl:space-x-reverse">
        <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
          <PaginationLink
            aria-disabled={currentPage === 1 ? true : undefined}
            aria-label="Go to previous page"
            className={cn(
              buttonVariants({
                variant: "outline"
              }),
              "rounded-none shadow-none focus-visible:z-10 aria-disabled:pointer-events-none [&[aria-disabled]>svg]:opacity-50"
            )}
            href={currentPage === 1 ? undefined : `#/page/${currentPage - 1}`}
            role={currentPage === 1 ? "link" : undefined}>
            <ChevronLeftIcon aria-hidden="true" size={16} />
          </PaginationLink>
        </PaginationItem>

        {showLeftEllipsis && (
          <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              className={cn(
                buttonVariants({
                  variant: "outline"
                }),
                "rounded-none shadow-none focus-visible:z-10",
                page === currentPage && "bg-accent"
              )}
              href={`#/page/${page}`}
              isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showRightEllipsis && (
          <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
            <PaginationEllipsis
              className={cn(
                buttonVariants({
                  variant: "outline"
                }),
                "pointer-events-none rounded-none shadow-none"
              )}
            />
          </PaginationItem>
        )}

        <PaginationItem className="[&:first-child>a]:rounded-s-md [&:last-child>a]:rounded-e-md">
          <PaginationLink
            aria-disabled={currentPage === totalPages ? true : undefined}
            aria-label="Go to next page"
            className={cn(
              buttonVariants({
                variant: "outline"
              }),
              "rounded-none shadow-none focus-visible:z-10 aria-disabled:pointer-events-none [&[aria-disabled]>svg]:opacity-50"
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
