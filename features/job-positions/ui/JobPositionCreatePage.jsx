"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobPositionActions } from "../model/useJobPositionActions";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { formsApi } from "@/features/forms/api/formsApi";
import {
  PositionFormHeader,
  PositionStepActions,
  PositionCreateStepProgress,
  PositionCreateBasicInfoStep,
  PositionCreateDetailsStep,
  PositionCreateApplicationStep,
} from "./components";

export function JobPositionCreatePage() {
  const router = useRouter();
  const { createPosition, actionLoading } = useJobPositionActions();
  const { toast, showToast, hideToast } = useToast();

  const steps = [
    { id: "basic", label: "معلومات اساسية" },
    { id: "details", label: "تفاصيل الوظيفة" },
    { id: "application", label: "اعدادات التقديم" },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    description: "",
    requirements: "",
    location: "",
    type: "full-time",
    salaryMin: "",
    salaryMax: "",
    currency: "USD",
    status: "draft",
    deadline: "",
    isUrgent: false,
    formId: "",
    applicationMethod: "form",
  });

  // Application form section state
  const [formMode, setFormMode] = useState("select"); // 'select' | 'create'
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    fields: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const validateBasicStep = () => {
    if (!formData.title.trim() || !formData.department.trim()) {
      showToast("عنوان الوظيفة والقسم حقول مطلوبة", "error");
      return false;
    }

    if (
      formData.salaryMin &&
      formData.salaryMax &&
      Number(formData.salaryMin) > Number(formData.salaryMax)
    ) {
      showToast("الحد الادنى للراتب يجب ان يكون اقل من الحد الاقصى", "error");
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (currentStep === 0 && !validateBasicStep()) {
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (currentStep < steps.length - 1) {
      return;
    }

    if (!validateBasicStep()) {
      return;
    }

    setSubmitting(true);

    try {
      let linkedFormId = formData.formId;

      // If user built a new form inline, create it first
      if (formMode === "create" && newForm.fields.length > 0) {
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

      const payload = {
        ...formData,
        formId: linkedFormId,
        isUrgent: Boolean(formData.isUrgent),
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      };

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

  return (
    <div className="mx-auto space-y-6">
      <PositionFormHeader
        title="نشر وظيفة جديدة"
        subTitle="قم بإنشاء وظيفة جديدة"
        backHref="/company/positions"
      />

      <PositionCreateStepProgress currentStep={currentStep} steps={steps} />

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {currentStep === 0 && (
          <PositionCreateBasicInfoStep
            formData={formData}
            onChange={setFormData}
          />
        )}

        {currentStep === 1 && (
          <PositionCreateDetailsStep
            formData={formData}
            onChange={setFormData}
          />
        )}

        {currentStep === 2 && (
          <PositionCreateApplicationStep
            formData={formData}
            onChange={setFormData}
            formMode={formMode}
            onFormModeChange={setFormMode}
            newForm={newForm}
            onNewFormChange={setNewForm}
          />
        )}

        <PositionStepActions
          currentStep={currentStep}
          totalSteps={steps.length}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isLoading={actionLoading || submitting}
          submitText="نشر الوظيفة"
          cancelHref="/company/positions"
          cancelText="رجوع للوظائف"
        />
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
