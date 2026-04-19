"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FieldError } from "./FieldError";

export function DatePickerField({
  label,
  inputId,
  fieldName,
  register,
  selectedDate,
  onSelectDate,
  disabled = false,
  placeholder,
  disabledPlaceholder,
  minDate,
  error,
}) {
  function isDateDisabled(date) {
    if (disabled) return true;
    if (!minDate) return false;
    return date.getTime() < minDate.getTime();
  }

  const displayValue = disabled
    ? disabledPlaceholder
    : selectedDate
      ? format(selectedDate, "yyyy-MM-dd")
      : placeholder;

  return (
    <div>
      <Label htmlFor={inputId} className="text-sm text-[#344054]">
        {label}
      </Label>
      <input type="hidden" id={inputId} {...register(fieldName)} />

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            dir="ltr"
            disabled={disabled}
            className={cn(
              "mt-2 h-10 w-full justify-between border-[#D8DFEC] text-right font-normal",
              !selectedDate && "text-muted-foreground",
              disabled && "cursor-not-allowed opacity-60",
            )}
          >
            <span className="ms-auto text-right">{displayValue}</span>
            <CalendarIcon className="h-4 w-4 opacity-70" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={onSelectDate}
            disabled={isDateDisabled}
            captionLayout="dropdown"
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <FieldError message={error} />
    </div>
  );
}
