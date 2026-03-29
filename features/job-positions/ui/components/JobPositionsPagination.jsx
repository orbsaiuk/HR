"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZE_OPTIONS } from "../../lib/jobPositionsFilters.constants";

export function JobPositionsPagination({
  currentPage,
  totalPages,
  pageNumbers,
  onPrevious,
  onNext,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage === 1}
          onClick={onPrevious}
          aria-label="الصفحة السابقة"
        >
          <ChevronRight size={16} />
        </Button>

        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={currentPage === pageNumber ? "default" : "outline"}
            size="icon"
            className="h-8 w-8"
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          variant="ghost"
          size="icon"
          disabled={currentPage >= totalPages}
          onClick={onNext}
          aria-label="الصفحة التالية"
        >
          <ChevronLeft size={16} />
        </Button>
      </div>

      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span>عدد البطاقات</span>
        <Select value={String(pageSize)} onValueChange={onPageSizeChange}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PAGE_SIZE_OPTIONS.map((option) => (
              <SelectItem key={option} value={String(option)}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
