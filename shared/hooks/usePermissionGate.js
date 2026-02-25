"use client";

import { useMemo } from "react";
import { usePermissions } from "@/features/team-member-management/model/usePermissions";

export function usePermissionGate(permissionOrConfig) {
    const { hasPermission, loading } = usePermissions();

    const allowed = useMemo(() => {
        if (loading) return false;

        // String shorthand: usePermissionGate("manage_forms")
        if (typeof permissionOrConfig === "string") {
            return hasPermission(permissionOrConfig);
        }

        // Object config: usePermissionGate({ anyOf: [...] })
        if (permissionOrConfig && typeof permissionOrConfig === "object") {
            const { permission, anyOf, allOf } = permissionOrConfig;

            if (permission) {
                return hasPermission(permission);
            }

            if (anyOf && anyOf.length > 0) {
                return anyOf.some((p) => hasPermission(p));
            }

            if (allOf && allOf.length > 0) {
                return allOf.every((p) => hasPermission(p));
            }
        }

        // No permission specified — allow by default
        return true;
    }, [permissionOrConfig, hasPermission, loading]);

    return { allowed, loading };
}
