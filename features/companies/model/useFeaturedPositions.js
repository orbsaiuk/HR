"use client";

import { useState, useEffect } from "react";
import { companiesApi } from "../api/companiesApi";

/**
 * Hook to fetch featured positions for the landing page.
 */
export function useFeaturedPositions() {
    const [positions, setPositions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        companiesApi
            .getFeaturedPositions()
            .then(setPositions)
            .catch(() => setPositions([]))
            .finally(() => setLoading(false));
    }, []);

    return { positions, loading };
}
