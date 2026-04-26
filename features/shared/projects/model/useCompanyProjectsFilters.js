"use client";

import { useMemo, useState } from "react";

export const COMPANY_PROJECTS_ALL_FILTER = "all";

export function useCompanyProjectsFilters(projects = []) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(COMPANY_PROJECTS_ALL_FILTER);
  const [categoryFilter, setCategoryFilter] = useState(
    COMPANY_PROJECTS_ALL_FILTER,
  );

  const filteredProjects = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          project.title,
          project.location,
          project.description,
          project.duration,
          project.budgetRange,
        ]
          .filter(Boolean)
          .some((value) => value.toLowerCase().includes(normalizedQuery));

      const matchesStatus =
        statusFilter === COMPANY_PROJECTS_ALL_FILTER ||
        project.status === statusFilter;

      const matchesCategory =
        categoryFilter === COMPANY_PROJECTS_ALL_FILTER ||
        project.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, searchQuery, statusFilter, categoryFilter]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== COMPANY_PROJECTS_ALL_FILTER ||
    categoryFilter !== COMPANY_PROJECTS_ALL_FILTER;

  function clearFilters() {
    setSearchQuery("");
    setStatusFilter(COMPANY_PROJECTS_ALL_FILTER);
    setCategoryFilter(COMPANY_PROJECTS_ALL_FILTER);
  }

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    filteredProjects,
    hasActiveFilters,
    clearFilters,
  };
}
