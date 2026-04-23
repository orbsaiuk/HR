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

function buildSecondPartyFullName(values = {}) {
  const firstName = String(values.secondPartyFirstName || "").trim();
  const lastName = String(values.secondPartyLastName || "").trim();
  return [firstName, lastName].filter(Boolean).join(" ");
}

function extractFileNameFromDisposition(contentDisposition) {
  if (!contentDisposition) return "contract.pdf";

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (basicMatch?.[1]) {
    return basicMatch[1];
  }

  return "contract.pdf";
}

async function downloadContractPdfFile(contractId) {
  if (typeof window === "undefined") return;
  if (!contractId) return;

  const downloadUrl =
    typeof contractsApi.getContractPdfDownloadUrl === "function"
      ? contractsApi.getContractPdfDownloadUrl(contractId)
      : API_ENDPOINTS.CONTRACT_DOWNLOAD_PDF(contractId);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000);

  let response;
  try {
    response = await fetch(downloadUrl, {
      method: "GET",
      credentials: "same-origin",
      signal: controller.signal,
    });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("Download timed out. Please try again.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let errorMessage = "Failed to download contract PDF";
    try {
      const errorBody = await response.json();
      errorMessage = errorBody?.error || errorBody?.message || errorMessage;
    } catch {
      // ignore json parse errors
    }
    throw new Error(errorMessage);
  }

  const blob = await response.blob();
  const fileName = extractFileNameFromDisposition(
    response.headers.get("content-disposition"),
  );

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Release the object URL after the browser starts the download.
  setTimeout(() => {
    window.URL.revokeObjectURL(blobUrl);
  }, 1000);
}

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
    getValues,
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
      { id: "first-party", label: "الطرف الأول" },
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
        const companyResult = await apiClient.get(API_ENDPOINTS.COMPANY_PROFILE);

        if (!mounted) return;

        const companyName = String(companyResult?.name || "").trim();

        setCompanyProfile({
          companyName,
          legalRepresentative: "",
        });

        if (!getValues("firstPartyCompanyName") && companyName) {
          setValue("firstPartyCompanyName", companyName, {
            shouldDirty: false,
            shouldValidate: false,
          });
        }

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
  }, [getValues, open, setValue]);

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
    const secondPartyFullName = buildSecondPartyFullName(values);
    const resolvedValues = {
      ...values,
      templateId: template?.id || values.templateId || "",
      contractType: resolvedContractType,
      secondPartyFullName,
    };
    const clauses = generateContractClauses(template, resolvedValues);

    const payload = {
      templateId: template?.id || values.templateId || "",
      title: template?.title || "عقد جديد",
      description: template?.description || "",
      type: resolvedContractType,
      category: template?.category || "",
      formData: resolvedValues,
      clauses,
    };

    const createdContract = await contractsApi.createContract(payload);
    const contractId = createdContract?._id;

    if (!contractId) {
      throw new Error("Failed to create contract");
    }

    await downloadContractPdfFile(contractId);

    onContractSent?.({
      templateId: payload.templateId,
      contract: createdContract,
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
      stepId === "first-party"
        ? ["firstPartyCompanyName", "firstPartyLegalRepresentative"]
        : stepId === "second-party"
        ? [
            "secondPartyFirstName",
            "secondPartyLastName",
            "secondPartyNationalId",
            "secondPartyAddress",
            "secondPartyPhone",
            "secondPartyEmail",
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
