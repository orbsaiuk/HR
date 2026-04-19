"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";
import { contractsApi } from "../api/contractsApi";
import { generateContractClauses } from "../model/contractClauseGenerator";
import {
  sendContractDefaults,
  sendContractSchema,
} from "../model/contractSchema";

const DEFAULT_COMPANY_PROFILE = {
  companyName: "",
  legalRepresentative: "",
};

export function useSendContractDialog({
  open,
  onOpenChange,
  template,
  onContractSent,
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [companyProfile, setCompanyProfile] = useState(DEFAULT_COMPANY_PROFILE);

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(sendContractSchema),
    defaultValues: sendContractDefaults,
    mode: "onTouched",
  });

  const allValues = watch();

  const steps = useMemo(() => {
    return [
      { id: "second-party", label: "الطرف الثاني" },
      { id: "details", label: "تفاصيل العقد" },
      { id: "preview", label: "المعاينة" },
    ];
  }, []);

  const lastStepIndex = steps.length - 1;

  useEffect(() => {
    if (!open) return;

    reset({
      ...sendContractDefaults,
      templateId: template?.id || "",
      contractType: template?.type || "",
    });
    setCurrentStep(0);
  }, [open, reset, template]);

  useEffect(() => {
    if (!open) return;

    let mounted = true;

    async function loadCompanyContext() {
      try {
        const [companyResult, userResult] = await Promise.allSettled([
          apiClient.get(API_ENDPOINTS.COMPANY_PROFILE),
          apiClient.get(API_ENDPOINTS.USER_PROFILE),
        ]);

        if (!mounted) return;

        const companyName =
          companyResult.status === "fulfilled"
            ? String(companyResult.value?.name || "").trim()
            : "";

        const legalRepresentative =
          userResult.status === "fulfilled"
            ? String(userResult.value?.name || "").trim()
            : "";

        setCompanyProfile({
          companyName,
          legalRepresentative,
        });
      } catch (error) {
        if (!mounted) return;
        console.error("Failed to load send-contract context:", error);
        setCompanyProfile(DEFAULT_COMPANY_PROFILE);
      }
    }

    loadCompanyContext();

    return () => {
      mounted = false;
    };
  }, [open]);

  const handleDialogChange = (nextOpen) => {
    onOpenChange?.(nextOpen);
    if (!nextOpen) {
      setCurrentStep(0);
    }
  };

  const handlePrevious = () => {
    setCurrentStep((previousStep) => Math.max(previousStep - 1, 0));
  };

  const handleEditStep = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const onSubmit = async (values) => {
    const resolvedContractType = template?.type || values.contractType || "";

    const payload = {
      templateId: template?.id || values.templateId || "",
      title: template?.title || "عقد جديد",
      description: template?.description || "",
      type: resolvedContractType,
      category: template?.category || "",
      formData: {
        ...values,
        templateId: template?.id || values.templateId || "",
        contractType: resolvedContractType,
        firstPartyCompanyName: companyProfile.companyName,
        firstPartyLegalRepresentative: companyProfile.legalRepresentative,
      },
      clauses: generateContractClauses(template, {
        ...values,
        contractType: resolvedContractType,
      }),
    };

    const createdContract = await contractsApi.createContract(payload);
    const contractId = createdContract?._id;

    if (!contractId) {
      throw new Error("Failed to create contract");
    }

    const whatsappResult = await contractsApi.sendViaWhatsApp(contractId);
    if (whatsappResult?.url && typeof window !== "undefined") {
      window.open(whatsappResult.url, "_blank", "noopener,noreferrer");
    }

    onContractSent?.({
      templateId: payload.templateId,
      contract: createdContract,
      whatsappUrl: whatsappResult?.url,
    });

    handleDialogChange(false);
  };

  const handleNext = async () => {
    if (currentStep === lastStepIndex) {
      await handleSubmit(onSubmit)();
      return;
    }

    const stepId = steps[currentStep]?.id;
    const stepFields =
      stepId === "second-party"
        ? [
            "secondPartyFullName",
            "secondPartyNationalId",
            "secondPartyAddress",
            "secondPartyWhatsapp",
          ]
        : stepId === "details"
          ? [
              "contractType",
              "jobTitle",
              "compensationAmount",
              "compensationCurrency",
              "startDate",
              "endDate",
              "contractDuration",
              "penaltyClauseAmount",
              "penaltyClauseCurrency",
            ]
          : [];

    if (stepFields.length === 0) {
      setCurrentStep((previousStep) =>
        Math.min(previousStep + 1, lastStepIndex),
      );
      return;
    }

    const isStepValid = await trigger(stepFields, {
      shouldFocus: true,
    });

    if (isStepValid) {
      setCurrentStep((previousStep) =>
        Math.min(previousStep + 1, lastStepIndex),
      );
    }
  };

  return {
    steps,
    currentStep,
    lastStepIndex,
    register,
    watch,
    setValue,
    errors,
    isSubmitting,
    allValues,
    companyProfile,
    handleDialogChange,
    handlePrevious,
    handleEditStep,
    handleNext,
  };
}
