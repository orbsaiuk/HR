"use client";

import { useParams } from "next/navigation";
import { FormDetailPage } from "@/features/forms";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
    const params = useParams();
    return (
        <PermissionGate permission={PERMISSIONS.VIEW_FORMS} behavior="block">
            <FormDetailPage formId={params.id} />
        </PermissionGate>
    );
}
