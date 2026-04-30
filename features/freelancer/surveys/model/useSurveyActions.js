"use client";

import { useState, useCallback } from "react";
import { freelancerSurveysApi } from "../api/freelancerSurveysApi";

export function useSurveyActions() {
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const deleteSurvey = useCallback(async (id) => {
    try {
      setDeleting(true);
      await freelancerSurveysApi.deleteSurvey(id);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message || "تعذر حذف الاستبيان" };
    } finally {
      setDeleting(false);
    }
  }, []);

  const createSurvey = useCallback(async (data) => {
    try {
      setCreating(true);
      const result = await freelancerSurveysApi.createSurvey(data);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.message || "تعذر إنشاء الاستبيان",
      };
    } finally {
      setCreating(false);
    }
  }, []);

  const updateSurvey = useCallback(async (id, data) => {
    try {
      setUpdating(true);
      const result = await freelancerSurveysApi.updateSurvey(id, data);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.message || "تعذر تحديث الاستبيان",
      };
    } finally {
      setUpdating(false);
    }
  }, []);

  return { deleteSurvey, createSurvey, updateSurvey, deleting, creating, updating };
}
