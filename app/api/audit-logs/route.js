import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
    getAuditLogs,
    getAuditLogCount,
} from "@/features/audit/services/auditService";

/**
 * GET /api/audit-logs
 *
 * Query params:
 *   category   - Filter by category (roles, team, forms, positions, applications, settings)
 *   actor      - Filter by actor user _id
 *   startDate  - ISO datetime string (inclusive lower bound)
 *   endDate    - ISO datetime string (inclusive upper bound)
 *   page       - Page number (1-based, default: 1)
 *   pageSize   - Items per page (default: 25, max: 100)
 *
 * Returns: { logs: AuditLog[], total: number, page: number, pageSize: number, totalPages: number }
 */
export async function GET(request) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_SETTINGS);

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category") || undefined;
        const actorId = searchParams.get("actor") || undefined;
        const startDate = searchParams.get("startDate") || undefined;
        const endDate = searchParams.get("endDate") || undefined;
        const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
        const pageSize = Math.min(
            100,
            Math.max(1, parseInt(searchParams.get("pageSize") || "25", 10)),
        );

        const options = { category, actorId, startDate, endDate, page, pageSize };

        const [logs, total] = await Promise.all([
            getAuditLogs(context.orgId, options),
            getAuditLogCount(context.orgId, { category, startDate, endDate }),
        ]);

        const totalPages = Math.ceil(total / pageSize);

        return NextResponse.json({ logs, total, page, pageSize, totalPages });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch audit logs" },
            { status },
        );
    }
}
