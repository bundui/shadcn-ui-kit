"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ProductsPaginationProps {
  currentPage: number;
  totalPages: number;
}

export function ProductsPagination({ currentPage, totalPages }: ProductsPaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push(createPageURL(page));
    }
  };

  return (
    <div className="mt-16 flex justify-center items-center gap-2">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="h-10 w-10 flex items-center justify-center rounded-lg border text-muted-foreground hover:bg-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IconChevronLeft className="h-5 w-5" />
      </button>

      {/* Basic Pagination Logic for demo */}
      {Array.from({ length: totalPages }).map((_, i) => {
        const page = i + 1;
        const isActive = page === currentPage;

        // Show first, last, current, and adjacent pages
        if (
          page === 1 ||
          page === totalPages ||
          (page >= currentPage - 1 && page <= currentPage + 1)
        ) {
          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={cn(
                "h-10 w-10 flex items-center justify-center rounded-lg border font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-foreground hover:border-primary hover:text-primary"
              )}
            >
              {page}
            </button>
          );
        }

        // Show ellipses
        if (page === currentPage - 2 || page === currentPage + 2) {
          return (
            <span key={page} className="px-1 text-muted-foreground">
              ...
            </span>
          );
        }

        return null;
      })}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="h-10 w-10 flex items-center justify-center rounded-lg border text-muted-foreground hover:bg-secondary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IconChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
