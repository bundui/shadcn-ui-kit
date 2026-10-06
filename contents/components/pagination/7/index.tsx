import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { usePagination } from "@/hooks/use-pagination";
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

function PaginationRender({ currentPage, totalPages, paginationItemsToDisplay }: PaginationProps) {
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    paginationItemsToDisplay: paginationItemsToDisplay ?? 5,
    totalPages
  });

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationLink
            aria-disabled={currentPage === 1 ? true : undefined}
            aria-label="Go to first page"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={currentPage === 1 ? undefined : `#/page/${currentPage - 1}`}
            role={currentPage === 1 ? "link" : undefined}>
            <ChevronFirstIcon aria-hidden="true" size={16} />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-disabled={currentPage === 1 ? true : undefined}
            aria-label="Go to previous page"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={currentPage === 1 ? undefined : `#/page/${currentPage - 1}`}
            role={currentPage === 1 ? "link" : undefined}>
            <ChevronLeftIcon aria-hidden="true" size={16} />
          </PaginationLink>
        </PaginationItem>

        {showLeftEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        {pages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={`#/page/${page}`} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {showRightEllipsis && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationLink
            aria-disabled={currentPage === totalPages ? true : undefined}
            aria-label="Go to next page"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`}
            role={currentPage === totalPages ? "link" : undefined}>
            <ChevronRightIcon aria-hidden="true" size={16} />
          </PaginationLink>
        </PaginationItem>

        <PaginationItem>
          <PaginationLink
            aria-disabled={currentPage === totalPages ? true : undefined}
            aria-label="Go to last page"
            className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            href={currentPage === totalPages ? undefined : `#/page/${totalPages}`}
            role={currentPage === totalPages ? "link" : undefined}>
            <ChevronLastIcon aria-hidden="true" size={16} />
          </PaginationLink>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
