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
  cancelHref,
}) {
  const isLastStep = currentStep >= totalSteps - 1;

  return (
    <div className="flex items-center justify-between gap-3">
      <Button variant="outline" asChild>
        <Link href={cancelHref}>إلغاء</Link>
      </Button>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={currentStep === 0}
        >
          السابق
        </Button>
        {isLastStep ? (
          <Button type="button" onClick={onSubmit} disabled={isLoading}>
            {isLoading ? "جاري الحفظ..." : submitText}
          </Button>
        ) : (
          <Button type="button" onClick={onNext}>
            التالي
          </Button>
        )}
      </div>
    </div>
  );
}
