"use client";

import { Children, cloneElement, isValidElement } from "react";
import { usePermissions } from "@/features/team-member-management/model/usePermissions";
import { Loading } from "@/shared/components/feedback/Loading";
import { AccessDenied } from "./AccessDenied";
import { PERMISSION_METADATA } from "@/shared/lib/permissions";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * Resolve a human-readable description of the required permission(s)
 * for use in tooltips and disabled state messages.
 */
function getRequiredPermissionLabel(permission, anyOf, allOf) {
    if (permission) {
        const meta = PERMISSION_METADATA[permission];
        return meta ? meta.label : permission.replace(/_/g, " ");
    }
    if (anyOf && anyOf.length > 0) {
        const labels = anyOf.map((p) => {
            const meta = PERMISSION_METADATA[p];
            return meta ? meta.label : p.replace(/_/g, " ");
        });
        return labels.join(" or ");
    }
    if (allOf && allOf.length > 0) {
        const labels = allOf.map((p) => {
            const meta = PERMISSION_METADATA[p];
            return meta ? meta.label : p.replace(/_/g, " ");
        });
        return labels.join(" and ");
    }
    return null;
}

export function PermissionGate({
    permission,
    anyOf,
    allOf,
    fallback = null,
    behavior = "hide",
    message,
    children,
}) {
    const { hasPermission, loading, roleName } = usePermissions();

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
            return fallback || (
                <AccessDenied
                    message={message}
                    requiredPermission={permission}
                    requiredAnyOf={anyOf}
                    requiredAllOf={allOf}
                    roleName={roleName}
                />
            );

        case "disable": {
            const tooltipLabel = getRequiredPermissionLabel(permission, anyOf, allOf);
            const tooltipMessage = tooltipLabel
                ? `Requires the "${tooltipLabel}" permission`
                : "You don't have permission for this action";

            return (
                <TooltipProvider delayDuration={200}>
                    {Children.map(children, (child) => {
                        if (isValidElement(child)) {
                            const disabledChild = cloneElement(child, { disabled: true });
                            return (
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        {/* Wrap in span so tooltip works on disabled elements */}
                                        <span className="inline-block" tabIndex={0}>
                                            {disabledChild}
                                        </span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>{tooltipMessage}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        }
                        return child;
                    })}
                </TooltipProvider>
            );
        }

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
