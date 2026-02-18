"use client";

import { useState } from "react";
import { Trash2, FileText, Shield } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { RoleSelector } from "./RoleSelector";

export function TeamMemberRow({
    entry,
    isOwner,
    roles,
    onChangeRole,
    onRemove,
}) {
    const [changingRole, setChangingRole] = useState(false);
    const user = entry.user || {};

    const handleRoleChange = async (newRoleKey) => {
        if (newRoleKey === entry.roleKey) return;

        const roleName =
            roles.find((r) => r._key === newRoleKey)?.name || newRoleKey;
        const confirmed = confirm(
            `Change ${user.name}'s role to "${roleName}"?`,
        );
        if (!confirmed) return;

        setChangingRole(true);
        await onChangeRole(entry._key, newRoleKey);
        setChangingRole(false);
    };

    const roleName =
        roles.find((r) => r._key === entry.roleKey)?.name || entry.roleKey;

    return (
        <TableRow>
            <TableCell className="px-6">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.avatar} alt={user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {user.name?.charAt(0)?.toUpperCase() || "?"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{user.name}</span>
                        {isOwner && (
                            <Badge variant="secondary" className="gap-1 text-xs">
                                <Shield size={10} />
                                Owner
                            </Badge>
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell className="px-6">
                <span className="text-sm text-muted-foreground">{user.email}</span>
            </TableCell>
            <TableCell className="px-6">
                {isOwner ? (
                    <span className="text-sm font-medium">{roleName}</span>
                ) : roles.length > 0 ? (
                    <div className="w-36">
                        <RoleSelector
                            roles={roles}
                            value={entry.roleKey}
                            onChange={handleRoleChange}
                            disabled={changingRole}
                        />
                    </div>
                ) : (
                    <span className="text-sm text-muted-foreground">{roleName}</span>
                )}
            </TableCell>
            <TableCell className="px-6">
                <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                    <FileText size={14} className="text-muted-foreground/50" />
                    {entry.formCount || 0}
                </span>
            </TableCell>
            <TableCell className="px-6">
                <span className="text-sm text-muted-foreground">
                    {entry.joinedAt
                        ? new Date(entry.joinedAt).toLocaleDateString()
                        : "—"}
                </span>
            </TableCell>
            <TableCell className="px-6 text-right">
                {!isOwner && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            if (
                                confirm(
                                    `Remove ${user.name} as a team member? This cannot be undone.`,
                                )
                            ) {
                                onRemove(user._id);
                            }
                        }}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 size={14} className="mr-1" />
                        Remove
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
}
