"use client";

import { FormCreatePage } from "@/features/forms";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
    return (
        <PermissionGate permission={PERMISSIONS.MANAGE_FORMS} behavior="block">
            <FormCreatePage />
        </PermissionGate>
    );
}
