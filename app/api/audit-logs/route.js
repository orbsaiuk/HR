import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
    getAuditLogs,
    getAuditLogCount,
} from "@/features/audit/services/auditService";

export async function GET(request) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_SETTINGS);

        const { searchParams } = new URL(request.url);
        const category = searchParams.get("category");
        const actorId = searchParams.get("actor");
        const limit = parseInt(searchParams.get("limit") || "50", 10);

        const [logs, total] = await Promise.all([
            getAuditLogs(context.orgId, { category, actorId, limit }),
            getAuditLogCount(context.orgId, { category }),
        ]);

        return NextResponse.json({ logs, total });
    } catch (error) {
        console.error("Error fetching audit logs:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch audit logs" },
            { status },
        );
    }
}
