/**
 * Analytics hook
 */

import { useState, useEffect } from 'react';
import { analyticsApi } from '../api/analyticsApi';
import { formsApi } from '@/features/forms/api/formsApi';

export function useAnalytics(formId) {
    const [form, setForm] = useState(null);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        if (!formId) return;

        try {
            setLoading(true);
            setError(null);
            const [formData, analyticsData] = await Promise.all([
                formsApi.getById(formId),
                analyticsApi.getByFormId(formId),
            ]);
            setForm(formData);
            setAnalytics(analyticsData);
        } catch (err) {
            setError(err.message || 'Failed to fetch analytics');
            console.error('Error fetching analytics:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [formId]);

    return {
        form,
        analytics,
        loading,
        error,
        refetch: fetchData,
    };
}
