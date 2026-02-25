"use client";

import { FormsListPage } from "@/features/forms";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
    return (
        <PermissionGate permission={PERMISSIONS.VIEW_FORMS} behavior="block">
            <FormsListPage />
        </PermissionGate>
    );
}
