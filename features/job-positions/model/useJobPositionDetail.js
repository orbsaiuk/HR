"use client";

import { useState, useEffect } from "react";
import { jobPositionsApi } from "../api/jobPositionsApi";

export function useJobPositionDetail(id) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosition = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await jobPositionsApi.getById(id);
      setPosition(data);
    } catch (err) {
      setError(err.message || "Failed to fetch job position");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosition();
  }, [id]);

  return { position, loading, error, refetch: fetchPosition, setPosition };
}
