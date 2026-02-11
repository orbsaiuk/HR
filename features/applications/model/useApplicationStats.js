"use client";

import { useState, useEffect } from "react";
import { applicationsApi } from "../api/applicationsApi";

export function useApplicationStats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await applicationsApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to fetch stats");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return { stats, loading, error, refetch: fetchStats };
}
