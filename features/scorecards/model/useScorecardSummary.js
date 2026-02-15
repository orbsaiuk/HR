"use client";

import { useState, useEffect, useCallback } from "react";
import { scorecardsApi } from "../api/scorecardsApi";

export function useScorecardSummary(applicationId) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    if (!applicationId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await scorecardsApi.getSummary(applicationId);
      setSummary(data);
    } catch (err) {
      setError(err.message || "Failed to fetch scorecard summary");
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { summary, loading, error, refetch: fetchSummary };
}
