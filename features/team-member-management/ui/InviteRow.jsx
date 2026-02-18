"use client";

import { Trash2, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";

export function InviteRow({ invite, roles, onDelete }) {
    const roleName =
        roles.find((r) => r._key === invite.roleKey)?.name || invite.roleKey || "—";

    return (
        <TableRow>
            <TableCell className="px-6">
                <span className="text-sm font-medium">{invite.email}</span>
            </TableCell>
            <TableCell className="px-6">
                <span className="text-sm text-muted-foreground">{roleName}</span>
            </TableCell>
            <TableCell className="px-6">
                {invite.status === "pending" ? (
                    <Badge variant="outline" className="gap-1.5 border-yellow-200 bg-yellow-50 text-yellow-700">
                        <Clock size={12} />
                        Pending
                    </Badge>
                ) : (
                    <Badge variant="outline" className="gap-1.5 border-green-200 bg-green-50 text-green-700">
                        <CheckCircle size={12} />
                        Joined
                    </Badge>
                )}
            </TableCell>
            <TableCell className="px-6">
                <span className="text-sm text-muted-foreground">
                    {invite.createdAt
                        ? new Date(invite.createdAt).toLocaleDateString()
                        : "—"}
                </span>
            </TableCell>
            <TableCell className="px-6 text-right">
                {invite.status === "pending" && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(invite._key)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                        <Trash2 size={14} className="mr-1" />
                        Revoke
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
}
