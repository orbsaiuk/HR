"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, X } from "lucide-react";
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
import { FieldError } from "../shared/FieldError";

const schema = z.object({
  title: z.string().trim().min(1, "عنوان العمل مطلوب."),
  link: z.string().trim().url("يرجى إدخال رابط صحيح.").or(z.literal("")),
});

export function FreelancerProjectEditDialog({
  open,
  onOpenChange,
  project,
  saving,
  onSave,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      link: "",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        title: project?.title || "",
        link: project?.link || "",
      });
      setSelectedFile(null);
      setPreviewUrl(project?.imageUrl || "");
    }
  }, [open, project, reset]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = handleSubmit((values) => {
    onSave({
      ...project,
      ...values,
      imageFile: selectedFile,
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
            {project ? "تعديل العمل" : "إضافة عمل"}
          </DialogTitle>
          <DialogDescription className="text-right">
            {project ? "قم بتحديث بيانات العمل." : "أضف عملاً جديداً لمعرض أعمالك."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="معاينة"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-slate-400">
                  <ImageIcon className="h-8 w-8" />
                  <span className="text-sm font-medium">لا توجد صورة مختارة</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>صورة العمل</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={saving}
              />
              <p className="text-xs text-slate-400">يفضل صورة بنسبة 4:3</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>عنوان العمل</Label>
            <Input {...register("title")} disabled={saving} />
            <FieldError>{errors.title?.message}</FieldError>
          </div>

          <div className="space-y-2">
            <Label>رابط العمل (اختياري)</Label>
            <Input dir="ltr" {...register("link")} disabled={saving} />
            <FieldError>{errors.link?.message}</FieldError>
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
              {saving ? "جارٍ الحفظ..." : "حفظ العمل"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
