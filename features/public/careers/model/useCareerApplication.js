"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { careersApi } from "../api/careersApi";

export function useCareerApplication(positionId) {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [checkingApplied, setCheckingApplied] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const checkAlreadyApplied = useCallback(async () => {
    try {
      setCheckingApplied(true);
      const result = await careersApi.checkApplied(positionId);
      setAlreadyApplied(Boolean(result?.alreadyApplied));
    } catch (err) {
      // Silently ignore; we only block if we can confirm
    } finally {
      setCheckingApplied(false);
    }
  }, [positionId]);

  async function submitApplication(answers, formId) {
    try {
      setSubmitting(true);
      setError(null);
      await careersApi.apply(positionId, { answers, formId });
      setSubmitted(true);
    } catch (err) {
      if (err.message?.includes("already applied") || err.status === 409) {
        setAlreadyApplied(true);
      } else {
        setError(err.message || "Failed to submit application");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function submitProfileApplication() {
    try {
      setSubmitting(true);
      setError(null);
      await careersApi.apply(positionId, {});
      setSubmitted(true);
    } catch (err) {
      if (err.message?.includes("already applied") || err.status === 409) {
        setAlreadyApplied(true);
      } else {
        setError(err.message || "Failed to submit application");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function goBack() {
    router.push(`/careers/${positionId}`);
  }

  function goToCareers() {
    router.push("/careers");
  }

  return {
    submitting,
    submitted,
    alreadyApplied,
    checkingApplied,
    error,
    submitApplication,
    submitProfileApplication,
    checkAlreadyApplied,
    goBack,
    goToCareers,
  };
}
