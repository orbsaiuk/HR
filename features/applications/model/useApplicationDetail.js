"use client";

import { useState, useEffect } from "react";
import { applicationsApi } from "../api/applicationsApi";

export function useApplicationDetail(id) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplication = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await applicationsApi.getById(id);
      setApplication(data);
    } catch (err) {
      setError(err.message || "Failed to fetch application");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplication();
  }, [id]);

  return {
    application,
    loading,
    error,
    refetch: fetchApplication,
    setApplication,
  };
}
