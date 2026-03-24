"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  educationEntrySchema,
  educationEntryDefaults,
} from "../schemas/educationEntrySchema";

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
 * Inline form for adding/editing a single education entry.
 * Uses a <div> instead of <form> to avoid nested form submission
 * which would trigger the parent profile form.
 */
export function EducationEntryForm({ entry = {}, onSave, onCancel }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(educationEntrySchema),
    defaultValues: entry?._key ? { ...entry } : educationEntryDefaults,
  });

  const onInternalSubmit = (e) => {
    // Prevent the event from reaching the parent <form>
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(onSave)(e);
  };

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

  return (
    <div className="space-y-4 rounded-lg border border-border bg-muted/40 p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edu-institution">
            المؤسسة التعليمية <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edu-institution"
            {...register("institution")}
            placeholder="مثال: جامعة القاهرة"
          />
          {errors.institution && (
            <p className="text-xs text-destructive">
              {errors.institution.message}
            </p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edu-degree">
            الدرجة العلمية <span className="text-destructive">*</span>
          </Label>
          <Input
            id="edu-degree"
            {...register("degree")}
            placeholder="مثال: بكالوريوس علوم"
          />
          {errors.degree && (
            <p className="text-xs text-destructive">{errors.degree.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="edu-field">التخصص</Label>
        <Input
          id="edu-field"
          {...register("fieldOfStudy")}
          placeholder="مثال: علوم الحاسب"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="edu-start">تاريخ البداية</Label>
          <input type="hidden" id="edu-start" {...register("startDate")} />
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
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="edu-end">تاريخ النهاية</Label>
          <input type="hidden" id="edu-end" {...register("endDate")} />
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                dir="ltr"
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
        <div className="space-y-1.5">
          <Label htmlFor="edu-grade">المعدل التراكمي</Label>
          <Input
            id="edu-grade"
            {...register("grade")}
            placeholder="مثال: 3.8"
          />
        </div>
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
