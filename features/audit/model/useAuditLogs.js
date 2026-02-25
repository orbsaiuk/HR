"use client";

import { useState, useEffect, useCallback } from "react";
import { auditApi } from "../api/auditApi";

export function useAuditLogs(initialFilters = {}) {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: initialFilters.category || "",
        actor: initialFilters.actor || "",
        limit: initialFilters.limit || 50,
    });

    const fetchLogs = useCallback(async (currentFilters) => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (currentFilters.category) params.category = currentFilters.category;
            if (currentFilters.actor) params.actor = currentFilters.actor;
            if (currentFilters.limit) params.limit = currentFilters.limit;

            const data = await auditApi.getLogs(params);
            setLogs(data.logs || []);
            setTotal(data.total || 0);
        } catch (err) {
            setError(err.message || "Failed to fetch audit logs");
            console.error("Error fetching audit logs:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLogs(filters);
    }, [filters, fetchLogs]);

    const updateFilters = useCallback((newFilters) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    const refetch = useCallback(() => {
        fetchLogs(filters);
    }, [filters, fetchLogs]);

    return {
        logs,
        total,
        loading,
        error,
        filters,
        updateFilters,
        refetch,
    };
}
