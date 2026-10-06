import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

import {
  Pagination,
  PaginationContent,
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
  return <PaginationRender currentPage={1} totalPages={10} />;
}

function PaginationRender({ currentPage, totalPages }: PaginationProps) {
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

        <PaginationItem>
          <Select aria-label="Select page" defaultValue={String(currentPage)}>
            <SelectTrigger className="w-fit whitespace-nowrap" id="select-page">
              <SelectValue placeholder="Select page" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <SelectItem key={page} value={String(page)}>
                  Page {page}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </PaginationItem>

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
