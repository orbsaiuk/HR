"use client";

import { useState, useCallback } from "react";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export function useSurveyActions() {
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  const deleteSurvey = useCallback(async (id) => {
    try {
      setDeleting(true);
      await apiClient.delete(API_ENDPOINTS.FREELANCER_SURVEY_BY_ID(id));
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
      const result = await apiClient.post(API_ENDPOINTS.FREELANCER_SURVEYS, data);
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
      const result = await apiClient.put(
        API_ENDPOINTS.FREELANCER_SURVEY_BY_ID(id),
        data,
      );
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
