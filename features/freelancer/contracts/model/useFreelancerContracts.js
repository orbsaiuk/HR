"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  getFreelancerContracts,
  updateFreelancerContractStatus,
} from "../api/freelancerContractsApi";

/**
 * Hook for the freelancer contracts list.
 * Mirrors the 4-state pattern of useFreelancerProfile.
 */
export function useFreelancerContracts() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getFreelancerContracts();
      setContracts(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "فشل تحميل العقود");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  const updateStatus = useCallback(async (contractId, newStatus) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId || c._id === contractId
          ? { ...c, status: newStatus }
          : c,
      ),
    );

    try {
      setUpdating(true);
      await updateFreelancerContractStatus(contractId, newStatus);
      toast.success(
        newStatus === "accepted"
          ? "تم قبول العقد بنجاح"
          : "تم رفض العقد",
      );
    } catch (err) {
      setContracts((prev) =>
        prev.map((c) =>
          c.id === contractId || c._id === contractId
            ? { ...c, status: "received" }
            : c,
        ),
      );
      toast.error(err.message || "فشل تحديث حالة العقد");
      throw err;
    } finally {
      setUpdating(false);
    }
  }, []);

  const filteredContracts = useMemo(() => {
    let result = contracts;

    if (activeTab !== "ALL") {
      result = result.filter((c) => c.status === activeTab.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.organization?.name?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [contracts, activeTab, searchQuery]);

  return {
    contracts,
    filteredContracts,
    loading,
    updating,
    error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    updateStatus,
    refetch: fetchContracts,
  };
}
