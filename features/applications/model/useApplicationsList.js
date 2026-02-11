"use client";

import { useState, useEffect, useCallback } from "react";
import { applicationsApi } from "../api/applicationsApi";

export function useApplicationsList(positionId) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await applicationsApi.getAll(positionId);
      setApplications(data);
    } catch (err) {
      setError(err.message || "Failed to fetch applications");
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
