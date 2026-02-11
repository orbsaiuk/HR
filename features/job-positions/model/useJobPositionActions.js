"use client";

import { useState } from "react";
import { jobPositionsApi } from "../api/jobPositionsApi";

export function useJobPositionActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const createPosition = async (data) => {
    try {
      setActionLoading(true);
      const result = await jobPositionsApi.create(data);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to create position",
      };
    } finally {
      setActionLoading(false);
    }
  };

  const updatePosition = async (id, data) => {
    try {
      setActionLoading(true);
      const result = await jobPositionsApi.update(id, data);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to update position",
      };
    } finally {
      setActionLoading(false);
    }
  };

  const deletePosition = async (id) => {
    try {
      setActionLoading(true);
      await jobPositionsApi.delete(id);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to delete position",
      };
    } finally {
      setActionLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(true);
      const result = await jobPositionsApi.updateStatus(id, status);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to update status",
      };
    } finally {
      setActionLoading(false);
    }
  };

  return {
    createPosition,
    updatePosition,
    deletePosition,
    updateStatus,
    actionLoading,
  };
}
