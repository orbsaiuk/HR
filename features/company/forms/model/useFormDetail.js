"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formsApi } from "../api/formsApi";
import { getMockFormById, isMockFormId } from "../lib/mockForms";

export function useFormDetail(formId) {
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchForm = async () => {
    if (!formId) return;

    if (isMockFormId(formId)) {
      setLoading(true);
      setError(null);

      const mockForm = getMockFormById(formId);
      if (mockForm) {
        setForm(mockForm);
      } else {
        setForm(null);
        setError("النموذج غير موجود");
      }

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await formsApi.getById(formId);
      setForm(data);
    } catch (err) {
      setError(err.message || "تعذر جلب بيانات النموذج");
      console.error("Error fetching form:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteForm = async () => {
    if (isMockFormId(formId)) {
      router.push("/company/forms");
      return { success: true };
    }

    try {
      await formsApi.delete(formId);
      router.push("/company/forms");
      return { success: true };
    } catch (err) {
      const errorMessage = err.message || "تعذر حذف النموذج";
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchForm();
  }, [formId]);

  return {
    form,
    loading,
    error,
    deleteForm,
    refetch: fetchForm,
  };
}
