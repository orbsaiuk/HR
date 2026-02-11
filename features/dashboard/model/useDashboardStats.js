'use client'

import { useState, useEffect } from 'react';
import { dashboardApi } from '../api/dashboardApi';

export function useDashboardStats() {
    const [stats, setStats] = useState({
        totalForms: 0,
        publishedForms: 0,
        draftForms: 0,
        totalResponses: 0,
        recentActivity: [],
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await dashboardApi.getStats();
            setStats(data);
        } catch (err) {
            setError(err.message || 'Failed to fetch dashboard stats');
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    return {
        stats,
        loading,
        error,
        refetch: fetchStats,
    };
}
