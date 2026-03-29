"use client";

import { JobPositionsListPage } from "@/features/job-positions";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
  return (
    <PermissionGate permission={PERMISSIONS.VIEW_POSITIONS} behavior="block">
      <JobPositionsListPage />
    </PermissionGate>
  );
}
