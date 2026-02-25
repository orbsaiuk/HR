import { NextResponse } from "next/server";
import { resolveOrgContext, invalidateOrgContextCache } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
    grantTemporaryPermissions,
    getActiveTemporaryGrantsForUser,
} from "@/features/team-member-management/services/temporaryGrantsService";
import { logAuditEvent } from "@/features/audit/services/auditService";
import { incrementPermissionsVersion } from "@/features/organizations/services/organizationService";

/**
 * GET /api/team-members/[id]/temporary-grants
 * Get active temporary grants for a specific team member.
 * Requires manage_team permission.
 */
export async function GET(request, { params }) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_TEAM);

        const { id } = await params;
        const grants = await getActiveTemporaryGrantsForUser(context.orgId, id);
        return NextResponse.json(grants);
    } catch (error) {
        console.error("Error fetching temporary grants:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch temporary grants" },
            { status },
        );
    }
}

/**
 * POST /api/team-members/[id]/temporary-grants
 * Grant temporary permissions to a team member.
 * Requires manage_team permission.
 */
export async function POST(request, { params }) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_TEAM);

        const { id } = await params;
        const { permissions, expiresAt, reason } = await request.json();

        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return NextResponse.json(
                { error: "permissions must be a non-empty array" },
                { status: 400 },
            );
        }

        if (!expiresAt) {
            return NextResponse.json(
                { error: "expiresAt is required" },
                { status: 400 },
            );
        }

        const expiryDate = new Date(expiresAt);
        if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
            return NextResponse.json(
                { error: "expiresAt must be a valid future datetime" },
                { status: 400 },
            );
        }

        await grantTemporaryPermissions(
            context.orgId,
            id,
            permissions,
            expiresAt,
            context.teamMember._id,
            reason,
        );

        // Invalidate cached org context so temporary grant takes effect immediately
        invalidateOrgContextCache(context.organization.clerkOrgId);

        await Promise.all([
            logAuditEvent({
                action: "member.temporary_grant_created",
                category: "team",
                description: `Granted temporary permissions [${permissions.join(", ")}] to user "${id}" until ${new Date(expiresAt).toLocaleString()}${reason ? ` — ${reason}` : ""}`,
                actorId: context.teamMember._id,
                orgId: context.orgId,
                targetType: "teamMember",
                targetId: id,
                metadata: {
                    after: JSON.stringify({ permissions, expiresAt, reason }),
                },
            }),
            incrementPermissionsVersion(context.orgId),
        ]);

        return NextResponse.json({ success: true }, { status: 201 });
    } catch (error) {
        console.error("Error granting temporary permissions:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to grant temporary permissions" },
            { status },
        );
    }
}
