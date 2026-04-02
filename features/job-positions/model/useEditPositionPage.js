"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formsApi } from "@/features/forms/api/formsApi";
import { useToast } from "@/shared/hooks/useToast";
import { useJobPositionDetail } from "./useJobPositionDetail";
import { useJobPositionActions } from "./useJobPositionActions";
import { useJobPositionForm } from "./useJobPositionForm";
import {
  buildJobPositionPayload,
  getFirstFormErrorMessage,
  jobPositionEditDefaults,
  jobPositionEditSchema,
  mapPositionToEditValues,
} from "./jobPositionFormUtils";

const EDIT_STEPS = [
  { id: "basic", label: "معلومات اساسية" },
  { id: "details", label: "تفاصيل الوظيفة" },
  { id: "application", label: "اعدادات التقديم" },
];

export function useEditPositionPage(positionId) {
  const router = useRouter();
  const { position, loading, error } = useJobPositionDetail(positionId);
  const { updatePosition, actionLoading } = useJobPositionActions();
  const { toast, showToast, hideToast } = useToast();

  const { methods, formData, updateFormData } = useJobPositionForm({
    schema: jobPositionEditSchema,
    defaultValues: jobPositionEditDefaults,
  });

  const { reset, trigger, getValues, setValue, formState } = methods;

  const [currentStep, setCurrentStep] = useState(0);
  const [formMode, setFormMode] = useState("select");
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    fields: [],
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (position) {
      reset(mapPositionToEditValues(position));
    }
  }, [position, reset]);

  const validateStep = async () => {
    const stepFields = {
      0: ["title", "salaryMin", "salaryMax", "deadline"],
      1: ["description", "requirements"],
      2: ["applicationMethod", "formId"],
    };

    const fields = stepFields[currentStep] || [];
    const isValid = fields.length > 0 ? await trigger(fields) : true;

    if (!isValid) {
      showToast(getFirstFormErrorMessage(formState.errors), "error");
      return false;
    }

    return true;
  };

  const handleNext = async () => {
    const isStepValid = await validateStep();
    if (!isStepValid) return;

    setCurrentStep((prev) => Math.min(prev + 1, EDIT_STEPS.length - 1));
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
    if (currentStep < EDIT_STEPS.length - 1) {
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
      const result = await updatePosition(positionId, payload);

      if (result.success) {
        showToast("تم تحديث المنصب!", "success");
        router.push(`/company/positions/${positionId}`);
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
    loading,
    error,
    position,
    toast,
    hideToast,
    steps: EDIT_STEPS,
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
