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

export function FormsFilters({ filters, onFiltersChange, resultCount = 0 }) {
  const { search, sortBy, sortOrder } = filters;
  const hasActiveFilters =
    search.trim().length > 0 || sortBy !== "updatedAt" || sortOrder !== "desc";

  const handleSortChange = (value) => {
    const [field, order] = value.split("-");
    onFiltersChange.setSortBy(field);
    onFiltersChange.setSortOrder(order);
  };

  const handleReset = () => {
    onFiltersChange.setSearch("");
    onFiltersChange.setSortBy("updatedAt");
    onFiltersChange.setSortOrder("desc");
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4" dir="rtl">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
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
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
            dir="rtl"
          >
            <SelectTrigger>
              <SelectValue placeholder="ترتيب النتائج" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updatedAt-desc">الأحدث تحديثاً</SelectItem>
              <SelectItem value="updatedAt-asc">الأقدم تحديثاً</SelectItem>
              <SelectItem value="createdAt-desc">الأحدث إنشاءً</SelectItem>
              <SelectItem value="createdAt-asc">الأقدم إنشاءً</SelectItem>
              <SelectItem value="title-asc">الاسم (أ - ي)</SelectItem>
              <SelectItem value="title-desc">الاسم (ي - أ)</SelectItem>
              <SelectItem value="responseCount-desc">الأكثر استجابة</SelectItem>
              <SelectItem value="responseCount-asc">الأقل استجابة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 text-xs text-slate-500">
        <span>عدد النتائج: {resultCount}</span>
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
