"use client";

import { useState, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { OrgStepProgress, STEPS } from "./OrgStepProgress";
import { OrgStepActions } from "./OrgStepActions";
import { Step1BasicInfo } from "./steps/Step1BasicInfo";
import { Step2SocialContact } from "./steps/Step2SocialContact";
import { Step3LegalInfo } from "./steps/Step3LegalInfo";
import { Step4Review } from "./steps/Step4Review";
import { useOrgFormPersistence } from "../../../model/useOrgFormPersistence";
import {
  orgRegistrationSchema,
  orgRegistrationDefaults,
  STEP_FIELDS,
  cleanOrgFormData,
} from "../../schemas";

/**
 * Multi-step organization registration wizard.
 * 4 steps: Basic Info → Social & Contact → Legal Info → Review
 */
export function OrgRegistrationWizard({ onSubmit, submitting, userId }) {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm({
    resolver: zodResolver(orgRegistrationSchema),
    defaultValues: orgRegistrationDefaults,
    mode: "onChange",
  });

  const { trigger, handleSubmit, getValues } = methods;

  // Enable localStorage persistence
  const { clearSavedData } = useOrgFormPersistence(methods, {
    userId,
    currentStep,
    maxStep: STEPS.length - 1,
    onRestoreStep: setCurrentStep,
  });

  // Validate current step fields before advancing
  const validateCurrentStep = useCallback(async () => {
    const fieldsToValidate = STEP_FIELDS[currentStep];
    if (fieldsToValidate.length === 0) return true;
    return await trigger(fieldsToValidate);
  }, [currentStep, trigger]);

  const handleNext = useCallback(async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [validateCurrentStep, currentStep]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentStep]);

  const handleEditStep = useCallback((stepIndex) => {
    setCurrentStep(stepIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFormSubmit = handleSubmit((data) => {
    const cleaned = cleanOrgFormData(data);

    // Clear localStorage on successful submit initiation
    clearSavedData();

    onSubmit(cleaned);
  });

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <Step1BasicInfo />;
      case 1:
        return <Step2SocialContact />;
      case 2:
        return <Step3LegalInfo />;
      case 3:
        return <Step4Review onEditStep={handleEditStep} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
        <OrgStepProgress currentStep={currentStep} />

        <Card className="shadow-lg border-2 hover:shadow-xl transition-all duration-300">
          <CardContent className="pt-8 pb-6">{renderStepContent()}</CardContent>
        </Card>

        <OrgStepActions
          currentStep={currentStep}
          totalSteps={STEPS.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleFormSubmit}
          isSubmitting={submitting}
        />
      </form>
    </FormProvider>
  );
}
