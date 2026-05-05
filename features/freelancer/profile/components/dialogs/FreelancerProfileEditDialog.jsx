"use client";

import { useCallback, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, X } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  buildSubmitPayload,
  createDefaultValues,
  getSectionMeta,
} from "../../lib/freelancerProfileEditHelpers";
import { AboutEditorSection } from "../editor/AboutEditorSection";
import { DetailsEditorSection } from "../editor/DetailsEditorSection";
import { freelancerProfileEditSchema } from "../../ui/schemas";
import { HeaderEditorSection } from "../editor/HeaderEditorSection";
import { SkillsEditorSection } from "../editor/SkillsEditorSection";
import { SocialEditorSection } from "../editor/SocialEditorSection";

export function FreelancerProfileEditDialog({
  open,
  onOpenChange,
  section,
  profile,
  saving,
  onSave,
  onUploadPortfolioImage,
}) {
  const sectionMeta = useMemo(() => getSectionMeta(section), [section]);
  const defaultValues = useMemo(() => createDefaultValues(profile), [profile]);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);

  const methods = useForm({
    resolver: zodResolver(freelancerProfileEditSchema),
    defaultValues,
  });

  const {
    reset,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (values) => {
    setIsSubmittingProfile(true);

    try {
      const payload = await buildSubmitPayload({
        section,
        values,
      });

      await onSave(payload);
      onOpenChange(false);
    } finally {
      setIsSubmittingProfile(false);
    }
  });

  const handleOpenChange = useCallback(
    (nextOpen) => {
      onOpenChange(nextOpen);
    },
    [onOpenChange],
  );

  const resetForm = useCallback(() => {
    if (!open) {
      return;
    }

    reset(defaultValues);
    clearErrors();
  }, [open, defaultValues, reset, clearErrors]);

  useMemo(() => {
    resetForm();
  }, [resetForm]);

  const hasErrors = Object.values(errors).some((value) => {
    if (!value) return false;
    if (Array.isArray(value)) {
      return value.some((item) => Boolean(item && Object.keys(item).length));
    }
    return Boolean(Object.keys(value).length);
  });

  const submitting = saving || isSubmittingProfile;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        dir="rtl"
        hideCloseButton
        className="max-h-[90vh] overflow-y-auto sm:max-w-2xl"
      >
        <button
          type="button"
          onClick={() => handleOpenChange(false)}
          aria-label="إغلاق"
          disabled={submitting}
          className="absolute left-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 outline-none transition hover:bg-slate-50 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D5BDA] focus-visible:ring-offset-2"
        >
          <X className="h-4 w-4" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-right">{sectionMeta.title}</DialogTitle>
          <DialogDescription className="text-right">
            {sectionMeta.description}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form className="space-y-4" onSubmit={onSubmit}>
            {section === "header" && <HeaderEditorSection />}

            {section === "about" && <AboutEditorSection />}

            {section === "details" && <DetailsEditorSection />}

            {section === "social" && <SocialEditorSection />}

            {section === "skills" && <SkillsEditorSection />}

            {hasErrors ? (
              <div className="flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                راجع الحقول الموضحة قبل الحفظ.
              </div>
            ) : null}

            <DialogFooter className="gap-2 sm:justify-start sm:space-x-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={submitting}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting ? "جارٍ الحفظ..." : "حفظ التغييرات"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
