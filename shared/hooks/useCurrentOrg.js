"use client";

import { useState, useEffect } from "react";

/**
 * Hook to fetch the current organization's Sanity data (name, logo, etc.)
 * via the /api/organizations endpoint.
 */
export function useCurrentOrg() {
    const [org, setOrg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchOrg() {
            try {
                const res = await fetch("/api/organizations");
                if (!res.ok) throw new Error("Failed to fetch org");
                const data = await res.json();
                if (!cancelled) setOrg(data);
            } catch {
                // Silently fail — org data is optional for the header
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchOrg();
        return () => { cancelled = true; };
    }, []);

    return { org, loading };
}
