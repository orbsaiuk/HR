"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CalendarDays,
  Clock3,
  FileText,
  Flag,
  Tag,
  X,
  FolderKanban,
} from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormField } from "@/features/company/calendar/components/CreateAppointmentForm";
import {
  FREELANCER_EVENT_TYPES,
  FREELANCER_PRIORITY_OPTIONS,
} from "./freelancerCalendarConfig";

const TIME_OPTIONS = Array.from({ length: 24 }, (_, hour) => [
  {
    value: `${String(hour).padStart(2, "0")}:00`,
    label: `${String(hour).padStart(2, "0")}:00`,
  },
  {
    value: `${String(hour).padStart(2, "0")}:30`,
    label: `${String(hour).padStart(2, "0")}:30`,
  },
]).flat();

const reminderFormSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  type: z.string().min(1, "نوع التذكير مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  time: z.string().min(1, "الوقت مطلوب"),
  priority: z.string().min(1, "الأولوية مطلوبة"),
  projectName: z.string().optional(),
  notes: z.string().optional(),
});

const defaultValues = {
  title: "",
  type: "",
  date: "",
  time: "",
  priority: "",
  projectName: "",
  notes: "",
};

export function CreateReminderDialog({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  mode = "create",
}) {
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reminderFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;

    reset({
      ...defaultValues,
      ...initialValues,
    });
  }, [open, initialValues, reset]);

  function handleClose() {
    onOpenChange(false);
  }

  async function handleValidSubmit(values) {
    await onSubmit?.(values);
    handleClose();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        dir="rtl"
        className="max-h-[90vh] overflow-y-auto p-0 sm:max-w-[560px] [&>button:last-child]:hidden"
      >
        <DialogHeader className="border-b border-[#F0F1F7] px-6 pb-4 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-content-center rounded-xl bg-[#EDE9FD]">
                <CalendarDays className="h-5 w-5 text-[#5B4AE4]" />
              </div>
              <div className="text-right">
                <DialogTitle className="text-[17px] font-bold text-[#2F3646]">
                  {mode === "edit" ? "تعديل التذكير" : "إضافة تذكير جديد"}
                </DialogTitle>
                <p className="mt-0.5 text-xs text-[#9AA1B3]">
                  أدخل تفاصيل الموعد المرتبط بالمشروع أو التذكير الشخصي
                </p>
              </div>
            </div>
            <DialogClose asChild>
              <button
                type="button"
                onClick={handleClose}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#9AA1B3] transition-colors hover:bg-[#F3F5FA] hover:text-[#4C556A]"
                aria-label="إغلاق"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogClose>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleValidSubmit)} noValidate>
          <div className="flex flex-col gap-4 px-6 py-5">
            <FormField label="عنوان التذكير" icon={FileText} error={errors.title?.message}>
              <Input
                placeholder="مثال: مراجعة الملف النهائي قبل التسليم"
                {...register("title")}
                className={cn(
                  "h-10 text-right placeholder:text-[#C2C7D6]",
                  errors.title && "border-red-400 focus-visible:ring-red-200",
                )}
              />
            </FormField>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="نوع التذكير" icon={Tag} error={errors.type?.message}>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} dir="rtl">
                      <SelectTrigger
                        className={cn(
                          "h-10 text-right",
                          errors.type && "border-red-400",
                        )}
                      >
                        <SelectValue placeholder="اختر النوع" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREELANCER_EVENT_TYPES.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>

              <FormField label="الأولوية" icon={Flag} error={errors.priority?.message}>
                <Controller
                  control={control}
                  name="priority"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} dir="rtl">
                      <SelectTrigger
                        className={cn(
                          "h-10 text-right",
                          errors.priority && "border-red-400",
                        )}
                      >
                        <SelectValue placeholder="اختر الأولوية" />
                      </SelectTrigger>
                      <SelectContent>
                        {FREELANCER_PRIORITY_OPTIONS.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="التاريخ" icon={CalendarDays} error={errors.date?.message}>
                <Input
                  type="date"
                  {...register("date")}
                  className={cn("h-10", errors.date && "border-red-400")}
                />
              </FormField>

              <FormField label="الوقت" icon={Clock3} error={errors.time?.message}>
                <Controller
                  control={control}
                  name="time"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange} dir="rtl">
                      <SelectTrigger
                        className={cn(
                          "h-10 text-right",
                          errors.time && "border-red-400",
                        )}
                      >
                        <SelectValue placeholder="--:--" />
                      </SelectTrigger>
                      <SelectContent className="max-h-48">
                        {TIME_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </FormField>
            </div>

            <FormField
              label="المشروع المرتبط (اختياري)"
              icon={FolderKanban}
              error={errors.projectName?.message}
            >
              <Input
                placeholder="مثال: تطوير لوحة إدارة العميل"
                {...register("projectName")}
                className="h-10 text-right placeholder:text-[#C2C7D6]"
              />
            </FormField>

            <FormField label="ملاحظات (اختياري)" icon={FileText} error={errors.notes?.message}>
              <Textarea
                rows={3}
                placeholder="أي تفاصيل إضافية..."
                {...register("notes")}
                className="resize-none text-right placeholder:text-[#C2C7D6]"
              />
            </FormField>
          </div>

          <div className="flex flex-row-reverse gap-2 border-t border-[#F0F1F7] px-6 pb-6 pt-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-10 flex-1 rounded-lg bg-[#5B4AE4] text-sm font-semibold text-white shadow-[0_2px_8px_rgba(91,74,228,0.3)] hover:bg-[#4A3BC0] disabled:opacity-60"
            >
              {isSubmitting
                ? "جارٍ الحفظ..."
                : mode === "edit"
                  ? "حفظ التعديلات"
                  : "حفظ التذكير"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="h-10 rounded-lg border-[#E2E5EF] px-5 text-sm font-medium text-[#6D7488] hover:bg-[#F3F5FA]"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
