"use client";

import { useState, useEffect, useCallback } from "react";
import { scorecardsApi } from "../api/scorecardsApi";

export function useScorecards(applicationId) {
  const [scorecards, setScorecards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchScorecards = useCallback(async () => {
    if (!applicationId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await scorecardsApi.getByApplication(applicationId);
      setScorecards(data);
    } catch (err) {
      setError(err.message || "Failed to fetch scorecards");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchScorecards();
  }, [fetchScorecards]);

  return {
    scorecards,
    loading,
    error,
    refetch: fetchScorecards,
    setScorecards,
  };
}
