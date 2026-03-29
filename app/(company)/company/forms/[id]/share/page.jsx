"use client";

import { useParams } from "next/navigation";
import { FormSharePage } from "@/features/forms";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
    const params = useParams();
    return (
        <PermissionGate permission={PERMISSIONS.MANAGE_FORMS} behavior="block">
            <FormSharePage formId={params.id} />
        </PermissionGate>
    );
}
