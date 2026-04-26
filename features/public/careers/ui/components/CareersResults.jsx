"use client";

import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { Error } from "@/shared/components/feedback/Error";
import { PositionCard } from "./position-card/PositionCard";
import { PositionCardSkeletonList } from "./position-card/PositionCardSkeleton";
import { CareersListHeader } from "./CareersListHeader";
import { CareersPagination } from "./CareersPagination";
import { Briefcase } from "lucide-react";

export function CareersResults({
    positions,
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
            <CareersListHeader
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
                <PositionCardSkeletonList viewMode={viewMode} count={6} />
            ) : error ? (
                <Error message={error} />
            ) : positions.length === 0 ? (
                <EmptyState
                    icon={Briefcase}
                    title={
                        hasActiveFilters
                            ? "لا توجد وظائف تطابق الفلاتر"
                            : "لا توجد وظائف متاحة"
                    }
                    description={
                        hasActiveFilters
                            ? "حاول تعديل البحث أو الفلاتر."
                            : "تحقق لاحقاً من الفرص الجديدة."
                    }
                    action={
                        hasActiveFilters
                            ? { label: "مسح الفلاتر", onClick: onClearFilters }
                            : undefined
                    }
                />
            ) : (
                <>
                    {/* Job cards */}
                    <div
                        className={
                            viewMode === "grid"
                                ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3"
                                : "flex flex-col gap-4"
                        }
                    >
                        {positions.map((position) => (
                            <PositionCard
                                key={position._id}
                                position={position}
                                viewMode={viewMode}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    <CareersPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                </>
            )}
        </div>
    );
}
