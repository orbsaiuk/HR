"use client";

import { Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EditRoleDialog } from "./EditRoleDialog";
import {
  ADMIN_ROLE_KEY,
  PERMISSION_METADATA,
  getLocalizedRoleName,
  getLocalizedRoleDescription,
} from "@/shared/lib/permissions";

export function RoleCard({
  role,
  onEdit,
  onDelete,
  isEditing = false,
  editDisabled = false,
}) {
  const isAdmin = role._key === ADMIN_ROLE_KEY;
  const canEdit = !editDisabled;
  const canDelete = !isAdmin && !role.isSystem;
  const displayRoleName = getLocalizedRoleName(role._key, role.name);
  const displayRoleDescription = getLocalizedRoleDescription(
    role._key,
    role.description,
  );

  const handleDelete = async () => {
    if (confirm(`هل أنت متأكد من حذف دور "${displayRoleName}"؟`)) {
      await onDelete(role._key);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle className="text-lg">{displayRoleName}</CardTitle>
          <CardDescription>
            {displayRoleDescription || "لا يوجد وصف"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Users className="h-4 w-4" />
          <span>{role.memberCount || 0} عضو</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {(role.permissions || []).slice(0, 5).map((perm) => (
            <Badge key={perm} variant="outline" className="text-xs">
              {PERMISSION_METADATA[perm]?.label || perm.replace(/_/g, " ")}
            </Badge>
          ))}
          {(role.permissions || []).length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{(role.permissions || []).length - 5} إضافية
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <EditRoleDialog role={role} onSave={onEdit} disabled={!canEdit} />

        {canDelete && (
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-1" />
            حذف
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
