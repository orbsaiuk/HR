"use client";

import { useState, useEffect } from "react";
import { companiesApi } from "../api/companiesApi";

/**
 * Hook to fetch platform-wide stats for the landing page.
 */
export function usePlatformStats() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        companiesApi
            .getPlatformStats()
            .then(setStats)
            .catch(() => setStats(null))
            .finally(() => setLoading(false));
    }, []);

    return { stats, loading };
}
