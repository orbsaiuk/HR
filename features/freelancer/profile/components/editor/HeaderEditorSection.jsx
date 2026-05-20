"use client";

import { Controller, useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/shared/hooks/useCategories";
import { FieldError } from "../shared/FieldError";

export function HeaderEditorSection() {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { categories, isLoading: categoriesLoading } = useCategories();

  const selectedCategoryTitle = watch("category");
  const selectedCategory = categories?.find(
    (c) => c.title === selectedCategoryTitle,
  );
  const subcategories = selectedCategory?.subcategories || [];

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">الاسم</Label>
        <Input id="name" {...register("name")} />
        <FieldError error={errors.name?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="headline">المسمى المهني</Label>
        <Input id="headline" {...register("headline")} />
        <FieldError error={errors.headline?.message} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="location">الموقع</Label>
        <Input id="location" {...register("location")} />
        <FieldError error={errors.location?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">التصنيف</Label>
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <Select
              value={field.value || undefined}
              onValueChange={(val) => {
                field.onChange(val);
                // Reset subcategory when category changes
                setValue("subcategory", "");
              }}
              dir="rtl"
              disabled={categoriesLoading}
            >
              <SelectTrigger id="category" className="w-full">
                {categoriesLoading ? (
                  <span className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    جاري التحميل...
                  </span>
                ) : (
                  <SelectValue placeholder="اختر التصنيف الرئيسي" />
                )}
              </SelectTrigger>
              <SelectContent dir="rtl" className="max-h-60">
                {categories?.map((cat) => (
                  <SelectItem key={cat._id || cat.slug} value={cat.title}>
                    {cat.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FieldError error={errors.category?.message} />
      </div>

      {subcategories.length > 0 && (
        <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
          <Label htmlFor="subcategory">التصنيف الفرعي</Label>
          <Controller
            control={control}
            name="subcategory"
            render={({ field }) => (
              <Select
                value={field.value || undefined}
                onValueChange={field.onChange}
                dir="rtl"
              >
                <SelectTrigger id="subcategory" className="w-full">
                  <SelectValue placeholder="اختر التصنيف الفرعي" />
                </SelectTrigger>
                <SelectContent dir="rtl" className="max-h-60">
                  {subcategories.map((sub) => (
                    <SelectItem key={sub.slug} value={sub.title}>
                      {sub.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          <FieldError error={errors.subcategory?.message} />
        </div>
      )}
    </div>
  );
}
