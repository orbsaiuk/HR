import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { exportAuditLogs } from "@/features/audit/services/auditService";

/**
 * GET /api/audit-logs/export
 *
 * Export audit logs as CSV or JSON.
 *
 * Query params:
 *   format     - "csv" or "json" (default: "json")
 *   category   - Filter by category
 *   startDate  - ISO datetime string
 *   endDate    - ISO datetime string
 *
 * Returns: CSV file or JSON array
 */
export async function GET(request) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_SETTINGS);

        const { searchParams } = new URL(request.url);
        const format = searchParams.get("format") || "json";
        const category = searchParams.get("category") || undefined;
        const startDate = searchParams.get("startDate") || undefined;
        const endDate = searchParams.get("endDate") || undefined;

        const logs = await exportAuditLogs(context.orgId, {
            category,
            startDate,
            endDate,
        });

        if (format === "csv") {
            const csv = convertToCSV(logs);
            return new Response(csv, {
                headers: {
                    "Content-Type": "text/csv",
                    "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.csv"`,
                },
            });
        }

        // JSON export
        const json = JSON.stringify(logs, null, 2);
        return new Response(json, {
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="audit-logs-${new Date().toISOString().slice(0, 10)}.json"`,
            },
        });
    } catch (error) {
        console.error("Error exporting audit logs:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to export audit logs" },
            { status },
        );
    }
}

/**
 * Convert audit log array to CSV format.
 */
function convertToCSV(logs) {
    if (!logs || logs.length === 0) {
        return "Date,Actor,Action,Category,Description,Target Type,Target ID\n";
    }

    const headers = ["Date", "Actor", "Actor Email", "Action", "Category", "Description", "Target Type", "Target ID"];
    const rows = logs.map((log) => [
        log.createdAt || "",
        log.actor?.name || "",
        log.actor?.email || "",
        log.action || "",
        log.category || "",
        // Escape commas and quotes in description
        `"${(log.description || "").replace(/"/g, '""')}"`,
        log.targetType || "",
        log.targetId || "",
    ]);

    const csvLines = [
        headers.join(","),
        ...rows.map((row) => row.join(",")),
    ];

    return csvLines.join("\n");
}
