import { ChevronFirstIcon, ChevronLastIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useId } from "react";

import { Label } from "@/components/ui/label";
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
};

export default function PaginationComponent() {
  return <PaginationRender currentPage={1} totalPages={10} />;
}

function PaginationRender({ currentPage, totalPages }: PaginationProps) {
  const id = useId();
  return (
    <div className="flex items-center w-full justify-between gap-8">
      <div className="flex items-center gap-3">
        <Label htmlFor={id}>Rows per page</Label>
        <Select defaultValue="25">
          <SelectTrigger className="w-fit whitespace-nowrap" id={id}>
            <SelectValue placeholder="Select number of results" />
          </SelectTrigger>
          <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
        <p aria-live="polite" className="text-muted-foreground text-sm whitespace-nowrap">
          <span className="text-foreground">1-25</span> of{" "}
          <span className="text-foreground">100</span>
        </p>
      </div>

      <div>
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
      </div>
    </div>
  );
}
