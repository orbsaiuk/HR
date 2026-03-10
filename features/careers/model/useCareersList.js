"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { careersApi } from "../api/careersApi";
import { MOCK_POSITIONS } from "../ui/components/position-card/MockPositionCard";

const ITEMS_PER_PAGE = 5;

/**
 * Salary range definitions for filtering
 */
const SALARY_RANGES = [
  { key: "700-1000", min: 700, max: 1000 },
  { key: "1000-1500", min: 1000, max: 1500 },
  { key: "1500-2000", min: 1500, max: 2000 },
  { key: "3000+", min: 3000, max: Infinity },
];

export function useCareersList() {
  const [allPositions, setAllPositions] = useState([]);
  const [filters, setFilters] = useState({ departments: [], locations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search state
  const [search, setSearch] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  // Multi-select filter state
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedDepartments, setSelectedDepartments] = useState([]);
  const [selectedLevels, setSelectedLevels] = useState([]);
  const [selectedSalaryRanges, setSelectedSalaryRanges] = useState([]);

  // View & sort state (persist viewMode across refreshes)
  const [viewMode, setViewMode] = useState("list");
  const [sortBy, setSortBy] = useState("relevance"); // "relevance" | "date" | "salary"

  // Restore viewMode from localStorage after hydration;
  // on mobile (< 640px / sm breakpoint), always force grid mode
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (isMobile) {
      setViewMode("grid");
    } else {
      const saved = localStorage.getItem("careers-view-mode");
      if (saved && saved !== viewMode) {
        setViewMode(saved);
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync viewMode to localStorage on change (only on non-mobile)
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    if (!isMobile) {
      localStorage.setItem("careers-view-mode", viewMode);
    }
  }, [viewMode]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await careersApi.getPositions({});
      // Use mock data as fallback when API returns no positions
      setAllPositions(data && data.length > 0 ? data : MOCK_POSITIONS);
    } catch (err) {
      // Fall back to mock data on error so the page still renders
      setAllPositions(MOCK_POSITIONS);
      setError(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFilters = useCallback(async () => {
    try {
      const data = await careersApi.getFilters();
      setFilters(data);
    } catch {
      // Filters are non-critical, silently fail
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  // Client-side filtering
  const filteredPositions = useMemo(() => {
    let result = [...allPositions];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.department?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q) ||
          p.organizationName?.toLowerCase().includes(q)
      );
    }

    // Location search filter
    if (searchLocation) {
      const loc = searchLocation.toLowerCase();
      result = result.filter((p) =>
        p.location?.toLowerCase().includes(loc)
      );
    }

    // Employment type filter (multi-select)
    if (selectedTypes.length > 0) {
      result = result.filter((p) => selectedTypes.includes(p.type));
    }

    // Department filter (multi-select)
    if (selectedDepartments.length > 0) {
      result = result.filter((p) =>
        selectedDepartments.some(
          (d) => d.toLowerCase() === p.department?.toLowerCase()
        )
      );
    }

    // Level filter (multi-select) - maps to experience/seniority if available
    // For now, this is a placeholder filter
    if (selectedLevels.length > 0) {
      result = result.filter((p) => {
        if (!p.level) return false;
        return selectedLevels.includes(p.level);
      });
    }

    // Salary range filter (multi-select)
    if (selectedSalaryRanges.length > 0) {
      result = result.filter((p) => {
        if (!p.salaryMin && !p.salaryMax) return false;
        const salary = p.salaryMin || p.salaryMax || 0;
        return selectedSalaryRanges.some((rangeKey) => {
          const range = SALARY_RANGES.find((r) => r.key === rangeKey);
          if (!range) return false;
          return salary >= range.min && salary <= range.max;
        });
      });
    }

    // Sorting
    if (sortBy === "date") {
      result.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
    } else if (sortBy === "salary") {
      result.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    }
    // "relevance" keeps the default order

    return result;
  }, [
    allPositions,
    search,
    searchLocation,
    selectedTypes,
    selectedDepartments,
    selectedLevels,
    selectedSalaryRanges,
    sortBy,
  ]);

  // Compute filter counts from all positions (not filtered)
  const filterCounts = useMemo(() => {
    const typeCounts = {};
    const departmentCounts = {};
    const levelCounts = {};
    const salaryRangeCounts = {};

    allPositions.forEach((p) => {
      // Type counts
      if (p.type) {
        typeCounts[p.type] = (typeCounts[p.type] || 0) + 1;
      }

      // Department counts
      if (p.department) {
        departmentCounts[p.department] =
          (departmentCounts[p.department] || 0) + 1;
      }

      // Level counts
      if (p.level) {
        levelCounts[p.level] = (levelCounts[p.level] || 0) + 1;
      }

      // Salary range counts
      const salary = p.salaryMin || p.salaryMax || 0;
      if (salary > 0) {
        SALARY_RANGES.forEach((range) => {
          if (salary >= range.min && salary <= range.max) {
            salaryRangeCounts[range.key] =
              (salaryRangeCounts[range.key] || 0) + 1;
          }
        });
      }
    });

    return { typeCounts, departmentCounts, levelCounts, salaryRangeCounts };
  }, [allPositions]);

  // Pagination
  const totalPages = Math.ceil(filteredPositions.length / ITEMS_PER_PAGE);
  const paginatedPositions = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPositions.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPositions, currentPage]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    searchLocation,
    selectedTypes,
    selectedDepartments,
    selectedLevels,
    selectedSalaryRanges,
    sortBy,
  ]);

  // Toggle helpers for multi-select
  const toggleType = useCallback((value) => {
    setSelectedTypes((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }, []);

  const toggleDepartment = useCallback((value) => {
    setSelectedDepartments((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }, []);

  const toggleLevel = useCallback((value) => {
    setSelectedLevels((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }, []);

  const toggleSalaryRange = useCallback((value) => {
    setSelectedSalaryRanges((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearch("");
    setSearchLocation("");
    setSelectedTypes([]);
    setSelectedDepartments([]);
    setSelectedLevels([]);
    setSelectedSalaryRanges([]);
    setSortBy("relevance");
    setCurrentPage(1);
  }, []);

  const hasActiveFilters =
    search ||
    searchLocation ||
    selectedTypes.length > 0 ||
    selectedDepartments.length > 0 ||
    selectedLevels.length > 0 ||
    selectedSalaryRanges.length > 0;

  return {
    // Data
    positions: paginatedPositions,
    allPositions: filteredPositions,
    totalCount: filteredPositions.length,
    filters,
    filterCounts,
    loading,
    error,

    // Search
    search,
    setSearch,
    searchLocation,
    setSearchLocation,

    // Multi-select filters
    selectedTypes,
    toggleType,
    selectedDepartments,
    toggleDepartment,
    selectedLevels,
    toggleLevel,
    selectedSalaryRanges,
    toggleSalaryRange,

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
    refetch: fetchPositions,
  };
}
