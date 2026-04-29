"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export function useSurveysList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get(API_ENDPOINTS.FREELANCER_SURVEYS);
      setSurveys(data);
    } catch (err) {
      setError(err.message || "تعذر جلب الاستبيانات");
      console.error("Error fetching surveys:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSurveys();
  }, [fetchSurveys]);

  return {
    surveys,
    loading,
    error,
    refetch: fetchSurveys,
    setSurveys,
  };
}
