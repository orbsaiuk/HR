"use client";

import { useState, useEffect } from "react";
import { candidatePortalApi } from "../api/candidatePortalApi";

export function useMyApplicationDetail(id) {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchApplication() {
      try {
        setLoading(true);
        setError(null);
        const data = await candidatePortalApi.getMyApplicationById(id);
        if (!data) {
          setError("Application not found");
        } else {
          setApplication(data);
        }
      } catch (err) {
        setError(err.message || "Failed to load application details");
      } finally {
        setLoading(false);
      }
    }

    fetchApplication();
  }, [id]);

  return { application, loading, error };
}
