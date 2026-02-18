"use client";

import { useState, useEffect } from "react";
import { useRoles } from "../model/useRoles";
import { RoleCard } from "./RoleCard";
import { CreateRoleDialog } from "./CreateRoleDialog";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2 } from "lucide-react";

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
    const { roles, loading, error, createRole, updateRole, deleteRole, refetch } = useRoles();
    const [userPermissions, setUserPermissions] = useState([]);
    const [permissionsLoading, setPermissionsLoading] = useState(true);

    useEffect(() => {
        fetchUserPermissions().then((perms) => {
            setUserPermissions(perms);
            setPermissionsLoading(false);
        });
    }, []);

    const canManageRoles = userPermissions.includes(PERMISSIONS.MANAGE_ROLES);

    if (loading || permissionsLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Roles</h2>
                    <p className="text-gray-500">
                        Manage roles and their permissions for your organization.
                    </p>
                </div>
                <CreateRoleDialog onCreate={createRole} disabled={!canManageRoles} />
            </div>

            {!canManageRoles && (
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        You don't have permission to manage roles. You can view roles but cannot create, edit, or delete them.
                    </AlertDescription>
                </Alert>
            )}

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
                    No roles found. Create your first custom role to get started.
                </div>
            )}
        </div>
    );
}