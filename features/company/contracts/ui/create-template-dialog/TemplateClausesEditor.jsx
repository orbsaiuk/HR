"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DialogFieldError } from "./DialogFieldError";

export function TemplateClausesEditor({
  fields,
  append,
  remove,
  register,
  errors,
}) {
  return (
    <section className="space-y-3 rounded-md border border-[#E7EBF3] bg-[#FAFBFF] p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-base font-semibold text-[#1F2937] md:text-lg">
          بنود القالب
        </h3>
        <Button
          type="button"
          variant="outline"
          onClick={() => append({ text: "" })}
          className="h-8 w-full border-[#D4DBEA] px-3 text-sm md:text-base sm:w-auto"
        >
          <Plus className="h-3.5 w-3.5" />
          إضافة بند
        </Button>
      </div>

      <DialogFieldError message={errors.clauses?.message} />

      <div className="space-y-3">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="rounded-md border border-[#E4E8F2] bg-white p-3"
          >
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm md:text-base font-medium text-[#6B7280]">
                البند {index + 1}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-[#9AA3B6] hover:text-red-500"
                onClick={() => remove(index)}
                disabled={fields.length <= 1}
                aria-label="حذف البند"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Textarea
              rows={3}
              className="border-[#D8DFEC] text-right text-sm md:text-base"
              placeholder="اكتب نص البند"
              {...register(`clauses.${index}.text`)}
            />
            <DialogFieldError
              message={errors.clauses?.[index]?.text?.message}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
