"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

/**
 * Available audit log categories — must match the categories used by
 * `logAuditEvent()` in the backend.
 */
const CATEGORIES = [
    { value: "roles", label: "Roles" },
    { value: "team", label: "Team" },
    { value: "forms", label: "Forms" },
    { value: "positions", label: "Positions" },
    { value: "applications", label: "Applications" },
    { value: "settings", label: "Settings" },
];

export function AuditLogFilters({ filters, onFilterChange }) {
    const hasActiveFilters = filters.category || filters.actor;

    return (
        <div className="flex items-center gap-3 flex-wrap">
            {/* Category filter */}
            <Select
                value={filters.category || "all"}
                onValueChange={(value) =>
                    onFilterChange({ category: value === "all" ? "" : value })
                }
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Clear filters */}
            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFilterChange({ category: "", actor: "" })}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                </Button>
            )}
        </div>
    );
}
