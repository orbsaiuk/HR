"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Download } from "lucide-react";

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

export function AuditLogFilters({ filters, onFilterChange, getExportUrl }) {
    const hasActiveFilters =
        filters.category || filters.actor || filters.startDate || filters.endDate;

    return (
        <div className="space-y-3">
            <div className="flex items-end gap-3 flex-wrap">
                {/* Category filter */}
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">Category</Label>
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
                </div>

                {/* Date range filter */}
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">From</Label>
                    <Input
                        type="date"
                        value={filters.startDate ? filters.startDate.slice(0, 10) : ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            onFilterChange({
                                startDate: val ? `${val}T00:00:00.000Z` : "",
                            });
                        }}
                        className="w-[160px]"
                    />
                </div>
                <div className="space-y-1">
                    <Label className="text-xs text-muted-foreground">To</Label>
                    <Input
                        type="date"
                        value={filters.endDate ? filters.endDate.slice(0, 10) : ""}
                        onChange={(e) => {
                            const val = e.target.value;
                            onFilterChange({
                                endDate: val ? `${val}T23:59:59.999Z` : "",
                            });
                        }}
                        className="w-[160px]"
                    />
                </div>

                {/* Clear filters */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                            onFilterChange({
                                category: "",
                                actor: "",
                                startDate: "",
                                endDate: "",
                            })
                        }
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-4 w-4 mr-1" />
                        Clear filters
                    </Button>
                )}

                {/* Export buttons */}
                {getExportUrl && (
                    <div className="ml-auto flex items-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <a
                                href={getExportUrl("csv")}
                                download
                                className="gap-1.5"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Export CSV
                            </a>
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            asChild
                        >
                            <a
                                href={getExportUrl("json")}
                                download
                                className="gap-1.5"
                            >
                                <Download className="h-3.5 w-3.5" />
                                Export JSON
                            </a>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
