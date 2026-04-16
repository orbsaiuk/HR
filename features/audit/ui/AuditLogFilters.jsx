"use client";

import { format, isValid, parseISO } from "date-fns";
import { ar } from "date-fns/locale";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUDIT_LOG_CATEGORIES } from "./auditLogCategories";

function toValidDate(value) {
  if (!value) return undefined;
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : undefined;
}

function toStartOfDayIso(date) {
  const start = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    0,
    0,
    0,
    0,
  );
  return start.toISOString();
}

function toEndOfDayIso(date) {
  const end = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999,
  );
  return end.toISOString();
}

export function AuditLogFilters({ filters, onFilterChange, getExportUrl }) {
  const hasActiveFilters =
    filters.category || filters.actor || filters.startDate || filters.endDate;
  const selectedStartDate = toValidDate(filters.startDate);
  const selectedEndDate = toValidDate(filters.endDate);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3 flex-wrap">
        {/* Category filter */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">التصنيف</Label>
          <Select
            dir="rtl"
            value={filters.category || "all"}
            onValueChange={(value) =>
              onFilterChange({ category: value === "all" ? "" : value })
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="كل التصنيفات" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل التصنيفات</SelectItem>
              {AUDIT_LOG_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date range filter */}
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">من</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-between text-right font-normal",
                  !selectedStartDate && "text-muted-foreground",
                )}
                dir="rtl"
              >
                <span>
                  {selectedStartDate
                    ? format(selectedStartDate, "PPP", { locale: ar })
                    : "اختر التاريخ"}
                </span>
                <CalendarIcon className="h-4 w-4 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" dir="rtl">
              <Calendar
                mode="single"
                selected={selectedStartDate}
                onSelect={(date) =>
                  onFilterChange({
                    startDate: date ? toStartOfDayIso(date) : "",
                  })
                }
                locale={ar}
                captionLayout="dropdown"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">إلى</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[160px] justify-between text-right font-normal",
                  !selectedEndDate && "text-muted-foreground",
                )}
                dir="rtl"
              >
                <span>
                  {selectedEndDate
                    ? format(selectedEndDate, "PPP", { locale: ar })
                    : "اختر التاريخ"}
                </span>
                <CalendarIcon className="h-4 w-4 opacity-70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start" dir="rtl">
              <Calendar
                mode="single"
                selected={selectedEndDate}
                onSelect={(date) =>
                  onFilterChange({ endDate: date ? toEndOfDayIso(date) : "" })
                }
                locale={ar}
                captionLayout="dropdown"
                initialFocus
              />
            </PopoverContent>
          </Popover>
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
            مسح الفلاتر
          </Button>
        )}

        {/* Export buttons */}
        {getExportUrl && (
          <div className="ml-auto flex items-end gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={getExportUrl("csv")} download className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                تصدير CSV
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={getExportUrl("json")} download className="gap-1.5">
                <Download className="h-3.5 w-3.5" />
                تصدير JSON
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
