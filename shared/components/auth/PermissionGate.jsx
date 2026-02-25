"use client";

import { Children, cloneElement, isValidElement } from "react";
import { usePermissions } from "@/features/team-member-management/model/usePermissions";
import { Loading } from "@/shared/components/feedback/Loading";
import { AccessDenied } from "./AccessDenied";

export function PermissionGate({
    permission,
    anyOf,
    allOf,
    fallback = null,
    behavior = "hide",
    message,
    children,
}) {
    const { hasPermission, loading } = usePermissions();

    // Show loading state
    if (loading) {
        if (behavior === "block") {
            return <Loading fullPage />;
        }
        // For hide/disable behaviors, render nothing while loading
        return null;
    }

    // Determine if the user has the required permission(s)
    const allowed = checkPermissions({ permission, anyOf, allOf, hasPermission });

    if (allowed) {
        return <>{children}</>;
    }

    // User is denied — handle based on behavior
    switch (behavior) {
        case "block":
            return fallback || <AccessDenied message={message} />;

        case "disable":
            return (
                <>
                    {Children.map(children, (child) => {
                        if (isValidElement(child)) {
                            return cloneElement(child, { disabled: true });
                        }
                        return child;
                    })}
                </>
            );

        case "hide":
        default:
            return fallback;
    }
}

/**
 * Check if the user has the required permission(s).
 * Supports single permission, anyOf, and allOf checks.
 */
function checkPermissions({ permission, anyOf, allOf, hasPermission }) {
    if (permission) {
        return hasPermission(permission);
    }

    if (anyOf && anyOf.length > 0) {
        return anyOf.some((p) => hasPermission(p));
    }

    if (allOf && allOf.length > 0) {
        return allOf.every((p) => hasPermission(p));
    }

    // No permission specified — allow by default
    return true;
}
