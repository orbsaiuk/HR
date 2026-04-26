"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  companyProjectFormDefaults,
  mapCompanyProjectCardToForm,
  companyProjectFormSchema,
  mapCompanyProjectFormToCard,
} from "../../model/companyProjectsSchema";
import { CreateProjectForm } from "./components";

export function CreateProjectDialog({
  onCreate,
  onUpdate,
  projectToEdit = null,
  open: controlledOpen,
  onOpenChange,
  hideTrigger = false,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof controlledOpen === "boolean";
  const open = isControlled ? controlledOpen : internalOpen;
  const isEditMode = Boolean(projectToEdit);

  const setOpen = (nextOpen) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(companyProjectFormSchema),
    defaultValues: companyProjectFormDefaults,
  });

  useEffect(() => {
    if (open && isEditMode && projectToEdit) {
      reset(mapCompanyProjectCardToForm(projectToEdit));
      return;
    }

    if (open && !isEditMode) {
      reset(companyProjectFormDefaults);
      return;
    }

    if (!open) {
      reset(companyProjectFormDefaults);
    }
  }, [isEditMode, open, projectToEdit, reset]);

  async function onSubmit(values) {
    const payload = mapCompanyProjectFormToCard(values);

    if (isEditMode && projectToEdit?.id) {
      await onUpdate?.(projectToEdit.id, payload);
    } else {
      await onCreate?.(payload);
    }

    setOpen(false);
  }

  function handleCancel() {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!hideTrigger && (
        <DialogTrigger asChild>
          <Button className="bg-[#5338D5] hover:bg-[#462EA8]">
            <Plus className="h-4 w-4" />
            إضافة مشروع
          </Button>
        </DialogTrigger>
      )}

      <DialogContent
        className="max-h-[90vh] w-[95vw] overflow-y-auto sm:max-w-2xl [&>button:last-child]:hidden"
        dir="rtl"
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 h-8 w-8 rounded-sm text-muted-foreground hover:text-foreground"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-right">
            {isEditMode ? "تعديل المشروع" : "إضافة مشروع جديد"}
          </DialogTitle>
          <DialogDescription className="text-right">
            {isEditMode
              ? "قم بتحديث بيانات المشروع ثم احفظ التعديلات."
              : "أدخل تفاصيل المشروع ليظهر مباشرة ضمن قائمة مشاريع الشركة."}
          </DialogDescription>
        </DialogHeader>

        <CreateProjectForm
          register={register}
          control={control}
          errors={errors}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit(onSubmit)}
          onCancel={handleCancel}
          submitLabel={isEditMode ? "حفظ التعديلات" : "إضافة المشروع"}
          submittingLabel={isEditMode ? "جارٍ الحفظ..." : "جارٍ الإضافة..."}
        />
      </DialogContent>
    </Dialog>
  );
}
