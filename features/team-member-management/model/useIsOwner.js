"use client";

import { useState, useEffect } from "react";
import { teamMemberManagementApi } from "../api/teamMemberManagementApi";

export function useIsOwner() {
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkOwnership() {
      try {
        setLoading(true);
        const data = await teamMemberManagementApi.checkIsOwner();
        setIsOwner(data.isOwner);
      } catch {
        setIsOwner(false);
      } finally {
        setLoading(false);
      }
    }

    checkOwnership();
  }, []);

  return { isOwner, loading };
}
