"use client";

import { PERMISSIONS, PERMISSION_METADATA } from "@/shared/lib/permissions";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

// Group permissions by their group property
function groupPermissionsByCategory() {
    const groups = {};
    for (const [key, meta] of Object.entries(PERMISSION_METADATA)) {
        const group = meta.group || "Other";
        if (!groups[group]) groups[group] = [];
        groups[group].push({ key, ...meta });
    }
    return groups;
}

export function PermissionsGrid({ selected, onChange, disabled = false }) {
    const groups = groupPermissionsByCategory();

    const handleToggle = (permissionKey) => {
        if (disabled) return;

        const newSelected = selected.includes(permissionKey)
            ? selected.filter((p) => p !== permissionKey)
            : [...selected, permissionKey];
        onChange(newSelected);
    };

    return (
        <div className="space-y-6">
            {Object.entries(groups).map(([group, permissions]) => (
                <div key={group}>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">{group}</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {permissions.map((perm) => (
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
                                    </Label>
                                    <p className="text-xs text-gray-500">{perm.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
