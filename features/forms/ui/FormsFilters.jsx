/**
 * Forms filters component
 * Search, status filter, and sorting controls
 */

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function FormsFilters({
  filters,
  onFiltersChange,
  resultCount = 0,
  rangeStart = 0,
  rangeEnd = 0,
}) {
  const { search, status, sortBy, sortOrder } = filters;
  const hasActiveFilters =
    search.trim().length > 0 ||
    status !== "all" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";
  const visibleRangeText =
    resultCount > 0
      ? `عرض ${rangeStart}-${rangeEnd} من ${resultCount}`
      : "عدد النتائج: 0";

  const handleSortChange = (value) => {
    const [field, order] = value.split("-");
    onFiltersChange.setSortBy(field);
    onFiltersChange.setSortOrder(order);
  };

  const handleReset = () => {
    onFiltersChange.setSearch("");
    onFiltersChange.setStatus("all");
    onFiltersChange.setSortBy("createdAt");
    onFiltersChange.setSortOrder("desc");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4" dir="rtl">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <Input
            type="text"
            placeholder="ابحث باسم النموذج أو الوصف..."
            value={search}
            onChange={(e) => onFiltersChange.setSearch(e.target.value)}
            className="pr-10"
          />
        </div>

        <div>
          <Select
            value={status}
            onValueChange={onFiltersChange.setStatus}
            dir="rtl"
          >
            <SelectTrigger>
              <SelectValue placeholder="حالة النموذج" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الحالات</SelectItem>
              <SelectItem value="published">منشور</SelectItem>
              <SelectItem value="draft">مسودة</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
            dir="rtl"
          >
            <SelectTrigger>
              <SelectValue placeholder="ترتيب النتائج" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">الأحدث</SelectItem>
              <SelectItem value="createdAt-asc">الأقدم</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>{visibleRangeText}</span>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2"
            onClick={handleReset}
          >
            إعادة الضبط
          </Button>
        )}
      </div>
    </div>
  );
}
