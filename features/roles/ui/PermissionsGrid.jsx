"use client";

import { useMemo } from "react";
import {
    PERMISSION_IMPLICATIONS,
    getPermissionGroups,
    getPermissionsByGroup,
    getDependencyWarnings,
} from "@/shared/lib/permissions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export function PermissionsGrid({ selected, onChange, disabled = false }) {
    const groups = useMemo(() => getPermissionGroups(), []);

    const warnings = useMemo(() => getDependencyWarnings(selected), [selected]);

    const handleToggle = (permissionKey) => {
        if (disabled) return;

        const newSelected = selected.includes(permissionKey)
            ? selected.filter((p) => p !== permissionKey)
            : [...selected, permissionKey];
        onChange(newSelected);
    };

    const handleToggleGroup = (group) => {
        if (disabled) return;

        const groupPerms = getPermissionsByGroup(group);
        const groupKeys = groupPerms.map((p) => p.key);
        const allSelected = groupKeys.every((k) => selected.includes(k));

        let newSelected;
        if (allSelected) {
            // Deselect all in group
            newSelected = selected.filter((p) => !groupKeys.includes(p));
        } else {
            // Select all in group
            const toAdd = groupKeys.filter((k) => !selected.includes(k));
            newSelected = [...selected, ...toAdd];
        }
        onChange(newSelected);
    };

    const isGroupAllSelected = (group) => {
        const groupPerms = getPermissionsByGroup(group);
        return groupPerms.every((p) => selected.includes(p.key));
    };

    const isGroupPartiallySelected = (group) => {
        const groupPerms = getPermissionsByGroup(group);
        const someSelected = groupPerms.some((p) => selected.includes(p.key));
        const allSelected = groupPerms.every((p) => selected.includes(p.key));
        return someSelected && !allSelected;
    };

    // Build a set of permissions that are implied by currently selected ones
    const impliedPermissions = useMemo(() => {
        const implied = new Set();
        for (const perm of selected) {
            const deps = PERMISSION_IMPLICATIONS[perm];
            if (deps) {
                for (const dep of deps) {
                    if (!selected.includes(dep)) {
                        implied.add(dep);
                    }
                }
            }
        }
        return implied;
    }, [selected]);

    return (
        <div className="space-y-6">
            {/* Dependency warnings */}
            {warnings.length > 0 && (
                <div className="rounded-md border border-amber-200 bg-amber-50 p-3 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-amber-800">
                        <AlertTriangle className="h-4 w-4" />
                        Dependency Warnings
                    </div>
                    {warnings.map((w) => (
                        <p key={`${w.requiredBy}-${w.permission}`} className="text-xs text-amber-700 ml-6">
                            <span className="font-medium">{w.requiredByLabel}</span> requires{" "}
                            <span className="font-medium">{w.label}</span> — it will be auto-granted via implication rules
                        </p>
                    ))}
                </div>
            )}

            {/* Permission groups */}
            {groups.map((group) => {
                const groupPerms = getPermissionsByGroup(group);
                const allSelected = isGroupAllSelected(group);
                const partiallySelected = isGroupPartiallySelected(group);

                return (
                    <div key={group}>
                        <div className="flex items-center gap-3 mb-3">
                            <Checkbox
                                id={`group-${group}`}
                                checked={allSelected}
                                // Show indeterminate state for partial selection
                                data-state={partiallySelected ? "indeterminate" : allSelected ? "checked" : "unchecked"}
                                onCheckedChange={() => handleToggleGroup(group)}
                                disabled={disabled}
                                className={partiallySelected ? "data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground" : ""}
                            />
                            <Label
                                htmlFor={`group-${group}`}
                                className="text-sm font-semibold text-gray-900 cursor-pointer select-none"
                            >
                                {group}
                                <span className="ml-2 text-xs font-normal text-gray-500">
                                    ({groupPerms.filter((p) => selected.includes(p.key)).length}/{groupPerms.length})
                                </span>
                            </Label>
                        </div>
                        <div className="grid grid-cols-2 gap-3 ml-6">
                            {groupPerms.map((perm) => {
                                const isImplied = impliedPermissions.has(perm.key);
                                return (
                                    <div key={perm.key} className="flex items-start space-x-3">
                                        <Checkbox
                                            id={perm.key}
                                            checked={selected.includes(perm.key)}
                                            onCheckedChange={() => handleToggle(perm.key)}
                                            disabled={disabled}
                                        />
                                        <div className="grid gap-1 leading-none">
                                            <Label
                                                htmlFor={perm.key}
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                {perm.label}
                                                {isImplied && (
                                                    <span className="ml-1.5 text-[10px] font-normal text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                                        auto-granted
                                                    </span>
                                                )}
                                            </Label>
                                            <p className="text-xs text-gray-500">{perm.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
