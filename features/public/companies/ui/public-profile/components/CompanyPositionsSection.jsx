"use client";

import { useState, useMemo } from "react";
import { PositionCard } from "@/features/public/careers/ui/components/position-card/PositionCard";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Briefcase, LayoutGrid, List } from "lucide-react";
import { sortPositions } from "./companyProfileUtils";

export function CompanyPositionsSection({ positions, companyName }) {
    const [viewMode, setViewMode] = useState("grid");
    const [sortBy, setSortBy] = useState("date");

    const sortedPositions = useMemo(
        () => sortPositions(positions, sortBy),
        [positions, sortBy],
    );

    return (
        <div>
            {/* Header with controls */}
            <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-lg md:text-2xl text-foreground flex items-center gap-2">
                    <Briefcase size={18} />
                    الوظائف المتاحة
                    {positions.length > 0 && (
                        <Badge variant="secondary">{positions.length}</Badge>
                    )}
                </h2>

                {positions.length > 0 && (
                    <div className="flex items-center gap-2">
                        {/* Sort */}
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:inline">
                                ترتيب حسب:
                            </span>
                            <Select value={sortBy} onValueChange={setSortBy} dir="rtl">
                                <SelectTrigger className="w-[100px] sm:w-[130px] h-8 text-xs sm:text-sm border-gray-300">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="date">الأحدث</SelectItem>
                                    <SelectItem value="salary">الراتب</SelectItem>
                                    <SelectItem value="title">العنوان</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* View toggle */}
                        <div className="hidden sm:block w-px h-6 bg-gray-300" />
                        <div className="hidden sm:flex items-center gap-1">
                            <Button
                                variant={viewMode === "list" ? "default" : "ghost"}
                                size="icon"
                                className={`h-8 w-8 ${viewMode === "list" ? "bg-primary hover:bg-primary/90 text-white" : ""}`}
                                onClick={() => setViewMode("list")}
                            >
                                <List size={16} />
                            </Button>
                            <Button
                                variant={viewMode === "grid" ? "default" : "ghost"}
                                size="icon"
                                className={`h-8 w-8 ${viewMode === "grid" ? "bg-primary hover:bg-primary/90 text-white" : ""}`}
                                onClick={() => setViewMode("grid")}
                            >
                                <LayoutGrid size={16} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Position cards */}
            {positions.length === 0 ? (
                <EmptyState
                    icon={Briefcase}
                    title="لا توجد وظائف متاحة"
                    description={`لا توجد وظائف مفتوحة حالياً لدى ${companyName}. تحقق لاحقاً!`}
                />
            ) : (
                <div
                    className={
                        viewMode === "grid"
                            ? "grid gap-4 sm:grid-cols-2"
                            : "flex flex-col gap-4"
                    }
                >
                    {sortedPositions.map((position) => (
                        <PositionCard
                            key={position._id}
                            position={position}
                            viewMode={viewMode}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
