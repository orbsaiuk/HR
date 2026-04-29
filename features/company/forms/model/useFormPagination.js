"use client";

import { useEffect, useMemo, useState } from "react";

export function useFormPagination(items, pageSize) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / pageSize);

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, currentPage, pageSize]);

  const visibleRangeStart =
    items.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const visibleRangeEnd = Math.min(currentPage * pageSize, items.length);

  useEffect(() => {
    setCurrentPage((previousPage) => {
      const safeTotalPages = Math.max(totalPages, 1);
      return Math.min(previousPage, safeTotalPages);
    });
  }, [totalPages]);

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems,
    visibleRangeStart,
    visibleRangeEnd,
  };
}
