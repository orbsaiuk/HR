"use client";

import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function PermissionGuard({ children }) {
    return (
        <PermissionGate
            permission={PERMISSIONS.MANAGE_TEAM}
            behavior="block"
            message="You don't have permission to manage team members."
        >
            {children}
        </PermissionGate>
    );
}
