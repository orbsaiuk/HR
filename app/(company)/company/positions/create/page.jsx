"use client";

import { JobPositionCreatePage } from "@/features/job-positions";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
  return (
    <PermissionGate permission={PERMISSIONS.MANAGE_POSITIONS} behavior="block">
      <JobPositionCreatePage />
    </PermissionGate>
  );
}
