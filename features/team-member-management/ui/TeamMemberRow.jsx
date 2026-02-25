"use client";

import { useState } from "react";
import { Trash2, FileText, Shield, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { RoleSelector } from "./RoleSelector";

export function TeamMemberRow({
    entry,
    isOwner,
    roles,
    onChangeRole,
    onRemove,
}) {
    const [changingRole, setChangingRole] = useState(false);
    const [removing, setRemoving] = useState(false);
    const [pendingRoleKey, setPendingRoleKey] = useState(null);
    const user = entry.user || {};

    const handleRoleChange = (newRoleKey) => {
        if (newRoleKey === entry.roleKey) return;
        setPendingRoleKey(newRoleKey);
    };

    const confirmRoleChange = async () => {
        if (!pendingRoleKey) return;
        setChangingRole(true);
        await onChangeRole(entry._key, pendingRoleKey);
        setChangingRole(false);
        setPendingRoleKey(null);
    };

    const pendingRoleName = pendingRoleKey
        ? roles.find((r) => r._key === pendingRoleKey)?.name || pendingRoleKey
        : "";

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
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                                <Trash2 size={14} className="mr-1" />
                                Remove
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Remove Team Member</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to remove{" "}
                                    <span className="font-medium text-foreground">{user.name}</span>{" "}
                                    from the team? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={removing}>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={async (e) => {
                                        e.preventDefault();
                                        setRemoving(true);
                                        await onRemove(user._id);
                                        setRemoving(false);
                                    }}
                                    disabled={removing}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    {removing ? (
                                        <>
                                            <Loader2 size={14} className="mr-1 animate-spin" />
                                            Removing...
                                        </>
                                    ) : (
                                        "Remove"
                                    )}
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}
            </TableCell>

            {/* Role Change Confirmation Dialog */}
            <AlertDialog open={!!pendingRoleKey} onOpenChange={(open) => !open && setPendingRoleKey(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Change Role</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to change{" "}
                            <span className="font-medium text-foreground">{user.name}</span>&apos;s
                            role to{" "}
                            <span className="font-medium text-foreground">{pendingRoleName}</span>?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmRoleChange}>
                            Change Role
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </TableRow>
    );
}
