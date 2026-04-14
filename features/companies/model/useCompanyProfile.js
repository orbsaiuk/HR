"use client";

import { useState, useEffect, useCallback } from "react";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

/**
 * Hook to fetch and update the current company's profile (dashboard context).
 */
export function useCompanyProfile() {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const fetchProfile = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiClient.get(API_ENDPOINTS.COMPANY_PROFILE);
            setCompany(data);
        } catch (err) {
            setError(err.message || "فشل في تحميل بيانات الشركة");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const updateProfile = useCallback(async (updates) => {
        try {
            setSaving(true);
            setError(null);
            const data = await apiClient.put(API_ENDPOINTS.COMPANY_PROFILE, updates);
            setCompany(data);
            return { success: true };
        } catch (err) {
            const message = err.message || "فشل في تحديث بيانات الشركة";
            setError(message);
            return { success: false, error: message };
        } finally {
            setSaving(false);
        }
    }, []);

    return { company, loading, saving, error, refetch: fetchProfile, updateProfile };
}
