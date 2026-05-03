"use client";

import { useState, useEffect } from "react";
import { dashboardApi } from "../api/dashboardApi";

const EMPTY_STATS = {
  header: { name: "", activeCount: 0, newCount: 0 },
  stats: { activeProjects: 0, totalEarnings: 0, rating: "0.0", sentProposals: 0 },
  recentApplications: [],
};

export function useFreelancerDashboard() {
  const [data, setData] = useState(EMPTY_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await dashboardApi.getStats();
      setData(res);
    } catch (err) {
      setError(err.message || "حدث خطأ أثناء جلب الإحصائيات");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchStats,
  };
}
