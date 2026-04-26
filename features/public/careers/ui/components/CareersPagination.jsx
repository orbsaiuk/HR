"use client";

import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationEllipsis,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Generates an array of page numbers to display with ellipsis.
 * Example: [1, 2, 3, 4, 5, '...', 33]
 */
function getPageNumbers(currentPage, totalPages, maxVisible = 5) {
    if (totalPages <= maxVisible + 2) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const half = Math.floor(maxVisible / 2);

    let start = Math.max(2, currentPage - half);
    let end = Math.min(totalPages - 1, currentPage + half);

    // Adjust if near the beginning
    if (currentPage <= half + 1) {
        end = maxVisible;
    }

    // Adjust if near the end
    if (currentPage >= totalPages - half) {
        start = totalPages - maxVisible + 1;
    }

    // Always show first page
    pages.push(1);

    // Ellipsis after first page if needed
    if (start > 2) {
        pages.push("start-ellipsis");
    }

    // Middle pages
    for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
            pages.push(i);
        }
    }

    // Ellipsis before last page if needed
    if (end < totalPages - 1) {
        pages.push("end-ellipsis");
    }

    // Always show last page
    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;
}

export function CareersPagination({
    currentPage,
    totalPages,
    onPageChange,
}) {
    if (totalPages <= 1) return null;

    const pages = getPageNumbers(currentPage, totalPages);

    return (
        <Pagination className="mt-8">
            <PaginationContent>
                {/* Previous button - Note: In RTL, "previous" arrow points right */}
                <PaginationItem>
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                        aria-label="الصفحة السابقة"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </PaginationItem>

                {/* Page numbers */}
                {pages.map((page, index) => {
                    if (page === "start-ellipsis" || page === "end-ellipsis") {
                        return (
                            <PaginationItem key={page}>
                                <PaginationEllipsis />
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={page}>
                            <PaginationLink
                                href="#"
                                isActive={page === currentPage}
                                onClick={(e) => {
                                    e.preventDefault();
                                    onPageChange(page);
                                }}
                                className={`cursor-pointer h-9 w-9 ${page === currentPage
                                        ? "bg-[#1a2332] text-white border-[#1a2332] hover:bg-[#2a3a4a] hover:text-white"
                                        : ""
                                    }`}
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    );
                })}

                {/* Next button - Note: In RTL, "next" arrow points left */}
                <PaginationItem>
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center justify-center h-9 w-9 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                        aria-label="الصفحة التالية"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
