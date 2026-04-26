"use client";

import { CalendarDays, Clock, User, Tag, FileText } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const APPOINTMENT_TYPES = [
  { value: "interview", label: "مقابلة" },
  { value: "meeting", label: "اجتماع" },
  { value: "reminder", label: "تذكير" },
  { value: "task", label: "مهمة" },
  { value: "other", label: "أخرى" },
];

const TIME_OPTIONS = Array.from({ length: 24 }, (_, h) => [
  { value: `${String(h).padStart(2, "0")}:00`, label: `${String(h).padStart(2, "0")}:00` },
  { value: `${String(h).padStart(2, "0")}:30`, label: `${String(h).padStart(2, "0")}:30` },
]).flat();

export function FormField({ label, icon: Icon, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-[#4C556A] flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-[#7B68D8]" />}
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-red-500 mt-0.5">{error}</p>
      )}
    </div>
  );
}

const formSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  type: z.string().min(1, "نوع الموعد مطلوب"),
  person: z.string().optional(),
  date: z.string().min(1, "التاريخ مطلوب"),
  startTime: z.string().min(1, "وقت البداية مطلوب"),
  endTime: z.string().optional(),
  notes: z.string().optional(),
});

export function CreateAppointmentForm({ onSubmit, onCancel }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      person: "",
      date: "",
      startTime: "",
      endTime: "",
      notes: "",
    },
  });

  async function handleValidSubmit(data) {
    try {
      await onSubmit?.(data);
      reset();
    } catch (error) {
      console.error(error);
    }
  }

  function handleCancel() {
    reset();
    onCancel?.();
  }

  return (
    <form onSubmit={handleSubmit(handleValidSubmit)} noValidate>
      <div className="px-6 py-5 flex flex-col gap-4">
        {/* Title */}
        <FormField label="عنوان الموعد" icon={FileText} error={errors.title?.message}>
          <Input
            id="appointment-title"
            placeholder="مثال: مقابلة مطور React"
            {...register("title")}
            className={cn(
              "h-10 text-sm text-right placeholder:text-[#C2C7D6] border-[#E2E5EF] focus-visible:ring-[#5B4AE4]/30 focus-visible:border-[#5B4AE4] transition-colors",
              errors.title && "border-red-400 focus-visible:ring-red-200"
            )}
          />
        </FormField>

        {/* Type + Person */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="نوع الموعد" icon={Tag} error={errors.type?.message}>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} dir="rtl">
                  <SelectTrigger
                    id="appointment-type"
                    className={cn(
                      "h-10 text-sm text-right border-[#E2E5EF] focus:ring-[#5B4AE4]/30 focus:border-[#5B4AE4] transition-colors",
                      errors.type && "border-red-400"
                    )}
                  >
                    <SelectValue placeholder="اختر النوع" />
                  </SelectTrigger>
                  <SelectContent>
                    {APPOINTMENT_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField label="الشخص المعني" icon={User} error={errors.person?.message}>
            <Input
              id="appointment-person"
              placeholder="مثال: أحمد محمد"
              {...register("person")}
              className="h-10 text-sm text-right placeholder:text-[#C2C7D6] border-[#E2E5EF] focus-visible:ring-[#5B4AE4]/30 focus-visible:border-[#5B4AE4] transition-colors"
            />
          </FormField>
        </div>

        {/* Date */}
        <FormField label="التاريخ" icon={CalendarDays} error={errors.date?.message}>
          <Input
            id="appointment-date"
            type="date"
            {...register("date")}
            className={cn(
              "h-10 text-sm border-[#E2E5EF] focus-visible:ring-[#5B4AE4]/30 focus-visible:border-[#5B4AE4] transition-colors",
              errors.date && "border-red-400 focus-visible:ring-red-200"
            )}
          />
        </FormField>

        {/* Time Range */}
        <div className="grid grid-cols-2 gap-3">
          <FormField label="وقت البداية" icon={Clock} error={errors.startTime?.message}>
            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} dir="rtl">
                  <SelectTrigger
                    id="appointment-start-time"
                    className={cn(
                      "h-10 text-sm text-right border-[#E2E5EF] focus:ring-[#5B4AE4]/30 focus:border-[#5B4AE4] transition-colors",
                      errors.startTime && "border-red-400"
                    )}
                  >
                    <SelectValue placeholder="--:--" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {TIME_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>

          <FormField label="وقت النهاية" icon={Clock} error={errors.endTime?.message}>
            <Controller
              control={control}
              name="endTime"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange} dir="rtl">
                  <SelectTrigger
                    id="appointment-end-time"
                    className="h-10 text-sm text-right border-[#E2E5EF] focus:ring-[#5B4AE4]/30 focus:border-[#5B4AE4] transition-colors"
                  >
                    <SelectValue placeholder="--:--" />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {TIME_OPTIONS.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </FormField>
        </div>

        {/* Notes */}
        <FormField label="ملاحظات (اختياري)" icon={FileText} error={errors.notes?.message}>
          <textarea
            id="appointment-notes"
            rows={3}
            placeholder="أي تفاصيل إضافية..."
            {...register("notes")}
            className="w-full rounded-md border border-[#E2E5EF] bg-transparent px-3 py-2 text-sm text-right placeholder:text-[#C2C7D6] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#5B4AE4]/30 focus-visible:border-[#5B4AE4] transition-colors resize-none shadow-sm"
          />
        </FormField>
      </div>

      {/* Footer */}
      <div className="flex flex-row-reverse gap-2 px-6 pb-6 pt-2 border-t border-[#F0F1F7]">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 h-10 bg-[#5B4AE4] hover:bg-[#4A3BC0] text-white font-semibold text-sm rounded-lg shadow-[0_2px_8px_rgba(91,74,228,0.3)] transition-all disabled:opacity-60"
        >
          {isSubmitting ? "جارٍ الحفظ..." : "حفظ الموعد"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          className="h-10 px-5 border-[#E2E5EF] text-[#6D7488] hover:bg-[#F3F5FA] font-medium text-sm rounded-lg"
        >
          إلغاء
        </Button>
      </div>
    </form>
  );
}
