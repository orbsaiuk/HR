"use client";

import { useParams } from "next/navigation";
import { FormEditPage } from "@/features/forms";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
    const params = useParams();
    return (
        <PermissionGate permission={PERMISSIONS.MANAGE_FORMS} behavior="block">
            <FormEditPage formId={params.id} />
        </PermissionGate>
    );
}
