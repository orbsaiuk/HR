"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { projectsApi } from "../api/projectsApi";
import { MOCK_PROJECTS } from "../ui/components/project-card/MockProjectCard";

const ITEMS_PER_PAGE = 6;

/**
 * Duration range definitions for filtering
 */
const DURATION_RANGES = [
  { key: "0-1", min: 0, max: 1 },
  { key: "1-3", min: 1, max: 3 },
  { key: "3-6", min: 3, max: 6 },
  { key: "6+", min: 6, max: Infinity },
];

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
      setFilters(data);
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

  // Client-side filtering
  const filteredProjects = useMemo(() => {
    let result = [...allProjects];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.shortDescription?.toLowerCase().includes(q) ||
          p.clientName?.toLowerCase().includes(q) ||
          p.technologies?.some((t) => t.toLowerCase().includes(q)),
      );
    }

    // Project type filter (multi-select)
    if (selectedTypes.length > 0) {
      result = result.filter((p) => selectedTypes.includes(p.projectType));
    }

    // Industry filter (multi-select)
    if (selectedIndustries.length > 0) {
      result = result.filter((p) => selectedIndustries.includes(p.industry));
    }

    // Technologies filter (multi-select) - array contains check
    if (selectedTechnologies.length > 0) {
      result = result.filter((p) =>
        p.technologies?.some((t) => selectedTechnologies.includes(t)),
      );
    }

    // Status filter (multi-select)
    if (selectedStatuses.length > 0) {
      result = result.filter((p) => selectedStatuses.includes(p.status));
    }

    // Duration range filter (multi-select)
    if (selectedDurations.length > 0) {
      result = result.filter((p) => {
        const months = p.duration?.value || 0;
        return selectedDurations.some((rangeKey) => {
          const range = DURATION_RANGES.find((r) => r.key === rangeKey);
          if (!range) return false;
          return months >= range.min && months <= range.max;
        });
      });
    }

    // Team size filter (multi-select)
    if (selectedTeamSizes.length > 0) {
      result = result.filter((p) => selectedTeamSizes.includes(p.teamSize));
    }

    // Sorting
    if (sortBy === "date") {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === "duration") {
      result.sort(
        (a, b) => (b.duration?.value || 0) - (a.duration?.value || 0),
      );
    }
    // "relevance" keeps the default order

    return result;
  }, [
    allProjects,
    search,
    selectedTypes,
    selectedIndustries,
    selectedTechnologies,
    selectedStatuses,
    selectedDurations,
    selectedTeamSizes,
    sortBy,
  ]);

  // Compute filter counts from all projects (not filtered)
  const filterCounts = useMemo(() => {
    const typeCounts = {};
    const industryCounts = {};
    const technologyCounts = {};
    const statusCounts = {};
    const durationRangeCounts = {};
    const teamSizeCounts = {};

    allProjects.forEach((p) => {
      // Type counts
      if (p.projectType) {
        typeCounts[p.projectType] = (typeCounts[p.projectType] || 0) + 1;
      }

      // Industry counts
      if (p.industry) {
        industryCounts[p.industry] = (industryCounts[p.industry] || 0) + 1;
      }

      // Technology counts
      if (p.technologies && Array.isArray(p.technologies)) {
        p.technologies.forEach((tech) => {
          technologyCounts[tech] = (technologyCounts[tech] || 0) + 1;
        });
      }

      // Status counts
      if (p.status) {
        statusCounts[p.status] = (statusCounts[p.status] || 0) + 1;
      }

      // Duration range counts
      const months = p.duration?.value || 0;
      if (months > 0) {
        DURATION_RANGES.forEach((range) => {
          if (months >= range.min && months <= range.max) {
            durationRangeCounts[range.key] =
              (durationRangeCounts[range.key] || 0) + 1;
          }
        });
      }

      // Team size counts
      if (p.teamSize) {
        teamSizeCounts[p.teamSize] = (teamSizeCounts[p.teamSize] || 0) + 1;
      }
    });

    return {
      typeCounts,
      industryCounts,
      technologyCounts,
      statusCounts,
      durationRangeCounts,
      teamSizeCounts,
    };
  }, [allProjects]);

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
    setSelectedTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const toggleIndustry = useCallback((value) => {
    setSelectedIndustries((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const toggleTechnology = useCallback((value) => {
    setSelectedTechnologies((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const toggleStatus = useCallback((value) => {
    setSelectedStatuses((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const toggleDuration = useCallback((value) => {
    setSelectedDurations((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  }, []);

  const toggleTeamSize = useCallback((value) => {
    setSelectedTeamSizes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
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

  const hasActiveFilters =
    search ||
    selectedTypes.length > 0 ||
    selectedIndustries.length > 0 ||
    selectedTechnologies.length > 0 ||
    selectedStatuses.length > 0 ||
    selectedDurations.length > 0 ||
    selectedTeamSizes.length > 0;

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
