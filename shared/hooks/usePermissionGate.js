"use client";

import { useMemo } from "react";
import { usePermissions } from "@/features/team-member-management/model/usePermissions";
import { PERMISSION_METADATA } from "@/shared/lib/permissions";


export function usePermissionGate(permissionOrConfig) {
    const { hasPermission, loading, roleName } = usePermissions();

    const result = useMemo(() => {
        if (loading) {
            return { allowed: false, requiredLabel: null };
        }

        // String shorthand: usePermissionGate("manage_forms")
        if (typeof permissionOrConfig === "string") {
            const meta = PERMISSION_METADATA[permissionOrConfig];
            const label = meta ? meta.label : permissionOrConfig.replace(/_/g, " ");
            return {
                allowed: hasPermission(permissionOrConfig),
                requiredLabel: label,
            };
        }

        // Object config: usePermissionGate({ anyOf: [...] })
        if (permissionOrConfig && typeof permissionOrConfig === "object") {
            const { permission, anyOf, allOf } = permissionOrConfig;

            if (permission) {
                const meta = PERMISSION_METADATA[permission];
                const label = meta ? meta.label : permission.replace(/_/g, " ");
                return {
                    allowed: hasPermission(permission),
                    requiredLabel: label,
                };
            }

            if (anyOf && anyOf.length > 0) {
                const labels = anyOf.map((p) => {
                    const meta = PERMISSION_METADATA[p];
                    return meta ? meta.label : p.replace(/_/g, " ");
                });
                return {
                    allowed: anyOf.some((p) => hasPermission(p)),
                    requiredLabel: labels.join(" or "),
                };
            }

            if (allOf && allOf.length > 0) {
                const labels = allOf.map((p) => {
                    const meta = PERMISSION_METADATA[p];
                    return meta ? meta.label : p.replace(/_/g, " ");
                });
                return {
                    allowed: allOf.every((p) => hasPermission(p)),
                    requiredLabel: labels.join(" and "),
                };
            }
        }

        // No permission specified — allow by default
        return { allowed: true, requiredLabel: null };
    }, [permissionOrConfig, hasPermission, loading]);

    return { ...result, loading, roleName };
}
