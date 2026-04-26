"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SORT_OPTIONS,
  STATUS_FILTERS,
  TYPE_FILTERS,
} from "../../lib/jobPositionsFilters.constants";

export function JobPositionsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  sortBy,
  onSortChange,
  resultCount,
  onReset,
}) {
  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    sortBy !== "newest";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <Input
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="ابحث بالعنوان أو الموقع..."
          className="bg-white"
        />

        <Select value={statusFilter} onValueChange={onStatusChange} dir="rtl">
          <SelectTrigger>
            <SelectValue placeholder="الحالة" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={typeFilter} onValueChange={onTypeChange} dir="rtl">
          <SelectTrigger>
            <SelectValue placeholder="نوع الوظيفة" />
          </SelectTrigger>
          <SelectContent>
            {TYPE_FILTERS.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={onSortChange} dir="rtl">
          <SelectTrigger>
            <SelectValue placeholder="ترتيب حسب" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
          <span>عدد النتائج: {resultCount}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={onReset}
          >
            إعادة الضبط
          </Button>
        </div>
      )}
    </div>
  );
}
