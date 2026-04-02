"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formsApi } from "@/features/forms/api/formsApi";
import { useToast } from "@/shared/hooks/useToast";
import { useJobPositionActions } from "./useJobPositionActions";
import { useJobPositionForm } from "./useJobPositionForm";
import {
  buildJobPositionPayload,
  getFirstFormErrorMessage,
  jobPositionCreateDefaults,
  jobPositionCreateSchema,
} from "./jobPositionFormUtils";

const CREATE_STEPS = [
  { id: "basic", label: "معلومات اساسية" },
  { id: "details", label: "تفاصيل الوظيفة" },
  { id: "application", label: "اعدادات التقديم" },
];

export function useCreatePositionPage() {
  const router = useRouter();
  const { createPosition, actionLoading } = useJobPositionActions();
  const { toast, showToast, hideToast } = useToast();
  const { methods, formData, updateFormData } = useJobPositionForm({
    schema: jobPositionCreateSchema,
    defaultValues: jobPositionCreateDefaults,
  });

  const { trigger, getValues, setValue, formState } = methods;

  const [currentStep, setCurrentStep] = useState(0);
  const [formMode, setFormMode] = useState("select");
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    fields: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const validateBasicStep = async () => {
    const isValid = await trigger([
      "title",
      "department",
      "salaryMin",
      "salaryMax",
      "deadline",
    ]);

    if (!isValid) {
      showToast(getFirstFormErrorMessage(formState.errors), "error");
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      const isBasicValid = await validateBasicStep();
      if (!isBasicValid) return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, CREATE_STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const setAssignedTo = (assignedTo) => {
    setValue("assignedTo", assignedTo, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
  };

  const handleSubmit = async () => {
    if (currentStep < CREATE_STEPS.length - 1) {
      return;
    }

    const isFormValid = await trigger();
    if (!isFormValid) {
      showToast(getFirstFormErrorMessage(formState.errors), "error");
      return;
    }

    setSubmitting(true);

    try {
      const values = getValues();
      let linkedFormId = values.formId;
      const needsApplicationForm =
        values.applicationMethod === "form" ||
        values.applicationMethod === "both";

      if (
        needsApplicationForm &&
        formMode === "create" &&
        newForm.fields.length > 0
      ) {
        if (!newForm.title.trim()) {
          showToast("الرجاء إدخال عنوان لنموذج التقديم", "error");
          setSubmitting(false);
          return;
        }

        const createdForm = await formsApi.create({
          title: newForm.title,
          description: newForm.description,
          fields: newForm.fields,
          status: "published",
        });

        linkedFormId = createdForm._id;
      }

      const payload = buildJobPositionPayload(values, linkedFormId);
      const result = await createPosition(payload);

      if (result.success) {
        showToast("تم إنشاء المنصب بنجاح!", "success");
        router.push("/company/positions");
      } else {
        showToast(result.error, "error");
      }
    } catch (err) {
      showToast(err.message || "حدث خطأ ما", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return {
    toast,
    hideToast,
    steps: CREATE_STEPS,
    currentStep,
    formData,
    formMode,
    newForm,
    isLoading: actionLoading || submitting,
    setFormMode,
    setNewForm,
    setAssignedTo,
    updateFormData,
    handleBack,
    handleNext,
    handleSubmit,
  };
}
