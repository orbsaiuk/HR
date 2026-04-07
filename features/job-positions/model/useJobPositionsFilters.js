"use client";

import { useEffect, useMemo, useState } from "react";
import { PAGE_SIZE_OPTIONS } from "../lib/jobPositionsFilters.constants";
import {
  filterPositions,
  sortPositions,
} from "../lib/jobPositionsFilters.utils";

export function useJobPositionsFilters(positions) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredAndSortedPositions = useMemo(() => {
    const filtered = filterPositions(positions, {
      searchQuery,
      statusFilter,
      typeFilter,
    });

    return sortPositions(filtered, sortBy);
  }, [positions, searchQuery, statusFilter, typeFilter, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAndSortedPositions.length / pageSize),
  );
  const currentPage = Math.min(page, totalPages);

  const paginatedPositions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredAndSortedPositions.slice(startIndex, startIndex + pageSize);
  }, [filteredAndSortedPositions, currentPage, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, typeFilter, sortBy]);

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setTypeFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
  };

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    pageSize,
    handlePageSizeChange,
    currentPage,
    totalPages,
    paginatedPositions,
    filteredCount: filteredAndSortedPositions.length,
    resetFilters,
    goToPage,
  };
}
