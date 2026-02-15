"use client";

import { useState, useEffect, useCallback } from "react";
import { candidatePortalApi } from "../api/candidatePortalApi";

export function useMyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter state
  const [statusFilter, setStatusFilter] = useState("");

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await candidatePortalApi.getMyApplications();
      setApplications(data);
    } catch (err) {
      setError(err.message || "Failed to load your applications");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const filteredApplications = statusFilter
    ? applications.filter((a) => a.status === statusFilter)
    : applications;

  const stats = {
    total: applications.length,
    new: applications.filter((a) => a.status === "new").length,
    screening: applications.filter((a) => a.status === "screening").length,
    interview: applications.filter((a) => a.status === "interview").length,
    offered: applications.filter((a) => a.status === "offered").length,
    hired: applications.filter((a) => a.status === "hired").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  return {
    applications: filteredApplications,
    allApplications: applications,
    stats,
    loading,
    error,
    statusFilter,
    setStatusFilter,
    refetch: fetchApplications,
  };
}
