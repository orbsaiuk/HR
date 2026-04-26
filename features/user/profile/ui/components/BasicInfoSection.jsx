"use client";

import { format, isValid, parseISO } from "date-fns";
import { useFormContext } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { User, Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { FormField } from "./FormField";
import { useMemo } from "react";

/**
 * Basic Information section — name, phone, headline, bio, location, dateOfBirth.
 * Uses shadcn Input, Textarea, and Label components.
 * Must be used within a react-hook-form FormProvider.
 */
export function BasicInfoSection() {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const dateOfBirth = watch("dateOfBirth");
  const selectedDate = useMemo(() => {
    if (!dateOfBirth) return undefined;
    if (dateOfBirth instanceof Date) {
      return isValid(dateOfBirth) ? dateOfBirth : undefined;
    }
    if (typeof dateOfBirth === "string") {
      const parsed = parseISO(dateOfBirth);
      return isValid(parsed) ? parsed : undefined;
    }
    return undefined;
  }, [dateOfBirth]);

  function handleDateSelect(date) {
    setValue("dateOfBirth", date ? format(date, "yyyy-MM-dd") : "", {
      shouldValidate: true,
      shouldDirty: true,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <User size={18} />
          المعلومات الأساسية
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            label="الاسم الكامل"
            error={errors.name}
            required
            htmlFor="name"
          >
            <Input id="name" {...register("name")} placeholder="اسمك الكامل" />
          </FormField>
          <FormField label="الهاتف" error={errors.phone} htmlFor="phone">
            <Input
              id="phone"
              {...register("phone")}
              type="tel"
              dir="ltr"
              className="text-right"
              placeholder="+966 5XX XXX XXXX"
            />
          </FormField>
        </div>

        <FormField
          label="العنوان المهني"
          error={errors.headline}
          htmlFor="headline"
        >
          <Input
            id="headline"
            {...register("headline")}
            placeholder="مثال: مهندس برمجيات أول"
          />
        </FormField>

        <FormField label="النبذة التعريفية" error={errors.bio} htmlFor="bio">
          <Textarea
            id="bio"
            {...register("bio")}
            rows={4}
            placeholder="أخبرنا عن نفسك..."
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="الموقع" error={errors.location} htmlFor="location">
            <Input
              id="location"
              {...register("location")}
              placeholder="المدينة، الدولة"
            />
          </FormField>
          <FormField
            label="تاريخ الميلاد"
            error={errors.dateOfBirth}
            htmlFor="dateOfBirth"
          >
            <input
              type="hidden"
              id="dateOfBirth"
              {...register("dateOfBirth")}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  dir="ltr"
                  className={cn(
                    "w-full justify-between font-normal",
                    !selectedDate && "text-muted-foreground",
                  )}
                >
                  <span className="ms-auto text-right">
                    {selectedDate
                      ? format(selectedDate, "yyyy-MM-dd")
                      : "اختر تاريخ الميلاد"}
                  </span>
                  <CalendarIcon className="opacity-70" size={16} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateSelect}
                  captionLayout="dropdown"
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormField>
        </div>
      </CardContent>
    </Card>
  );
}
