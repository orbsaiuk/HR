"use client";

import { useMemo } from "react";
import {
    ALL_PERMISSIONS,
    expandPermissions,
    getPermissionGroups,
    getPermissionsByGroup,
} from "@/shared/lib/permissions";
import { Check, X } from "lucide-react";

/**
 * Shows a visual preview of what a role can and cannot do,
 * including permissions that are auto-granted via implication rules.
 */
export function PermissionPreview({ selected }) {
    const groups = useMemo(() => getPermissionGroups(), []);

    // Expand permissions to include implied ones
    const effectivePermissions = useMemo(
        () => expandPermissions(selected),
        [selected],
    );

    const impliedOnly = useMemo(
        () => effectivePermissions.filter((p) => !selected.includes(p)),
        [selected, effectivePermissions],
    );

    if (selected.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
                No permissions selected. Select permissions above to see a preview.
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 bg-gray-50/50 p-4 space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-gray-900">Role Preview</h4>
                <span className="text-xs text-gray-500">
                    {effectivePermissions.length} of {ALL_PERMISSIONS.length} permissions
                    {impliedOnly.length > 0 && (
                        <span className="text-amber-600"> ({impliedOnly.length} auto-granted)</span>
                    )}
                </span>
            </div>

            <div className="space-y-3">
                {groups.map((group) => {
                    const groupPerms = getPermissionsByGroup(group);
                    return (
                        <div key={group}>
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1.5">
                                {group}
                            </p>
                            <div className="space-y-1">
                                {groupPerms.map((perm) => {
                                    const isExplicit = selected.includes(perm.key);
                                    const isImplied = impliedOnly.includes(perm.key);
                                    const hasAccess = isExplicit || isImplied;

                                    return (
                                        <div
                                            key={perm.key}
                                            className={`flex items-center gap-2 text-xs rounded px-2 py-1 ${hasAccess
                                                    ? "text-gray-900 bg-green-50/50"
                                                    : "text-gray-400"
                                                }`}
                                        >
                                            {hasAccess ? (
                                                <Check className="h-3 w-3 text-green-600 shrink-0" />
                                            ) : (
                                                <X className="h-3 w-3 text-gray-300 shrink-0" />
                                            )}
                                            <span>{perm.label}</span>
                                            {isImplied && (
                                                <span className="text-[10px] text-amber-600 bg-amber-50 px-1 rounded">
                                                    implied
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
