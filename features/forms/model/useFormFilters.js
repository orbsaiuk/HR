"use client";

import { useState, useMemo } from "react";

export function useFormFilters(forms) {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("updatedAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredForms = useMemo(() => {
    let filtered = [...forms];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (form) =>
          form.title.toLowerCase().includes(searchLower) ||
          (form.description &&
            form.description.toLowerCase().includes(searchLower)),
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      if (sortBy === "updatedAt" || sortBy === "createdAt") {
        comparison = new Date(a[sortBy]) - new Date(b[sortBy]);
      } else if (sortBy === "title") {
        comparison = a.title.localeCompare(b.title);
      } else if (sortBy === "responseCount") {
        comparison = (a.responseCount || 0) - (b.responseCount || 0);
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [forms, search, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return {
    search,
    setSearch,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
    handleSort,
    filteredForms,
  };
}
