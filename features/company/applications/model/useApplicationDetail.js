"use client";

import { useState, useEffect } from "react";
import { applicationsApi } from "../api/applicationsApi";
import { getMockApplicationById } from "@/features/company/job-positions/lib/mockPositions";

export function useApplicationDetail(id) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplication = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const mockApplication = getMockApplicationById(id);
      if (mockApplication) {
        setApplication(mockApplication);
        return;
      }

      const data = await applicationsApi.getById(id);
      setApplication(data);
    } catch (err) {
      setError(err.message || "فشل في جلب تفاصيل الطلب");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  return {
    application,
    loading,
    error,
    refetch: fetchApplication,
    setApplication,
  };
}
