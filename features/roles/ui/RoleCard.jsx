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
import { ADMIN_ROLE_KEY } from "@/shared/lib/permissions";

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

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete the "${role.name}" role?`)) {
            await onDelete(role._key);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div>
                        <CardTitle className="text-lg">{role.name}</CardTitle>
                        <CardDescription>{role.description || "No description"}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        {isAdmin && <Badge variant="default">Admin</Badge>}
                        {role.isSystem && !isAdmin && <Badge variant="secondary">System</Badge>}
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Users className="h-4 w-4" />
                    <span>{role.memberCount || 0} member{(role.memberCount || 0) !== 1 ? "s" : ""}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                    {(role.permissions || []).slice(0, 5).map((perm) => (
                        <Badge key={perm} variant="outline" className="text-xs">
                            {perm.replace(/_/g, " ")}
                        </Badge>
                    ))}
                    {(role.permissions || []).length > 5 && (
                        <Badge variant="outline" className="text-xs">
                            +{(role.permissions || []).length - 5} more
                        </Badge>
                    )}
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <EditRoleDialog
                    role={role}
                    onSave={onEdit}
                    disabled={!canEdit}
                />

                {canDelete && (
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
