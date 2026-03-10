"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, SlidersHorizontal } from "lucide-react";

export function CareersListHeader({
    totalCount = 0,
    viewMode = "list",
    onViewModeChange,
    sortBy = "relevance",
    onSortChange,
    onFilterToggle,
    hasActiveFilters,
}) {
    return (
        <div className="flex items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
            {/* Title */}
            <h2 className="text-lg sm:text-2xl text-gray-900 whitespace-nowrap">جميع الوظائف</h2>

            {/* Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Filter toggle (mobile only) */}
                {onFilterToggle && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onFilterToggle}
                        className="lg:hidden gap-1.5 h-8 sm:h-9 text-xs sm:text-sm px-2.5 sm:px-3"
                    >
                        <SlidersHorizontal size={14} />
                        <span className="hidden sm:inline">الفلاتر</span>
                        {hasActiveFilters && (
                            <span className="bg-blue-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                                !
                            </span>
                        )}
                    </Button>
                )}

                {/* Sort dropdown */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap hidden sm:inline">ترتيب حسب:</span>
                    <Select value={sortBy} onValueChange={onSortChange} dir="rtl">
                        <SelectTrigger className="w-[100px] sm:w-[140px] h-8 sm:h-9 text-xs sm:text-sm border-gray-300">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="relevance">الأكثر صلة</SelectItem>
                            <SelectItem value="date">الأحدث</SelectItem>
                            <SelectItem value="salary">الراتب</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Separator (hidden on mobile) */}
                <div className="hidden sm:block w-px h-6 bg-gray-300" />

                {/* View toggle (hidden on mobile — grid only on small screens) */}
                <div className="hidden sm:flex items-center gap-1">
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="icon"
                        className={`h-8 w-8 ${viewMode === "list" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                        onClick={() => onViewModeChange("list")}
                    >
                        <List size={16} />
                    </Button>
                    <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        className={`h-8 w-8 ${viewMode === "grid" ? "bg-red-600 hover:bg-red-700 text-white" : ""}`}
                        onClick={() => onViewModeChange("grid")}
                    >
                        <LayoutGrid size={16} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
