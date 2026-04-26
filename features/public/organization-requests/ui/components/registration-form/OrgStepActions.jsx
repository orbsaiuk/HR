"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ArrowLeft,
  Send,
  Loader2,
  CheckCircle2,
} from "lucide-react";

/**
 * Enhanced navigation buttons for the organization registration wizard.
 * Handles Previous, Next, and Submit actions with improved visual feedback.
 */
export function OrgStepActions({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting = false,
  isNextDisabled = false,
}) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div
      className="flex items-center justify-between gap-4 pt-6 border-t animate-in fade-in slide-in-from-bottom-2 duration-500"
      role="group"
      aria-label="Form navigation"
    >
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={isFirstStep}
        className="gap-2 h-11 px-6 hover:bg-muted transition-all"
      >
        <ArrowRight size={18} />
        <span className="font-medium">السابق</span>
      </Button>

      {isLastStep ? (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="gap-2 h-11 px-8 shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span className="font-medium">جاري الإرسال...</span>
            </>
          ) : (
            <>
              <span className="font-medium">إرسال الطلب</span>
              <Send size={16} />
            </>
          )}
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          disabled={isNextDisabled}
          className="gap-2 h-11 px-8 shadow-md hover:shadow-lg transition-all"
        >
          <span className="font-medium">التالي</span>
          <ArrowLeft size={18} />
        </Button>
      )}
    </div>
  );
}
