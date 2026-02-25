"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
import { PresetSelector } from "./PresetSelector";
import { PermissionPreview } from "./PermissionPreview";

/**
 * Dialog for editing an existing role's name, description, and permissions.
 * Includes preset selector and permission preview.
 */
export function EditRoleDialog({ role, onSave, disabled = false }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState(role.name);
    const [description, setDescription] = useState(role.description || "");
    const [permissions, setPermissions] = useState(role.permissions || []);
    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        try {
            await onSave(role._key, {
                name,
                description,
                permissions,
            });
            setOpen(false);
        } catch (err) {
            console.error("Failed to save:", err);
        } finally {
            setSaving(false);
        }
    };

    // Reset form state when dialog opens
    const handleOpenChange = (isOpen) => {
        if (isOpen) {
            setName(role.name);
            setDescription(role.description || "");
            setPermissions(role.permissions || []);
        }
        setOpen(isOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" disabled={disabled}>
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Role: {role.name}</DialogTitle>
                    <DialogDescription>
                        Update the role name, description, and permissions.
                        Use a preset to quickly reconfigure, or adjust permissions individually.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="edit-role-name">Name</Label>
                        <Input
                            id="edit-role-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Role name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="edit-role-desc">Description</Label>
                        <Textarea
                            id="edit-role-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this role can do..."
                            rows={2}
                        />
                    </div>

                    {/* Preset selector */}
                    <PresetSelector
                        onApply={setPermissions}
                        currentPermissions={permissions}
                    />

                    <div className="space-y-2">
                        <Label>Permissions</Label>
                        <PermissionsGrid
                            selected={permissions}
                            onChange={setPermissions}
                        />
                    </div>

                    {/* Permission preview */}
                    <PermissionPreview selected={permissions} />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
