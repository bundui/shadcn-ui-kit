import { usePagination } from "@/hooks/use-pagination";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
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
    <div className="w-full">
      <Pagination className="w-full">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              aria-disabled={currentPage === 1 ? true : undefined}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              href={currentPage === 1 ? undefined : `#/page/${currentPage - 1}`}
              role={currentPage === 1 ? "link" : undefined}
            />
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
            <PaginationNext
              aria-disabled={currentPage === totalPages ? true : undefined}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
              href={currentPage === totalPages ? undefined : `#/page/${currentPage + 1}`}
              role={currentPage === totalPages ? "link" : undefined}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
