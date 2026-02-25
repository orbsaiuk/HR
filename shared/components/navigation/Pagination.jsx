"use client";

import {
    Pagination as ShadcnPagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export function Pagination({ page, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pageNumbers = generatePageNumbers(page, totalPages);

    return (
        <ShadcnPagination>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (page > 1) onPageChange(page - 1);
                        }}
                        className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>

                {pageNumbers.map((p, i) => (
                    <PaginationItem key={p === "..." ? `ellipsis-${i}` : p}>
                        {p === "..." ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                href="#"
                                isActive={p === page}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(p);
                                }}
                                className="cursor-pointer"
                            >
                                {p}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            if (page < totalPages) onPageChange(page + 1);
                        }}
                        className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                </PaginationItem>
            </PaginationContent>
        </ShadcnPagination>
    );
}

/**
 * Generate an array of page numbers with ellipsis for large page counts.
 * Example: [1, 2, 3, "...", 10] or [1, "...", 4, 5, 6, "...", 10]
 */
function generatePageNumbers(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages = [];
    pages.push(1);

    if (current > 3) pages.push("...");

    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
        pages.push(i);
    }

    if (current < total - 2) pages.push("...");

    pages.push(total);

    return pages;
}
