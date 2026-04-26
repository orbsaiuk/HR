"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

function getPageNumbers(currentPage, totalPages, maxVisible = 5) {
  if (totalPages <= maxVisible + 2) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = [];
  const half = Math.floor(maxVisible / 2);

  let start = Math.max(2, currentPage - half);
  let end = Math.min(totalPages - 1, currentPage + half);

  if (currentPage <= half + 1) {
    end = maxVisible;
  }

  if (currentPage >= totalPages - half) {
    start = totalPages - maxVisible + 1;
  }

  pages.push(1);

  if (start > 2) {
    pages.push("start-ellipsis");
  }

  for (let i = start; i <= end; i++) {
    if (i !== 1 && i !== totalPages) {
      pages.push(i);
    }
  }

  if (end < totalPages - 1) {
    pages.push("end-ellipsis");
  }

  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

export function AuditLogPagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(page, totalPages);

  const handlePageChange = (nextPage) => {
    onPageChange(nextPage);
  };

  return (
    <Pagination className="mt-0 w-auto" dir="rtl">
      <PaginationContent className="flex-wrap gap-1.5">
        <PaginationItem>
          <button
            onClick={() => handlePageChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label="الصفحة السابقة"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </PaginationItem>

        {pages.map((p) => {
          if (p === "start-ellipsis" || p === "end-ellipsis") {
            return (
              <PaginationItem key={p}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={p}>
              <PaginationLink
                href="#"
                isActive={p === page}
                onClick={(e) => {
                  e.preventDefault();
                  handlePageChange(p);
                }}
                className={`h-9 w-9 cursor-pointer ${
                  p === page ? "bg-[#5338D5] text-white hover:bg-[#462EA8]" : ""
                }`}
              >
                {p}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        <PaginationItem>
          <button
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
            aria-label="الصفحة التالية"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
