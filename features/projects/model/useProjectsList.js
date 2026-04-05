"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { projectsApi } from "../api/projectsApi";
import { MOCK_PROJECTS } from "../ui/components/project-card/MockProjectCard";
import {
  computeFilterCounts,
  filterProjects,
  hasActiveProjectsFilters,
  ITEMS_PER_PAGE,
  toggleMultiSelectValue,
} from "./projectsListUtils";

export function useProjectsList() {
  const [allProjects, setAllProjects] = useState([]);
  const [filters, setFilters] = useState({ technologies: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search state
  const [search, setSearch] = useState("");

  // Multi-select filter state
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedIndustries, setSelectedIndustries] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedDurations, setSelectedDurations] = useState([]);
  const [selectedTeamSizes, setSelectedTeamSizes] = useState([]);

  // View & sort state (persist viewMode across refreshes)
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("relevance"); // "relevance" | "date" | "duration"

  // Restore viewMode from localStorage after hydration;
  // on mobile (< 640px / sm breakpoint), always force grid mode
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (isMobile) {
      setViewMode("grid");
    } else {
      const saved = localStorage.getItem("projects-view-mode");
      if (saved && saved !== viewMode) {
        setViewMode(saved);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync viewMode to localStorage on change (only on non-mobile)
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (!isMobile) {
      localStorage.setItem("projects-view-mode", viewMode);
    }
  }, [viewMode]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await projectsApi.getProjects({});
      // Use mock data as fallback when API returns no projects
      setAllProjects(data && data.length > 0 ? data : MOCK_PROJECTS);
    } catch (err) {
      // Fall back to mock data on error so the page still renders
      setAllProjects(MOCK_PROJECTS);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilters = useCallback(async () => {
    try {
      const data = await projectsApi.getFilters();
      const normalizedFilters = {
        technologies: Array.isArray(data?.technologies)
          ? data.technologies
          : [],
      };
      setFilters(normalizedFilters);
    } catch {
      // Filters are non-critical, silently fail
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const filteredProjects = useMemo(
    () =>
      filterProjects({
        allProjects,
        search,
        selectedTypes,
        selectedIndustries,
        selectedTechnologies,
        selectedStatuses,
        selectedDurations,
        selectedTeamSizes,
        sortBy,
      }),
    [
      allProjects,
      search,
      selectedTypes,
      selectedIndustries,
      selectedTechnologies,
      selectedStatuses,
      selectedDurations,
      selectedTeamSizes,
      sortBy,
    ],
  );

  const filterCounts = useMemo(
    () => computeFilterCounts(allProjects),
    [allProjects],
  );

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProjects, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    selectedTypes,
    selectedIndustries,
    selectedTechnologies,
    selectedStatuses,
    selectedDurations,
    selectedTeamSizes,
    sortBy,
  ]);

  // Toggle helpers for multi-select
  const toggleType = useCallback((value) => {
    setSelectedTypes((prev) => toggleMultiSelectValue(prev, value));
  }, []);

  const toggleIndustry = useCallback((value) => {
    setSelectedIndustries((prev) => toggleMultiSelectValue(prev, value));
  }, []);

  const toggleTechnology = useCallback((value) => {
    setSelectedTechnologies((prev) => toggleMultiSelectValue(prev, value));
  }, []);

  const toggleStatus = useCallback((value) => {
    setSelectedStatuses((prev) => toggleMultiSelectValue(prev, value));
  }, []);

  const toggleDuration = useCallback((value) => {
    setSelectedDurations((prev) => toggleMultiSelectValue(prev, value));
  }, []);

  const toggleTeamSize = useCallback((value) => {
    setSelectedTeamSizes((prev) => toggleMultiSelectValue(prev, value));
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSelectedTypes([]);
    setSelectedIndustries([]);
    setSelectedTechnologies([]);
    setSelectedStatuses([]);
    setSelectedDurations([]);
    setSelectedTeamSizes([]);
    setSortBy("relevance");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters = hasActiveProjectsFilters({
    search,
    selectedTypes,
    selectedIndustries,
    selectedTechnologies,
    selectedStatuses,
    selectedDurations,
    selectedTeamSizes,
  });

  return {
    // Data
    projects: paginatedProjects,
    allProjects: filteredProjects,
    totalCount: filteredProjects.length,
    filters,
    filterCounts,
    loading,
    error,

    // Search
    search,
    setSearch,

    // Multi-select filters
    selectedTypes,
    toggleType,
    selectedIndustries,
    toggleIndustry,
    selectedTechnologies,
    toggleTechnology,
    selectedStatuses,
    toggleStatus,
    selectedDurations,
    toggleDuration,
    selectedTeamSizes,
    toggleTeamSize,

    // View & sort
    viewMode,
    setViewMode,
    sortBy,
    setSortBy,

    // Pagination
    currentPage,
    setCurrentPage,
    totalPages,
    pageSize: ITEMS_PER_PAGE,

    // Actions
    clearFilters,
    hasActiveFilters,
    refetch: fetchProjects,
  };
}
