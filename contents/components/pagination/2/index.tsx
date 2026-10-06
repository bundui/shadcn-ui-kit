import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
};

export default function Component({ currentPage, totalPages }: PaginationProps) {
  return (
    <Pagination>
      <PaginationContent className="w-full justify-between gap-3">
        <PaginationItem>
          <Button
            aria-disabled={currentPage === 1 ? true : undefined}
            className="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
            role={currentPage === 1 ? "link" : undefined}
            variant="ghost">
            <ArrowLeftIcon
              aria-hidden="true"
              className="-ms-1 opacity-60 transition-transform group-hover:-translate-x-0.5"
              size={16}
            />
            Previous
          </Button>
        </PaginationItem>
        <PaginationItem>
          <Button
            aria-disabled={currentPage === totalPages ? true : undefined}
            className="group aria-disabled:pointer-events-none aria-disabled:opacity-50"
            role={currentPage === totalPages ? "link" : undefined}
            variant="ghost">
            Next
            <ArrowRightIcon
              aria-hidden="true"
              className="-me-1 opacity-60 transition-transform group-hover:translate-x-0.5"
              size={16}
            />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
