"use client";

import { useState, useEffect, useCallback } from "react";
import { careersApi } from "../api/careersApi";

export function useCareersList() {
  const [positions, setPositions] = useState([]);
  const [filters, setFilters] = useState({ departments: [], locations: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Active filter state
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");

  const fetchPositions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await careersApi.getPositions({
        search,
        department,
        location,
        type,
      });
      setPositions(data);
    } catch (err) {
      setError(err.message || "Failed to load positions");
    } finally {
      setLoading(false);
    }
  }, [search, department, location, type]);

  const fetchFilters = useCallback(async () => {
    try {
      const data = await careersApi.getFilters();
      setFilters(data);
    } catch {
      // Filters are non-critical, silently fail
    }
  }, []);

  useEffect(() => {
    fetchPositions();
  }, [fetchPositions]);

  useEffect(() => {
    fetchFilters();
  }, [fetchFilters]);

  const clearFilters = useCallback(() => {
    setSearch("");
    setDepartment("");
    setLocation("");
    setType("");
  }, []);

  return {
    positions,
    filters,
    loading,
    error,
    search,
    setSearch,
    department,
    setDepartment,
    location,
    setLocation,
    type,
    setType,
    clearFilters,
    refetch: fetchPositions,
  };
}
