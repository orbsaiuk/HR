import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS, ADMIN_ROLE_KEY } from "@/shared/lib/permissions";
import { updateTeamMemberRole } from "@/features/team-member-management/services/teamMemberService";
import { getRoleByKey } from "@/features/roles/services/rolesService";
import { getOwnerTeamMember } from "@/features/team-member-management/services/teamMemberManagementService";
import { logAuditEvent } from "@/features/audit/services/auditService";

/**
 * PATCH /api/team-members/[id]/role — Change a team member's role
 *
 * The [id] param is the team member's _key in the organization's teamMembers array.
 * Body: { roleKey: string }
 */
export async function PATCH(request, { params }) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_TEAM);

        const { id } = await params;
        const { roleKey } = await request.json();

        // Validate roleKey is provided
        if (!roleKey || typeof roleKey !== "string") {
            return NextResponse.json(
                { error: "roleKey is required and must be a string" },
                { status: 400 },
            );
        }

        // Validate the roleKey exists in the organization's roles
        const role = await getRoleByKey(context.orgId, roleKey);
        if (!role) {
            return NextResponse.json(
                { error: "Role not found in this organization" },
                { status: 404 },
            );
        }

        // Find the target team member in the org's teamMembers array
        const targetMember = context.organization.teamMembers?.find(
            (m) => m._key === id,
        );
        if (!targetMember) {
            return NextResponse.json(
                { error: "Team member not found" },
                { status: 404 },
            );
        }

        // Prevent users from changing their own role
        if (targetMember.user._ref === context.teamMember._id) {
            return NextResponse.json(
                { error: "You cannot change your own role" },
                { status: 400 },
            );
        }

        // Prevent changing the owner's role away from admin
        const owner = await getOwnerTeamMember(context.orgId);
        if (owner && owner._key === id && roleKey !== ADMIN_ROLE_KEY) {
            return NextResponse.json(
                { error: "Cannot change the account owner's role away from admin" },
                { status: 400 },
            );
        }

        const previousRoleKey = targetMember.roleKey;
        await updateTeamMemberRole(context.orgId, id, roleKey);

        await logAuditEvent({
            action: "member.role_changed",
            category: "team",
            description: `Changed role of team member "${id}" from "${previousRoleKey}" to "${roleKey}"`,
            actorId: context.teamMember._id,
            orgId: context.orgId,
            targetType: "teamMember",
            targetId: id,
            metadata: {
                before: JSON.stringify({ roleKey: previousRoleKey }),
                after: JSON.stringify({ roleKey }),
            },
        });

        return NextResponse.json({ success: true, roleKey });
    } catch (error) {
        console.error("Error changing team member role:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to change team member role" },
            { status },
        );
    }
}
