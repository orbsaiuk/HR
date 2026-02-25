"use client";

import { useAuditLogs } from "../model/useAuditLogs";
import { AuditLogTable } from "./AuditLogTable";
import { AuditLogFilters } from "./AuditLogFilters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2, ScrollText } from "lucide-react";

/**
 * Main audit log page component.
 * Renders filters, the log table with pagination, and handles loading / error states.
 */
export function AuditLogPage() {
    const {
        logs,
        total,
        totalPages,
        loading,
        error,
        filters,
        updateFilters,
        goToPage,
        getExportUrl,
    } = useAuditLogs();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <ScrollText className="h-6 w-6" />
                    Activity Log
                </h2>
                <p className="text-muted-foreground mt-1">
                    Track all actions performed in your organization.
                </p>
            </div>

            {/* Filters + Export */}
            <AuditLogFilters
                filters={filters}
                onFilterChange={updateFilters}
                getExportUrl={getExportUrl}
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
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <Card>
                    <CardContent className="p-0">
                        <AuditLogTable
                            logs={logs}
                            total={total}
                            page={filters.page}
                            totalPages={totalPages}
                            pageSize={filters.pageSize}
                            onPageChange={goToPage}
                        />
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
