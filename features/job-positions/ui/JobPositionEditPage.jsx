"use client";

import { useEditPositionPage } from "../model/useEditPositionPage";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import {
  PositionFormHeader,
  PositionCreateStepProgress,
  PositionCreateBasicInfoStep,
  PositionCreateDetailsStep,
  PositionCreateApplicationStep,
  PositionStepActions,
} from "./components";
import { AssignedTeamMembersField } from "@/shared/components/forms/AssignedTeamMembersField";

export function JobPositionEditPage({ positionId }) {
  const {
    loading,
    error,
    position,
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
  } = useEditPositionPage(positionId);

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!position) return <Error message="المنصب غير موجود" />;

  return (
    <div className="mx-auto space-y-6">
      <PositionFormHeader
        title="تعديل الوظيفة"
        subTitle="قم بتعديل بيانات الوظيفة"
        backHref={`/company/positions/${positionId}`}
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
          submitText="حفظ التعديلات"
        />
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
