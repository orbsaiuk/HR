import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { cleanupExpiredGrants } from "@/features/team-member-management/services/temporaryGrantsService";

/**
 * POST /api/team-members/temporary-grants/cleanup
 * Remove all expired temporary grants for the organization.
 * Requires manage_team permission.
 */
export async function POST() {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_TEAM);

        const removed = await cleanupExpiredGrants(context.orgId);
        return NextResponse.json({ success: true, removed });
    } catch (error) {
        console.error("Error cleaning up expired grants:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to cleanup expired grants" },
            { status },
        );
    }
}
