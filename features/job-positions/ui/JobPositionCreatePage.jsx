"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useJobPositionActions } from "../model/useJobPositionActions";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { formsApi } from "@/features/forms/api/formsApi";
import {
  PositionFormHeader,
  PositionBasicInfoCard,
  PositionCompensationCard,
  PositionStepProgress,
  PositionStepActions,
  PositionReviewSummary,
} from "./components";
import { ApplicationFormSection } from "./ApplicationFormSection";

export function JobPositionCreatePage() {
  const router = useRouter();
  const { createPosition, actionLoading } = useJobPositionActions();
  const { toast, showToast, hideToast } = useToast();

  const steps = [
    { id: "basic", label: "Basic Info" },
    { id: "compensation", label: "Compensation" },
    { id: "application", label: "Application Form" },
    { id: "review", label: "Review" },
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
    formId: "",
  });

  // Application form section state
  const [formMode, setFormMode] = useState("select"); // 'select' | 'create'
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    fields: [],
  });
  const [submitting, setSubmitting] = useState(false);



  const handleNext = () => {
    if (currentStep === 0 && !formData.title.trim()) {
      showToast("Job title is required", "error");
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

    if (!formData.title.trim()) {
      showToast("Job title is required", "error");
      return;
    }

    setSubmitting(true);

    try {
      let linkedFormId = formData.formId;

      // If user built a new form inline, create it first
      if (formMode === "create" && newForm.fields.length > 0) {
        if (!newForm.title.trim()) {
          showToast("Please enter a title for the application form", "error");
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
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : null,
      };

      const result = await createPosition(payload);
      if (result.success) {
        showToast("Position created!", "success");
        router.push("/dashboard/positions");
      } else {
        showToast(result.error, "error");
      }
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PositionFormHeader
        title="Create Job Position"
        backHref="/dashboard/positions"
      />

      <PositionStepProgress currentStep={currentStep} steps={steps} />

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {currentStep === 0 && (
          <PositionBasicInfoCard formData={formData} onChange={setFormData} />
        )}

        {currentStep === 1 && (
          <PositionCompensationCard formData={formData} onChange={setFormData} />
        )}

        {currentStep === 2 && (
          <ApplicationFormSection
            formId={formData.formId}
            onFormIdChange={(id) =>
              setFormData((prev) => ({ ...prev, formId: id }))
            }
            newForm={newForm}
            onNewFormChange={setNewForm}
            mode={formMode}
            onModeChange={setFormMode}
            deadline={formData.deadline}
            onDeadlineChange={(val) =>
              setFormData((prev) => ({ ...prev, deadline: val }))
            }
          />
        )}

        {currentStep === 3 && <PositionReviewSummary formData={formData} />}

        <PositionStepActions
          currentStep={currentStep}
          totalSteps={steps.length}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isLoading={actionLoading || submitting}
          submitText="Create Position"
          cancelHref="/dashboard/positions"
        />
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
