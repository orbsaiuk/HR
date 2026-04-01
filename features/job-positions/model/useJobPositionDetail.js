"use client";

import { useState, useEffect } from "react";
import { jobPositionsApi } from "../api/jobPositionsApi";
import { MOCK_POSITION_CARDS } from "../lib/mockPositions";

export function useJobPositionDetail(id) {
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosition = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);

      const mockPosition = MOCK_POSITION_CARDS.find(
        (item) => item._id === id || item.id === id || item.slug === id,
      );
      if (mockPosition) {
        setPosition({ ...mockPosition });
        return;
      }

      const data = await jobPositionsApi.getById(id);
      setPosition(data);
    } catch (err) {
      setError(err.message || "فشل في جلب تفاصيل الوظيفة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosition();
  }, [id]);

  return { position, loading, error, refetch: fetchPosition, setPosition };
}
