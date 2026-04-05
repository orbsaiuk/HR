"use client";

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
import {
  PROJECT_CATEGORY_OPTIONS,
  PROJECT_STATUS_OPTIONS,
} from "../../../model/companyProjectsSchema";
import { COMPANY_PROJECTS_ALL_FILTER } from "../../../model/useCompanyProjectsFilters";

export function CompanyProjectsFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  hasActiveFilters,
  onClearFilters,
  resultCount,
}) {
  return (
    <section className="rounded-sm border border-[#E6EAF2] bg-white p-4">
      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-[#5E667A]">عدد النتائج: {resultCount}</p>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="w-full sm:w-auto"
          >
            مسح الفلاتر
          </Button>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="relative">
            <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#96A0B5]" />
            <Input
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="ابحث بالاسم أو الوصف أو الموقع"
              className="h-10 border-[#E6EAF2] pr-10"
            />
          </div>
        </div>

        <div>
          <Select value={statusFilter} onValueChange={onStatusChange} dir="rtl">
            <SelectTrigger className="h-10 border-[#E6EAF2]">
              <SelectValue placeholder="فلترة حسب الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={COMPANY_PROJECTS_ALL_FILTER}>
                كل الحالات
              </SelectItem>
              {PROJECT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={categoryFilter}
            onValueChange={onCategoryChange}
            dir="rtl"
          >
            <SelectTrigger className="h-10 border-[#E6EAF2]">
              <SelectValue placeholder="فلترة حسب التصنيف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={COMPANY_PROJECTS_ALL_FILTER}>
                كل التصنيفات
              </SelectItem>
              {PROJECT_CATEGORY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
}
