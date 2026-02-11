"use client";

import { useState } from "react";
import { formsApi } from "../api/formsApi";

export function useFormActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const deleteForm = async (formId) => {
    try {
      setLoading(true);
      setError(null);
      await formsApi.delete(formId);
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "Failed to delete form";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteForm,
    loading,
    error,
  };
}
