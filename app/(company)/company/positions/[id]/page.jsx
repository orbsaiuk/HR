"use client";

import { useParams } from "next/navigation";
import { JobPositionDetailPage } from "@/features/job-positions";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
  const params = useParams();
  return (
    <PermissionGate permission={PERMISSIONS.VIEW_POSITIONS} behavior="block">
      <JobPositionDetailPage positionId={params.id} />
    </PermissionGate>
  );
}
