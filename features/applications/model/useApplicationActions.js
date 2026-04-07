"use client";

import { useState } from "react";
import { applicationsApi } from "../api/applicationsApi";

export function useApplicationActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const updateStatus = async (id, status, extra = {}) => {
    try {
      setActionLoading(true);
      const result = await applicationsApi.updateStatus(id, status, extra);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.message || "فشل في تحديث الحالة",
      };
    } finally {
      setActionLoading(false);
    }
  };

  const updateApplication = async (id, data) => {
    try {
      setActionLoading(true);
      const result = await applicationsApi.update(id, data);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.message || "فشل في تحديث الطلب",
      };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    updateStatus,
    updateApplication,
    actionLoading,
  };
}
