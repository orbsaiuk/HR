"use client";

import { useState, useEffect } from "react";
import { jobPositionsApi } from "../api/jobPositionsApi";

export function useJobPositionsList() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobPositionsApi.getAll();
      setPositions(data);
    } catch (err) {
      setError(err.message || "Failed to fetch job positions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  return { positions, loading, error, refetch: fetchPositions, setPositions };
}
