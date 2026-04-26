"use client";

import { useState } from "react";
import { useCareersList } from "../model/useCareersList";
import { CareersHero } from "./components/CareersHero";
import { CareersSidebar, CareersMobileSidebar } from "./components/filters";
import { CareersResults } from "./components/CareersResults";

export function CareersPage() {
  const {
    positions,
    totalCount,
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

    // Actions
    clearFilters,
    hasActiveFilters,
  } = useCareersList();

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Shared sidebar filter props
  const sidebarProps = {
    selectedTypes,
    onToggleType: toggleType,
    selectedDepartments,
    onToggleDepartment: toggleDepartment,
    selectedLevels,
    onToggleLevel: toggleLevel,
    selectedSalaryRanges,
    onToggleSalaryRange: toggleSalaryRange,
    filterCounts,
    apiDepartments: filters.departments,
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <CareersHero
        search={search}
        onSearchChange={setSearch}
        searchLocation={searchLocation}
        onSearchLocationChange={setSearchLocation}
        locations={filters.locations}
        onSearch={() => { }}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-[260px] shrink-0">
            <CareersSidebar {...sidebarProps} />
          </div>

          {/* Mobile sidebar overlay */}
          <CareersMobileSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            sidebarProps={sidebarProps}
          />

          {/* Results area */}
          <CareersResults
            positions={positions}
            totalCount={totalCount}
            loading={loading}
            error={error}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            sortBy={sortBy}
            onSortChange={setSortBy}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onFilterToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>
    </div>
  );
}
