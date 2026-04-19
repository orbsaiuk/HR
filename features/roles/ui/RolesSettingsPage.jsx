"use client";

import { useState, useEffect } from "react";
import { useRoles } from "../model/useRoles";
import { RoleCard } from "./RoleCard";
import { CreateRoleDialog } from "./CreateRoleDialog";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Loading } from "@/shared/components/feedback/Loading";

// Fetch the user's permissions from an API
async function fetchUserPermissions() {
  try {
    const response = await fetch("/api/user/permissions");
    if (!response.ok) return [];
    const data = await response.json();
    // The endpoint returns { permissions, roleKey, roleName }
    return data.permissions || [];
  } catch {
    return [];
  }
}

export function RolesSettingsPage() {
  const { roles, loading, error, createRole, updateRole, deleteRole } =
    useRoles();
  const [userPermissions, setUserPermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(true);

  useEffect(() => {
    fetchUserPermissions().then((perms) => {
      setUserPermissions(perms);
      setPermissionsLoading(false);
    });
  }, []);

  const canManageRoles =
    !permissionsLoading && userPermissions.includes(PERMISSIONS.MANAGE_ROLES);
  const isContentLoading = loading || permissionsLoading;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            الأدوار والصلاحيات
          </h2>
          <p className="text-gray-500">إدارة الأدوار والصلاحيات داخل الشركة.</p>
        </div>
        <CreateRoleDialog onCreate={createRole} disabled={!canManageRoles} />
      </div>

      {!permissionsLoading && !canManageRoles && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            لا تملك صلاحية إدارة الأدوار. يمكنك العرض فقط دون الإنشاء أو التعديل
            أو الحذف.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {isContentLoading ? (
        <Loading />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {roles.map((role) => (
              <RoleCard
                key={role._key}
                role={role}
                onEdit={updateRole}
                onDelete={deleteRole}
                editDisabled={!canManageRoles}
              />
            ))}
          </div>

          {roles.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              لا توجد أدوار حالياً. أنشئ أول دور مخصص للبدء.
            </div>
          )}
        </>
      )}
    </div>
  );
}
