"use client";

import { useState, useEffect, useCallback } from "react";
import { freelancerSurveysApi } from "../api/freelancerSurveysApi";

export function useSurveysList() {
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSurveys = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await freelancerSurveysApi.getSurveys();
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
