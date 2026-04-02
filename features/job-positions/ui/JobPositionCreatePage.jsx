"use client";

import { useCreatePositionPage } from "../model/useCreatePositionPage";
import { Toast } from "@/shared/components/feedback/Toast";
import { AssignedTeamMembersField } from "@/shared/components/forms/AssignedTeamMembersField";
import {
  PositionFormHeader,
  PositionStepActions,
  PositionCreateStepProgress,
  PositionCreateBasicInfoStep,
  PositionCreateDetailsStep,
  PositionCreateApplicationStep,
} from "./components";

export function JobPositionCreatePage() {
  const {
    toast,
    hideToast,
    steps,
    currentStep,
    formData,
    formMode,
    newForm,
    isLoading,
    setFormMode,
    setNewForm,
    setAssignedTo,
    updateFormData,
    handleBack,
    handleNext,
    handleSubmit,
  } = useCreatePositionPage();

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
          <div className="space-y-6">
            <PositionCreateBasicInfoStep
              formData={formData}
              onChange={updateFormData}
            />
            <AssignedTeamMembersField
              value={formData.assignedTo || []}
              onChange={setAssignedTo}
            />
          </div>
        )}

        {currentStep === 1 && (
          <PositionCreateDetailsStep
            formData={formData}
            onChange={updateFormData}
          />
        )}

        {currentStep === 2 && (
          <PositionCreateApplicationStep
            formData={formData}
            onChange={updateFormData}
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
          isLoading={isLoading}
          submitText="نشر الوظيفة"
        />
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
