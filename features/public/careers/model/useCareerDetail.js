"use client";

import { useState, useEffect } from "react";
import { careersApi } from "../api/careersApi";

export function useCareerDetail(id) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchPosition() {
      try {
        setLoading(true);
        setError(null);
        const data = await careersApi.getById(id);
        if (!data) {
          setError("Position not found or no longer open");
        } else {
          setPosition(data);
        }
      } catch (err) {
        setError(err.message || "Failed to load position");
      } finally {
        setLoading(false);
      }
    }

    fetchPosition();
  }, [id]);

  return { position, loading, error };
}
