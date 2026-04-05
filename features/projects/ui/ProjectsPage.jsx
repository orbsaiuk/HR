"use client";

import { useState } from "react";
import { useProjectsList } from "../model/useProjectsList";
import { ProjectsHero } from "./components/ProjectsHero";
import { ProjectsSidebar, ProjectsMobileSidebar } from "./components/filters";
import { ProjectsResults } from "./components/ProjectsResults";

export function ProjectsPage() {
  const {
    projects,
    totalCount,
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
    pageSize,

    // Actions
    clearFilters,
    hasActiveFilters,
  } = useProjectsList();

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Shared sidebar filter props
  const sidebarProps = {
    selectedTypes,
    onToggleType: toggleType,
    selectedIndustries,
    onToggleIndustry: toggleIndustry,
    selectedTechnologies,
    onToggleTechnology: toggleTechnology,
    selectedStatuses,
    onToggleStatus: toggleStatus,
    selectedDurations,
    onToggleDuration: toggleDuration,
    selectedTeamSizes,
    onToggleTeamSize: toggleTeamSize,
    filterCounts,
    apiTechnologies: filters.technologies,
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <ProjectsHero
        search={search}
        onSearchChange={setSearch}
        onSearch={() => {}}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-65 shrink-0">
            <ProjectsSidebar {...sidebarProps} />
          </div>

          {/* Mobile sidebar overlay */}
          <ProjectsMobileSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            sidebarProps={sidebarProps}
          />

          {/* Results area */}
          <ProjectsResults
            projects={projects}
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
            pageSize={pageSize}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            onFilterToggle={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>
    </div>
  );
}
