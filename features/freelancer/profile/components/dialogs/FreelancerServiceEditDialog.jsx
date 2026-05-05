"use client";

import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "../shared/FieldError";

const schema = z.object({
  title: z.string().trim().min(1, "عنوان الخدمة مطلوب."),
  description: z.string().trim().default(""),
});

export function FreelancerServiceEditDialog({
  open,
  onOpenChange,
  service,
  saving,
  onSave,
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: service?.title || "",
        description: service?.description || "",
      });
    }
  }, [open, service, reset]);

  const onSubmit = handleSubmit((values) => {
    onSave({
      ...service,
      ...values,
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" hideCloseButton className="sm:max-w-md">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          disabled={saving}
          className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:bg-slate-50 hover:text-slate-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-right">
            {service ? "تعديل الخدمة" : "إضافة خدمة"}
          </DialogTitle>
          <DialogDescription className="text-right">
            {service ? "قم بتحديث بيانات الخدمة." : "أضف خدمة جديدة لملفك الشخصي."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>عنوان الخدمة</Label>
            <Input {...register("title")} disabled={saving} />
            <FieldError>{errors.title?.message}</FieldError>
          </div>
          <div className="space-y-2">
            <Label>الوصف</Label>
            <Textarea rows={3} {...register("description")} disabled={saving} />
            <FieldError>{errors.description?.message}</FieldError>
          </div>

          <DialogFooter className="gap-2 sm:justify-start sm:space-x-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "جارٍ الحفظ..." : "حفظ الخدمة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
