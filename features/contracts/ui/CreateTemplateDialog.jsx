"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CONTRACT_TYPE_VALUES } from "../model/contractSchema";
import { DialogFieldError } from "./create-template-dialog/DialogFieldError";
import { TemplateClausesEditor } from "./create-template-dialog/TemplateClausesEditor";
import { useCreateTemplateDialogForm } from "./create-template-dialog/useCreateTemplateDialogForm";

export function CreateTemplateDialog({
  open,
  onOpenChange,
  onTemplateCreated,
}) {
  const {
    register,
    errors,
    isSubmitting,
    selectedType,
    fields,
    append,
    remove,
    handleTypeChange,
    handleDialogChange,
    handleSubmitForm,
  } = useCreateTemplateDialogForm({
    open,
    onOpenChange,
    onTemplateCreated,
  });

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        dir="rtl"
        className="max-h-[92vh] w-[96vw] overflow-y-auto border-[#E4E8F2] p-4 sm:max-w-3xl sm:p-5 [&>button:last-child]:hidden"
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 h-8 w-8 rounded-sm text-[#6B7280] hover:text-[#1F2937]"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold leading-tight text-[#1F2937] sm:text-2xl lg:text-3xl">
            إنشاء قالب جديد
          </DialogTitle>
          <DialogDescription className="text-right text-sm md:text-base leading-6 text-[#6B7280] md:leading-7">
            اختر نوع العقد وأعد تخصيص البنود ليكون القالب جاهزاً للاستخدام
            والإرسال.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={handleSubmitForm}>
          <div>
            <Label
              htmlFor="template-title"
              className="text-sm md:text-base text-[#344054]"
            >
              عنوان القالب
            </Label>
            <Input
              id="template-title"
              className="mt-2 h-10 border-[#D8DFEC] text-right text-sm md:text-base"
              placeholder="مثال: عقد فريلانسر - تطوير تطبيق"
              {...register("title")}
            />
            <DialogFieldError message={errors.title?.message} />
          </div>

          <div>
            <Label
              htmlFor="template-description"
              className="text-sm md:text-base text-[#344054]"
            >
              وصف القالب (اختياري)
            </Label>
            <Textarea
              id="template-description"
              rows={3}
              className="mt-2 border-[#D8DFEC] text-right text-sm md:text-base"
              placeholder="وصف مختصر لمتى يتم استخدام هذا القالب"
              {...register("description")}
            />
            <DialogFieldError message={errors.description?.message} />
          </div>

          <div>
            <Label htmlFor="template-type" className="text-sm text-[#344054]">
              نوع العقد
            </Label>
            <input type="hidden" {...register("type")} />
            <Select
              dir="rtl"
              value={selectedType}
              onValueChange={handleTypeChange}
            >
              <SelectTrigger
                id="template-type"
                className="mt-2 h-10 border-[#D8DFEC]"
              >
                <SelectValue placeholder="اختر نوع العقد" />
              </SelectTrigger>
              <SelectContent>
                {CONTRACT_TYPE_VALUES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <DialogFieldError message={errors.type?.message} />
          </div>

          <TemplateClausesEditor
            fields={fields}
            append={append}
            remove={remove}
            register={register}
            errors={errors}
          />

          <DialogFooter className="gap-2 sm:flex-row sm:items-center sm:justify-between sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              className="min-w-24 border-[#111827] text-[#111827]"
              disabled={isSubmitting}
            >
              إلغاء
            </Button>

            <Button
              type="submit"
              className="min-w-24 bg-[#5338D5] hover:bg-[#462EA8]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جارٍ الحفظ..." : "حفظ القالب"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
