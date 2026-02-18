"use client";

import { useState, useEffect, useCallback } from "react";
import { teamMemberManagementApi } from "../api/teamMemberManagementApi";

export function usePermissions() {
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPermissions() {
            try {
                setLoading(true);
                const data = await teamMemberManagementApi.getMyPermissions();
                setPermissions(data.permissions || []);
            } catch {
                setPermissions([]);
            } finally {
                setLoading(false);
            }
        }

        fetchPermissions();
    }, []);

    const hasPermission = useCallback(
        (key) => permissions.includes(key),
        [permissions],
    );

    return { permissions, hasPermission, loading };
}
