"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function PositionStepActions({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSubmit,
  isLoading,
  submitText,
}) {
  const isLastStep = currentStep >= totalSteps - 1;

  return (
    <div className="flex items-center justify-between gap-3">
      {currentStep > 0 && (
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 0}
        >
          السابق
        </Button>
      )}
      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="bg-[#5338D5] hover:bg-[#462EA8]"
        >
          {isLoading ? "جاري الحفظ..." : submitText}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          className="bg-[#5338D5] hover:bg-[#462EA8]"
        >
          التالي
        </Button>
      )}
    </div>
  );
}
