"use client";

import { createContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";
import { teamMemberManagementApi } from "@/features/team-member-management/api/teamMemberManagementApi";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";


export const PermissionsContext = createContext(null);

export function PermissionsProvider({ children }) {
    const [permissions, setPermissions] = useState([]);
    const [roleKey, setRoleKey] = useState(null);
    const [roleName, setRoleName] = useState(null);
    const [loading, setLoading] = useState(true);
    const pathname = usePathname();

    // Track the last known permissions version to detect changes
    const knownVersionRef = useRef(null);

    const fetchPermissions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await teamMemberManagementApi.getMyPermissions();
            setPermissions(data.permissions || []);
            setRoleKey(data.roleKey || null);
            setRoleName(data.roleName || null);
        } catch {
            setPermissions([]);
            setRoleKey(null);
            setRoleName(null);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch on mount
    useEffect(() => {
        fetchPermissions();
    }, [fetchPermissions]);

    // Version check on route change — re-fetch if permissions have changed
    useEffect(() => {
        async function checkVersion() {
            try {
                const { version } = await apiClient.get(API_ENDPOINTS.PERMISSIONS_VERSION);

                if (knownVersionRef.current === null) {
                    // First check — store the version without re-fetching
                    knownVersionRef.current = version;
                } else if (version !== knownVersionRef.current) {
                    // Version changed — invalidate and re-fetch
                    knownVersionRef.current = version;
                    await fetchPermissions();
                }
            } catch {
                // Version check failure is non-critical — ignore silently
            }
        }

        checkVersion();
    }, [pathname, fetchPermissions]);

    const hasPermission = useCallback(
        (key) => permissions.includes(key),
        [permissions],
    );

    const value = useMemo(
        () => ({ permissions, hasPermission, loading, roleKey, roleName }),
        [permissions, hasPermission, loading, roleKey, roleName],
    );

    return (
        <PermissionsContext.Provider value={value}>
            {children}
        </PermissionsContext.Provider>
    );
}
