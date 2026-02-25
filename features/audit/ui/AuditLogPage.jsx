"use client";

import { useAuditLogs } from "../model/useAuditLogs";
import { AuditLogTable } from "./AuditLogTable";
import { AuditLogFilters } from "./AuditLogFilters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Loader2, ScrollText } from "lucide-react";

/**
 * Main audit log page component.
 * Renders filters, the log table, and handles loading / error states.
 */
export function AuditLogPage() {
    const { logs, total, loading, error, filters, updateFilters } =
        useAuditLogs();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Activity Log
                    </h2>
                    <p className="text-gray-500">
                        Track all actions performed in your organization.
                    </p>
                </div>
            </div>

            {/* Filters */}
            <AuditLogFilters
                filters={filters}
                onFilterChange={updateFilters}
            />

            {/* Error state */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <AuditLogTable logs={logs} total={total} />
                </div>
            )}
        </div>
    );
}
