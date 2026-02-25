"use client";

import { useParams } from "next/navigation";
import { JobPositionEditPage } from "@/features/job-positions";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
  const params = useParams();
  return (
    <PermissionGate permission={PERMISSIONS.MANAGE_POSITIONS} behavior="block">
      <JobPositionEditPage positionId={params.id} />
    </PermissionGate>
  );
}
