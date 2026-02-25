"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useJobPositionDetail } from "../model/useJobPositionDetail";
import { useJobPositionActions } from "../model/useJobPositionActions";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
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
  ApplicationMethodSelector,
} from "./components";
import { ApplicationFormSection } from "./ApplicationFormSection";
import { AssignedTeamMembersField } from "@/shared/components/forms/AssignedTeamMembersField";

export function JobPositionEditPage({ positionId }) {
  const router = useRouter();
  const { position, loading, error } = useJobPositionDetail(positionId);
  const { updatePosition, actionLoading } = useJobPositionActions();
  const { toast, showToast, hideToast } = useToast();
  const [initialized, setInitialized] = useState(false);

  const steps = [
    { id: "basic", label: "Basic Info" },
    { id: "compensation", label: "Compensation" },
    { id: "application", label: "Application Form" },
    { id: "review", label: "Review" },
  ];
  const [currentStep, setCurrentStep] = useState(0);

  // Application form section state
  const [formMode, setFormMode] = useState("select");
  const [newForm, setNewForm] = useState({
    title: "",
    description: "",
    fields: [],
  });
  const [submitting, setSubmitting] = useState(false);

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
    applicationMethod: "form",
    assignedTo: [],
  });

  // Populate form data once position is loaded
  useEffect(() => {
    if (position && !initialized) {
      setFormData({
        title: position.title || "",
        department: position.department || "",
        description: position.description || "",
        requirements: position.requirements || "",
        location: position.location || "",
        type: position.type || "full-time",
        salaryMin: position.salaryMin ?? "",
        salaryMax: position.salaryMax ?? "",
        currency: position.currency || "USD",
        status: position.status || "draft",
        deadline: position.deadline ? position.deadline.slice(0, 16) : "",
        formId: position.form?._id || "",
        applicationMethod: position.applicationMethod || "form",
        assignedTo: position.assignedTo?.map((u) => u._id) || [],
      });
      setInitialized(true);
    }
  }, [position, initialized]);

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

      const result = await updatePosition(positionId, payload);
      if (result.success) {
        showToast("Position updated!", "success");
        router.push(`/dashboard/positions/${positionId}`);
      } else {
        showToast(result.error, "error");
      }
    } catch (err) {
      showToast(err.message || "Something went wrong", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!position) return <Error message="Position not found" />;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PositionFormHeader
        title="Edit Position"
        backHref={`/dashboard/positions/${positionId}`}
      />

      <PositionStepProgress currentStep={currentStep} steps={steps} />

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {currentStep === 0 && (
          <div className="space-y-6">
            <PositionBasicInfoCard formData={formData} onChange={setFormData} />
            <AssignedTeamMembersField
              value={formData.assignedTo}
              onChange={(assignedTo) =>
                setFormData((prev) => ({ ...prev, assignedTo }))
              }
            />
          </div>
        )}

        {currentStep === 1 && (
          <PositionCompensationCard
            formData={formData}
            onChange={setFormData}
          />
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <ApplicationMethodSelector
              value={formData.applicationMethod}
              onChange={(val) =>
                setFormData((prev) => ({ ...prev, applicationMethod: val }))
              }
            />

            {(formData.applicationMethod === "form" ||
              formData.applicationMethod === "both") && (
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

            {formData.applicationMethod === "profile" && (
              <div className="rounded-lg border border-dashed border-gray-300 p-6 bg-gray-50/50 text-center">
                <p className="text-sm text-muted-foreground">
                  Applicants will submit their user profile when applying.
                  No application form is needed.
                </p>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && <PositionReviewSummary formData={formData} />}

        <PositionStepActions
          currentStep={currentStep}
          totalSteps={steps.length}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isLoading={actionLoading || submitting}
          submitText="Save Changes"
          cancelHref={`/dashboard/positions/${positionId}`}
        />
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
