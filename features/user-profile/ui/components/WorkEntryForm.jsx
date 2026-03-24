"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { workEntrySchema, workEntryDefaults } from "../schemas/workEntrySchema";

function toValidDate(dateValue) {
  if (!dateValue) return undefined;
  if (dateValue instanceof Date) {
    return isValid(dateValue) ? dateValue : undefined;
  }
  if (typeof dateValue === "string") {
    const parsed = parseISO(dateValue);
    return isValid(parsed) ? parsed : undefined;
  }
  const parsed = new Date(dateValue);
  return isValid(parsed) ? parsed : undefined;
}

/**
 * Inline form for adding/editing a single work experience entry.
 * Uses a <div> instead of <form> to avoid nested form submission
 * which would trigger the parent profile form.
 */
export function WorkEntryForm({ entry = {}, onSave, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(workEntrySchema),
    defaultValues: entry?._key ? { ...entry } : workEntryDefaults,
  });

  const isCurrent = watch("isCurrent");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const selectedStartDate = useMemo(() => toValidDate(startDate), [startDate]);
  const selectedEndDate = useMemo(() => toValidDate(endDate), [endDate]);

  function handleStartDateSelect(date) {
    setValue("startDate", date ? format(date, "yyyy-MM-dd") : "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  function handleEndDateSelect(date) {
    setValue("endDate", date ? format(date, "yyyy-MM-dd") : "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  const onInternalSubmit = (e) => {
    // Prevent the event from reaching the parent <form>
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSave)(e);
  };

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/40 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="work-title">
            المسمى الوظيفي <span className="text-destructive">*</span>
          </Label>
          <Input
            id="work-title"
            {...register("title")}
            placeholder="مثال: مهندس برمجيات"
          />
          {errors.title && (
            <p className="text-xs text-destructive">{errors.title.message}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="work-company">
            الشركة <span className="text-destructive">*</span>
          </Label>
          <Input
            id="work-company"
            {...register("company")}
            placeholder="مثال: جوجل"
          />
          {errors.company && (
            <p className="text-xs text-destructive">{errors.company.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="work-start">
            تاريخ البداية <span className="text-destructive">*</span>
          </Label>
          <input type="hidden" id="work-start" {...register("startDate")} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                dir="ltr"
                className={cn(
                  "w-full justify-between font-normal",
                  !selectedStartDate && "text-muted-foreground",
                )}
              >
                <span className="ms-auto text-right">
                  {selectedStartDate
                    ? format(selectedStartDate, "yyyy-MM-dd")
                    : "اختر تاريخ البداية"}
                </span>
                <CalendarIcon className="opacity-70" size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedStartDate}
                onSelect={handleStartDateSelect}
                captionLayout="dropdown"
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && (
            <p className="text-xs text-destructive">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="work-end">تاريخ النهاية</Label>
          <input type="hidden" id="work-end" {...register("endDate")} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                dir="ltr"
                disabled={isCurrent}
                className={cn(
                  "w-full justify-between font-normal",
                  !selectedEndDate && "text-muted-foreground",
                )}
              >
                <span className="ms-auto text-right">
                  {selectedEndDate
                    ? format(selectedEndDate, "yyyy-MM-dd")
                    : "اختر تاريخ النهاية"}
                </span>
                <CalendarIcon className="opacity-70" size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedEndDate}
                onSelect={handleEndDateSelect}
                captionLayout="dropdown"
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          {...register("isCurrent")}
          type="checkbox"
          className="rounded border-input h-4 w-4"
        />
        أعمل هنا حالياً
      </label>

      <div className="space-y-1.5">
        <Label htmlFor="work-desc">الوصف</Label>
        <Textarea
          id="work-desc"
          {...register("description")}
          rows={3}
          placeholder="صف مسؤولياتك وإنجازاتك..."
        />
      </div>

      <div className="flex justify-start gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          إلغاء
        </Button>
        <Button type="button" size="sm" onClick={onInternalSubmit}>
          حفظ
        </Button>
      </div>
    </div>
  );
}
