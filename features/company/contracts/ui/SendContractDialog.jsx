"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ContractStepper } from "./steps/ContractStepper";
import { StepFirstParty } from "./steps/StepFirstParty";
import { StepSecondParty } from "./steps/StepSecondParty";
import { StepContractDetails } from "./steps/StepContractDetails";
import { StepReview } from "./steps/StepReview";
import { useSendContractDialog } from "./useSendContractDialog";

export function SendContractDialog({
  open,
  onOpenChange,
  template,
  onContractSent,
}) {
  const {
    currentStep,
    lastStepIndex,
    register,
    watch,
    setValue,
    errors,
    isSubmitting,
    allValues,
    companyProfile,
    steps,
    handleDialogChange,
    handlePrevious,
    handleEditStep,
    handleNext,
  } = useSendContractDialog({
    open,
    onOpenChange,
    onContractSent,
    template,
  });

  if (!template) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent
        dir="rtl"
        className="max-h-[92vh] w-[96vw] overflow-y-auto border-[#E4E8F2] p-4 sm:max-w-5xl sm:p-5 [&>button:last-child]:hidden"
      >
        <DialogClose asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute left-4 top-4 h-8 w-8 rounded-sm text-[#6B7280] hover:text-[#1F2937]"
            aria-label="إغلاق"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogClose>

        <DialogHeader>
          <DialogTitle className="text-right text-xl font-bold leading-tight text-[#1F2937] sm:text-2xl lg:text-3xl">
            {template.title}
          </DialogTitle>
          <DialogDescription className="text-right text-sm leading-6 text-[#6B7280] sm:text-base sm:leading-7">
            أكمل بيانات الطرفين وتفاصيل العقد ثم راجع النسخة النهائية قبل
            التحميل.
          </DialogDescription>
        </DialogHeader>

        <ContractStepper steps={steps} currentStep={currentStep} />

        <div className="rounded-sm border border-[#E7EBF3] p-4 sm:p-6">
          {steps[currentStep]?.id === "first-party" ? (
            <StepFirstParty register={register} errors={errors} />
          ) : null}

          {steps[currentStep]?.id === "second-party" ? (
            <StepSecondParty register={register} errors={errors} />
          ) : null}

          {steps[currentStep]?.id === "details" ? (
            <StepContractDetails
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              contractType={template.type}
            />
          ) : null}

          {steps[currentStep]?.id === "preview" ? (
            <StepReview
              values={allValues}
              onEditStep={handleEditStep}
              template={template}
              companyProfile={companyProfile}
            />
          ) : null}
        </div>

        <DialogFooter className="gap-2 sm:flex-row sm:items-center sm:justify-between sm:space-x-0">
          {currentStep > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isSubmitting}
              className="min-w-24 border-[#111827] text-[#111827]"
            >
              السابق
            </Button>
          ) : (
            <span aria-hidden="true" className="hidden sm:inline-flex" />
          )}

          <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="min-w-24 bg-[#5338D5] hover:bg-[#462EA8]"
          >
            {isSubmitting
              ? "جارٍ التحضير..."
              : currentStep === lastStepIndex
                ? "تحميل العقد"
                : "التالي"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
