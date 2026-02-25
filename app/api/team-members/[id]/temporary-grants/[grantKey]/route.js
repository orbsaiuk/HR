import { NextResponse } from "next/server";
import { resolveOrgContext, invalidateOrgContextCache } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { revokeTemporaryGrant } from "@/features/team-member-management/services/temporaryGrantsService";
import { logAuditEvent } from "@/features/audit/services/auditService";
import { incrementPermissionsVersion } from "@/features/organizations/services/organizationService";

/**
 * DELETE /api/team-members/[id]/temporary-grants/[grantKey]
 * Revoke a specific temporary grant.
 * Requires manage_team permission.
 */
export async function DELETE(request, { params }) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_TEAM);

        const { id, grantKey } = await params;

        await revokeTemporaryGrant(context.orgId, grantKey);

        // Invalidate cached org context so revocation takes effect immediately
        invalidateOrgContextCache(context.organization.clerkOrgId);

        await Promise.all([
            logAuditEvent({
                action: "member.temporary_grant_revoked",
                category: "team",
                description: `Revoked temporary grant "${grantKey}" for user "${id}"`,
                actorId: context.teamMember._id,
                orgId: context.orgId,
                targetType: "teamMember",
                targetId: id,
                metadata: {
                    before: JSON.stringify({ grantKey }),
                },
            }),
            incrementPermissionsVersion(context.orgId),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error revoking temporary grant:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to revoke temporary grant" },
            { status },
        );
    }
}
