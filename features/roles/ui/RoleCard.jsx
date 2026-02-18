"use client";

import { useState } from "react";
import { Pencil, Trash2, Users } from "lucide-react";
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { PermissionsGrid } from "./PermissionsGrid";
import { ADMIN_ROLE_KEY } from "@/shared/lib/permissions";

export function RoleCard({
    role,
    onEdit,
    onDelete,
    isEditing = false,
    editDisabled = false,
}) {
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editName, setEditName] = useState(role.name);
    const [editDescription, setEditDescription] = useState(role.description || "");
    const [editPermissions, setEditPermissions] = useState(role.permissions || []);
    const [saving, setSaving] = useState(false);

    const isAdmin = role._key === ADMIN_ROLE_KEY;
    const canEdit = !editDisabled;
    const canDelete = !isAdmin && !role.isSystem;

    const handleSave = async () => {
        setSaving(true);
        try {
            await onEdit(role._key, {
                name: editName,
                description: editDescription,
                permissions: editPermissions,
            });
            setEditDialogOpen(false);
        } catch (err) {
            console.error("Failed to save:", err);
        } finally {
            setSaving(false);
        }
    };

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
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" disabled={!canEdit}>
                            <Pencil className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Edit Role: {role.name}</DialogTitle>
                            <DialogDescription>
                                Update the role name, description, and permissions.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                    rows={2}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Permissions</label>
                                <PermissionsGrid
                                    selected={editPermissions}
                                    onChange={setEditPermissions}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={saving}>
                                {saving ? "Saving..." : "Save Changes"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

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