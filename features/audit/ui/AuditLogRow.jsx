"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TableRow, TableCell } from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { AuditLogMetadata } from "./AuditLogMetadata";

/**
 * Map category strings to badge colour variants.
 */
const CATEGORY_STYLES = {
    roles: "bg-purple-100 text-purple-800 border-purple-200",
    team: "bg-blue-100 text-blue-800 border-blue-200",
    forms: "bg-green-100 text-green-800 border-green-200",
    positions: "bg-amber-100 text-amber-800 border-amber-200",
    applications: "bg-cyan-100 text-cyan-800 border-cyan-200",
    settings: "bg-gray-100 text-gray-800 border-gray-200",
};

/**
 * Format an ISO date string into a human-readable format.
 */
function formatDate(isoString) {
    if (!isoString) return "—";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

/**
 * Get initials from a name string.
 */
function getInitials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
}

/**
 * A single expandable row in the audit log table.
 * Shows date, actor, action, category, and description.
 * Clicking expands to show before/after metadata.
 */
export function AuditLogRow({ log }) {
    const [expanded, setExpanded] = useState(false);

    const hasMetadata =
        log.metadata &&
        (log.metadata.before || log.metadata.after || log.metadata.ip);

    return (
        <>
            <TableRow
                className={hasMetadata ? "cursor-pointer" : ""}
                onClick={() => hasMetadata && setExpanded(!expanded)}
            >
                {/* Expand indicator */}
                <TableCell className="w-8">
                    {hasMetadata ? (
                        expanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )
                    ) : (
                        <span className="inline-block w-4" />
                    )}
                </TableCell>

                {/* Date */}
                <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(log.createdAt)}
                </TableCell>

                {/* Actor */}
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={log.actor?.avatar} />
                            <AvatarFallback className="text-[10px]">
                                {getInitials(log.actor?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate max-w-[150px]">
                            {log.actor?.name || log.actor?.email || "Unknown"}
                        </span>
                    </div>
                </TableCell>

                {/* Action */}
                <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                        {log.action}
                    </code>
                </TableCell>

                {/* Category */}
                <TableCell>
                    <Badge
                        variant="outline"
                        className={`text-xs capitalize ${CATEGORY_STYLES[log.category] || CATEGORY_STYLES.settings}`}
                    >
                        {log.category}
                    </Badge>
                </TableCell>

                {/* Description */}
                <TableCell className="text-sm max-w-[300px] truncate">
                    {log.description}
                </TableCell>
            </TableRow>

            {/* Expanded metadata row */}
            {expanded && hasMetadata && (
                <TableRow className="bg-muted/30">
                    <TableCell colSpan={6}>
                        <div className="pl-8 space-y-3">
                            <AuditLogMetadata label="Before" data={log.metadata.before} />
                            <AuditLogMetadata label="After" data={log.metadata.after} />
                            {log.metadata.ip && (
                                <p className="text-xs text-muted-foreground">
                                    IP: {log.metadata.ip}
                                </p>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
}
