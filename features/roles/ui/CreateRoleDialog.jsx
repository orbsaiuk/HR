"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export function CreateRoleDialog({ onCreate, disabled = false }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleCreate = async () => {
        if (!name.trim()) {
            setError("Role name is required");
            return;
        }

        setSaving(true);
        setError("");
        try {
            await onCreate({
                name: name.trim(),
                description: description.trim(),
                permissions,
            });
            // Reset form
            setName("");
            setDescription("");
            setPermissions([]);
            setOpen(false);
        } catch (err) {
            setError(err.message || "Failed to create role");
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button disabled={disabled}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Role
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create New Role</DialogTitle>
                    <DialogDescription>
                        Define a new role with custom permissions for your organization.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {error && (
                        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Name *</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Content Editor"
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe what this role can do..."
                            className="w-full px-3 py-2 border rounded-md"
                            rows={2}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Permissions</label>
                        <PermissionsGrid
                            selected={permissions}
                            onChange={setPermissions}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleCreate} disabled={saving}>
                        {saving ? "Creating..." : "Create Role"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}