"use client";

import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";

const EMPTY_DASHBOARD_STATS = {
  header: {
    companyName: "",
    greeting: "",
    subtitle: "",
  },
  metrics: [],
  applicantsSummary: {
    total: 0,
    label: "",
    segments: [],
  },
  jobsOverview: {
    rangeLabel: "",
    summary: {
      views: {
        value: 0,
        delta: 0,
      },
      applications: {
        value: 0,
        delta: 0,
      },
    },
    charts: {
      week: [],
      month: [],
      year: [],
    },
  },
  latestJobs: [],
};

export function useDashboardStats() {
  const [stats, setStats] = useState(EMPTY_DASHBOARD_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err.message || "Failed to fetch dashboard stats");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}
