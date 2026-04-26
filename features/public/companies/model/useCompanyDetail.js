"use client";

import { useState, useEffect, useCallback } from "react";
import { companiesApi } from "../api/companiesApi";

/**
 * Hook to fetch a single company's public profile by slug.
 */
export function useCompanyDetail(slug) {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCompany = useCallback(async () => {
        if (!slug) return;
        try {
            setLoading(true);
            setError(null);
            const data = await companiesApi.getBySlug(slug);
            setCompany(data);
        } catch (err) {
            setError(err.message || "Failed to load company");
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        fetchCompany();
    }, [fetchCompany]);

    return { company, loading, error, refetch: fetchCompany };
}
