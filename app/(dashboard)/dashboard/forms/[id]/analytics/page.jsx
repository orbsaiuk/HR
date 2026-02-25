"use client";

import { useParams } from "next/navigation";
import { AnalyticsPage } from "@/features/analytics";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
    const params = useParams();
    return (
        <PermissionGate permission={PERMISSIONS.VIEW_ANALYTICS} behavior="block">
            <AnalyticsPage formId={params.id} />
        </PermissionGate>
    );
}
