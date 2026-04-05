"use client";

import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
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

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-xs text-red-500">{error}</p>;
}

export function CreateProjectForm({
  register,
  control,
  errors,
  isSubmitting,
  onSubmit,
  onCancel,
  submitLabel = "إضافة المشروع",
  submittingLabel = "جارٍ الحفظ...",
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="project-title">اسم المشروع</Label>
          <Input
            id="project-title"
            placeholder="مثال: تطوير تطبيق موبايل للمتجر الإلكتروني"
            {...register("title")}
            className="mt-2"
          />
          <FieldError error={errors.title?.message} />
        </div>

        <div>
          <Label htmlFor="project-location">الموقع</Label>
          <Input
            id="project-location"
            placeholder="مثال: الرياض، السعودية"
            {...register("location")}
            className="mt-2"
          />
          <FieldError error={errors.location?.message} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="project-category">التصنيف</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
                dir="rtl"
              >
                <SelectTrigger id="project-category" className="mt-2">
                  <SelectValue placeholder="اختر التصنيف" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORY_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError error={errors.category?.message} />
        </div>

        <div>
          <Label htmlFor="project-status">الحالة</Label>
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
                dir="rtl"
              >
                <SelectTrigger id="project-status" className="mt-2">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  {PROJECT_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError error={errors.status?.message} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 lg:col-span-1">
          <Label htmlFor="project-duration">المدة المتوقعة</Label>
          <Input
            id="project-duration"
            placeholder="مثال: 2-4 أسابيع"
            {...register("duration")}
            className="mt-2"
          />
          <FieldError error={errors.duration?.message} />
        </div>

        <div>
          <Label htmlFor="project-budget-min">الميزانية من ($)</Label>
          <Input
            id="project-budget-min"
            type="number"
            min={100}
            step={100}
            {...register("budgetMin")}
            className="mt-2"
          />
          <FieldError error={errors.budgetMin?.message} />
        </div>

        <div>
          <Label htmlFor="project-budget-max">الميزانية إلى ($)</Label>
          <Input
            id="project-budget-max"
            type="number"
            min={100}
            step={100}
            {...register("budgetMax")}
            className="mt-2"
          />
          <FieldError error={errors.budgetMax?.message} />
        </div>
      </div>

      <div>
        <Label htmlFor="project-description">وصف المشروع</Label>
        <Textarea
          id="project-description"
          rows={4}
          placeholder="اكتب وصفاً واضحاً لمتطلبات المشروع ونطاق العمل"
          {...register("description")}
          className="mt-2"
        />
        <FieldError error={errors.description?.message} />
      </div>

      <DialogFooter className="gap-2 sm:justify-start sm:space-x-0">
        <Button type="button" variant="outline" onClick={onCancel}>
          إلغاء
        </Button>
        <Button
          type="submit"
          className="bg-[#5338D5] hover:bg-[#462EA8]"
          disabled={isSubmitting}
        >
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      </DialogFooter>
    </form>
  );
}
