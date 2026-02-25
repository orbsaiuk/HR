"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronRight } from "lucide-react";

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
 * Try to parse a JSON string, returning the parsed object or null.
 */
function tryParseJSON(str) {
    if (!str) return null;
    try {
        return JSON.parse(str);
    } catch {
        return null;
    }
}

/**
 * Render a JSON object as a formatted key-value list.
 */
function MetadataView({ label, data }) {
    if (!data) return null;
    const parsed = typeof data === "string" ? tryParseJSON(data) : data;
    if (!parsed || (typeof parsed === "object" && Object.keys(parsed).length === 0)) {
        return null;
    }

    return (
        <div>
            <p className="text-xs font-medium text-gray-500 mb-1">{label}</p>
            <pre className="text-xs bg-gray-50 rounded p-2 overflow-x-auto whitespace-pre-wrap break-words text-gray-700">
                {JSON.stringify(parsed, null, 2)}
            </pre>
        </div>
    );
}

/**
 * A single expandable row in the audit log table.
 */
function AuditLogRow({ log }) {
    const [expanded, setExpanded] = useState(false);

    const hasMetadata =
        log.metadata &&
        (log.metadata.before || log.metadata.after || log.metadata.ip);

    return (
        <>
            <tr
                className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${hasMetadata ? "cursor-pointer" : ""
                    }`}
                onClick={() => hasMetadata && setExpanded(!expanded)}
            >
                {/* Expand indicator */}
                <td className="px-4 py-3 w-8">
                    {hasMetadata ? (
                        expanded ? (
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                        ) : (
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                        )
                    ) : (
                        <span className="inline-block w-4" />
                    )}
                </td>

                {/* Date */}
                <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {formatDate(log.createdAt)}
                </td>

                {/* Actor */}
                <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src={log.actor?.avatar} />
                            <AvatarFallback className="text-[10px]">
                                {getInitials(log.actor?.name)}
                            </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-900 truncate max-w-[150px]">
                            {log.actor?.name || log.actor?.email || "Unknown"}
                        </span>
                    </div>
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                    <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                        {log.action}
                    </code>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                    <Badge
                        variant="outline"
                        className={`text-xs capitalize ${CATEGORY_STYLES[log.category] || CATEGORY_STYLES.settings
                            }`}
                    >
                        {log.category}
                    </Badge>
                </td>

                {/* Description */}
                <td className="px-4 py-3 text-sm text-gray-700 max-w-[300px] truncate">
                    {log.description}
                </td>
            </tr>

            {/* Expanded metadata row */}
            {expanded && hasMetadata && (
                <tr className="border-b border-gray-100 bg-gray-50/50">
                    <td colSpan={6} className="px-4 py-3">
                        <div className="pl-8 space-y-3">
                            <MetadataView label="Before" data={log.metadata.before} />
                            <MetadataView label="After" data={log.metadata.after} />
                            {log.metadata.ip && (
                                <p className="text-xs text-gray-500">
                                    IP: {log.metadata.ip}
                                </p>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

export function AuditLogTable({ logs, total }) {
    if (!logs || logs.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                No activity logs found. Actions performed in your organization will
                appear here.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-200 text-left">
                        <th className="px-4 py-3 w-8" />
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actor
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Category
                        </th>
                        <th className="px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((log) => (
                        <AuditLogRow key={log._id} log={log} />
                    ))}
                </tbody>
            </table>

            {total > 0 && (
                <div className="px-4 py-3 text-xs text-gray-500 border-t border-gray-100">
                    Showing {logs.length} of {total} entries
                </div>
            )}
        </div>
    );
}
