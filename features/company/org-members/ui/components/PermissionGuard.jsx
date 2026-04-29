"use client";

import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function PermissionGuard({ children }) {
  return (
    <PermissionGate
      permission={PERMISSIONS.MANAGE_TEAM}
      behavior="block"
      message="ليس لديك صلاحية لإدارة أعضاء الشركة."
    >
      {children}
    </PermissionGate>
  );
}
