"use client";

import { useParams } from "next/navigation";
import { PositionApplicationsPage } from "@/features/applications";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export default function Page() {
  const params = useParams();
  return (
    <PermissionGate permission={PERMISSIONS.VIEW_APPLICATIONS} behavior="block">
      <PositionApplicationsPage positionId={params.id} />
    </PermissionGate>
  );
}
