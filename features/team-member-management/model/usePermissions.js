"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import { PermissionsContext } from "@/shared/providers/PermissionsProvider";
import { teamMemberManagementApi } from "../api/teamMemberManagementApi";

export function usePermissions() {
    const context = useContext(PermissionsContext);
    const hasProvider = context !== null;

    // Local state — only used when no provider is present
    const [localPermissions, setLocalPermissions] = useState([]);
    const [localRoleKey, setLocalRoleKey] = useState(null);
    const [localRoleName, setLocalRoleName] = useState(null);
    const [localLoading, setLocalLoading] = useState(true);

    useEffect(() => {
        // Skip fetch if a provider is supplying permissions
        if (hasProvider) return;

        let cancelled = false;

        async function fetchPermissions() {
            try {
                setLocalLoading(true);
                const data = await teamMemberManagementApi.getMyPermissions();
                if (!cancelled) {
                    setLocalPermissions(data.permissions || []);
                    setLocalRoleKey(data.roleKey || null);
                    setLocalRoleName(data.roleName || null);
                }
            } catch {
                if (!cancelled) {
                    setLocalPermissions([]);
                    setLocalRoleKey(null);
                    setLocalRoleName(null);
                }
            } finally {
                if (!cancelled) {
                    setLocalLoading(false);
                }
            }
        }

        fetchPermissions();

        return () => {
            cancelled = true;
        };
    }, [hasProvider]);

    const localHasPermission = useCallback(
        (key) => localPermissions.includes(key),
        [localPermissions],
    );

    // If a PermissionsProvider is wrapping this component, use its shared state
    if (hasProvider) {
        return context;
    }

    // Fallback: no provider present — use local state
    return {
        permissions: localPermissions,
        hasPermission: localHasPermission,
        loading: localLoading,
        roleKey: localRoleKey,
        roleName: localRoleName,
    };
}
