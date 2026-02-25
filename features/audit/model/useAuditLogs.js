"use client";

import { useState, useEffect, useCallback } from "react";
import { auditApi } from "../api/auditApi";

export function useAuditLogs(initialFilters = {}) {
    const [logs, setLogs] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: initialFilters.category || "",
        actor: initialFilters.actor || "",
        startDate: initialFilters.startDate || "",
        endDate: initialFilters.endDate || "",
        page: initialFilters.page || 1,
        pageSize: initialFilters.pageSize || 25,
    });

    const fetchLogs = useCallback(async (currentFilters) => {
        try {
            setLoading(true);
            setError(null);

            const params = {};
            if (currentFilters.category) params.category = currentFilters.category;
            if (currentFilters.actor) params.actor = currentFilters.actor;
            if (currentFilters.startDate) params.startDate = currentFilters.startDate;
            if (currentFilters.endDate) params.endDate = currentFilters.endDate;
            if (currentFilters.page) params.page = currentFilters.page;
            if (currentFilters.pageSize) params.pageSize = currentFilters.pageSize;

            const data = await auditApi.getLogs(params);
            setLogs(data.logs || []);
            setTotal(data.total || 0);
            setTotalPages(data.totalPages || 0);
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
        setFilters((prev) => ({
            ...prev,
            ...newFilters,
            // Reset to page 1 when filters change (unless page is explicitly set)
            page: newFilters.page !== undefined ? newFilters.page : 1,
        }));
    }, []);

    const goToPage = useCallback((page) => {
        setFilters((prev) => ({ ...prev, page }));
    }, []);

    const refetch = useCallback(() => {
        fetchLogs(filters);
    }, [filters, fetchLogs]);

    /**
     * Get the export URL for the current filters.
     */
    const getExportUrl = useCallback(
        (format = "csv") => {
            return auditApi.getExportUrl({
                format,
                category: filters.category || undefined,
                startDate: filters.startDate || undefined,
                endDate: filters.endDate || undefined,
            });
        },
        [filters.category, filters.startDate, filters.endDate],
    );

    return {
        logs,
        total,
        totalPages,
        loading,
        error,
        filters,
        updateFilters,
        goToPage,
        refetch,
        getExportUrl,
    };
}
