"use client";

import { Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "./FieldError";

export function ServicesEditorSection() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "services",
  });

  function addService() {
    append({
      _key: undefined,
      title: "",
      description: "",
      price: "",
      deliveryTime: "",
    });
  }

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
          <p className="font-bold text-slate-700">لا توجد خدمات بعد</p>
          <p className="mt-1 text-sm text-slate-500">
            ابدأ بخدمة واضحة تساعد العميل على فهم ما تقدمه.
          </p>
          <Button
            type="button"
            className="mt-4 rounded-xl"
            onClick={addService}
          >
            <Plus className="h-4 w-4" />
            إضافة أول خدمة
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={addService}
        >
          <Plus className="h-4 w-4" />
          إضافة خدمة
        </Button>
      )}

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm font-black text-slate-700">
                خدمة {index + 1}
              </p>
              <p className="mt-1 break-words text-xs text-slate-400">
                {field.title?.trim() || "أضف عنواناً واضحاً للخدمة"}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
              aria-label={`حذف الخدمة ${index + 1}`}
              onClick={() => remove(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>عنوان الخدمة</Label>
              <Input {...register(`services.${index}.title`)} />
              <FieldError>
                {errors.services?.[index]?.title?.message}
              </FieldError>
            </div>
            <div className="space-y-2">
              <Label>مدة التسليم</Label>
              <Input
                placeholder="مثال: 3 أيام"
                {...register(`services.${index}.deliveryTime`)}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>السعر</Label>
              <Input
                type="number"
                min="0"
                {...register(`services.${index}.price`)}
              />
              <FieldError>
                {errors.services?.[index]?.price?.message}
              </FieldError>
            </div>
            <div className="space-y-2">
              <Label>الوصف</Label>
              <Textarea
                rows={2}
                {...register(`services.${index}.description`)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
