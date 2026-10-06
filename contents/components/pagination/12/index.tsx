import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useId } from "react";

import { usePagination } from "@/hooks/use-pagination";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  const id = useId();

  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    paginationItemsToDisplay,
    totalPages
  });

  return (
    <div className="flex items-center w-full justify-between gap-4">
      <div>
        <Pagination>
          <PaginationContent>
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
          </PaginationContent>
        </Pagination>
      </div>

      <div className="flex items-center gap-3">
        <Label className="whitespace-nowrap" htmlFor={id}>
          Go to page
        </Label>
        <Input className="w-14" defaultValue={String(currentPage)} id={id} type="text" />
      </div>
    </div>
  );
}
