"use client";

import { useState, useEffect, useCallback } from "react";
import { applicationsApi } from "../api/applicationsApi";
import { getMockApplicationsByPositionIdentifier } from "@/features/job-positions/lib/mockPositions";

export function useApplicationsList(positionId) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const mockApplications =
        getMockApplicationsByPositionIdentifier(positionId);
      if (mockApplications) {
        setApplications(mockApplications);
        return;
      }

      const data = await applicationsApi.getAll(positionId);
      setApplications(data);
    } catch (err) {
      setError(err.message || "فشل في جلب الطلبات");
    } finally {
      setLoading(false);
    }
  }, [positionId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return {
    applications,
    loading,
    error,
    refetch: fetchApplications,
    setApplications,
  };
}
