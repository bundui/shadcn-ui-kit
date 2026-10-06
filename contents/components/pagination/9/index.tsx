import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

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
    paginationItemsToDisplay,
    totalPages
  });

  return (
    <div className="flex items-center w-full justify-between gap-3">
      <p aria-live="polite" className="text-muted-foreground flex-1 text-sm whitespace-nowrap">
        Page <span className="text-foreground">{currentPage}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </p>

      <div className="grow">
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

      <div className="flex flex-1 justify-end">
        <Select aria-label="Results per page" defaultValue="10">
          <SelectTrigger className="w-fit whitespace-nowrap" id="results-per-page">
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 / page</SelectItem>
            <SelectItem value="20">20 / page</SelectItem>
            <SelectItem value="50">50 / page</SelectItem>
            <SelectItem value="100">100 / page</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
