"use client";

import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { Error } from "@/shared/components/feedback/Error";
import { ProjectCard } from "./project-card/ProjectCard";
import { ProjectCardSkeleton } from "./project-card/ProjectCardSkeleton";
import { ProjectsListHeader } from "./ProjectsListHeader";
import { ProjectsPagination } from "./ProjectsPagination";
import { FolderOpen } from "lucide-react";

export function ProjectsResults({
  projects,
  totalCount,
  loading,
  error,
  viewMode,
  onViewModeChange,
  sortBy,
  onSortChange,
  currentPage,
  totalPages,
  onPageChange,
  hasActiveFilters,
  onClearFilters,
  onFilterToggle,
}) {
  return (
    <div className="flex-1 min-w-0">
      {/* List Header */}
      <ProjectsListHeader
        totalCount={totalCount}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        sortBy={sortBy}
        onSortChange={onSortChange}
        onFilterToggle={onFilterToggle}
        hasActiveFilters={hasActiveFilters}
      />

      {/* Results */}
      {loading ? (
        <div
          className={
            viewMode === "grid"
              ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
              : "flex flex-col gap-4"
          }
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} viewMode={viewMode} />
          ))}
        </div>
      ) : error ? (
        <Error message={error} />
      ) : projects.length === 0 ? (
        <EmptyState
          icon={FolderOpen}
          title={
            hasActiveFilters
              ? "لا توجد مشاريع تطابق الفلاتر"
              : "لا توجد مشاريع متاحة"
          }
          description={
            hasActiveFilters
              ? "حاول تعديل البحث أو الفلاتر."
              : "تحقق لاحقاً من المشاريع الجديدة."
          }
          action={
            hasActiveFilters
              ? { label: "مسح الفلاتر", onClick: onClearFilters }
              : undefined
          }
        />
      ) : (
        <>
          {/* Project cards */}
          <div
            className={
              viewMode === "grid"
                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                : "flex flex-col gap-4"
            }
          >
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Pagination */}
          <ProjectsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
