"use client";

import Image from "next/image";
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "../shared/FieldError";

export function PortfolioEditorSection({
  previewsById,
  onFileChange,
  onRemoveProject,
}) {
  const {
    control,
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "portfolioProjects",
  });

  useEffect(() => {
    fields.forEach((field, index) => {
      setValue(`portfolioProjects.${index}.fieldId`, field.id, {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      });
    });
  }, [fields, setValue]);

  function addProject() {
    append({
      _key: undefined,
      title: "",
      link: "",
      image: null,
      imageUrl: "",
      fieldId: "",
    });
  }

  function removeProject(index, fieldId) {
    onRemoveProject?.(index, fieldId);
    remove(index);
  }

  return (
    <div className="space-y-4">
      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
          <p className="font-bold text-slate-700">معرض الأعمال فارغ</p>
          <p className="mt-1 text-sm text-slate-500">
            أضف عملاً سابقاً مع صورة أو رابط لزيادة الثقة.
          </p>
          <Button
            type="button"
            className="mt-4 rounded-xl"
            onClick={addProject}
          >
            <Plus className="h-4 w-4" />
            إضافة أول عمل
          </Button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={addProject}
        >
          <Plus className="h-4 w-4" />
          إضافة عمل
        </Button>
      )}

      {fields.map((field, index) => {
        const previewSrc = previewsById[field.id] || field.imageUrl;

        return (
          <div
            key={field.id}
            className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-black text-slate-700">
                  عمل {index + 1}
                </p>
                <p className="mt-1 break-words text-xs text-slate-400">
                  {field.title?.trim() || "أضف عنواناً للعمل"}
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                aria-label={`حذف العمل ${index + 1}`}
                onClick={() => removeProject(index, field.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>عنوان العمل</Label>
                <Input {...register(`portfolioProjects.${index}.title`)} />
                <FieldError>
                  {errors.portfolioProjects?.[index]?.title?.message}
                </FieldError>
              </div>
              <div className="space-y-2">
                <Label>رابط العمل</Label>
                <Input
                  dir="ltr"
                  placeholder="https://example.com"
                  {...register(`portfolioProjects.${index}.link`)}
                />
                <FieldError>
                  {errors.portfolioProjects?.[index]?.link?.message}
                </FieldError>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
                {previewSrc ? (
                  <Image
                    src={previewSrc}
                    alt={field.title || "صورة العمل"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-xs font-medium">بدون صورة</span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>صورة العمل</Label>
                <Input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => {
                    onFileChange?.(field.id, index, event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
                <p className="text-xs text-slate-400">
                  الصيغ المدعومة JPG/PNG/WEBP/GIF، والحد الأقصى 5MB.
                </p>
                <FieldError>
                  {errors.portfolioProjects?.[index]?.image?.message}
                </FieldError>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
