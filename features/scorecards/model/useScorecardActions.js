"use client";

import { useState } from "react";
import { scorecardsApi } from "../api/scorecardsApi";

export function useScorecardActions() {
  const [actionLoading, setActionLoading] = useState(false);

  const submitScorecard = async (applicationId, data) => {
    try {
      setActionLoading(true);
      const result = await scorecardsApi.upsert(applicationId, data);
      return { success: true, data: result };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to submit scorecard",
      };
    } finally {
      setActionLoading(false);
    }
  };

  const deleteScorecard = async (applicationId, scorecardId) => {
    try {
      setActionLoading(true);
      await scorecardsApi.delete(applicationId, scorecardId);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to delete scorecard",
      };
    } finally {
      setActionLoading(false);
    }
  };

  return { submitScorecard, deleteScorecard, actionLoading };
}
