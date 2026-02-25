import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
  getInvites,
  createInvite,
} from "@/features/team-member-management/services/teamMemberManagementService";
import { logAuditEvent } from "@/features/audit/services/auditService";

export async function GET() {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_TEAM);

    const invites = await getInvites(context.orgId);
    return NextResponse.json(invites);
  } catch (error) {
    console.error("Error fetching invites:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch invites" },
      { status },
    );
  }
}

export async function POST(request) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_TEAM);

    const { email, roleKey } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const effectiveRoleKey = roleKey || "viewer";

    // Resolve the role display name from the organization's roles array
    const role = context.organization.roles?.find(
      (r) => r._key === effectiveRoleKey,
    );
    const roleName = role?.name || effectiveRoleKey;

    const invite = await createInvite(
      email,
      context.teamMember._id,
      context.orgId,
      effectiveRoleKey,
      {
        organizationName: context.organization.name,
        inviterName: context.teamMember.user?.name || context.teamMember.name,
        roleName,
      },
    );

    await logAuditEvent({
      action: "member.invited",
      category: "team",
      description: `Invited ${email} as "${roleName}"`,
      actorId: context.teamMember._id,
      orgId: context.orgId,
      targetType: "invite",
      targetId: invite._key,
      metadata: {
        after: JSON.stringify({ email, roleKey: effectiveRoleKey, roleName }),
      },
    });

    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    console.error("Error creating invite:", error);
    const httpStatus = error.message?.includes("already exists") ? 409 : 500;
    return NextResponse.json(
      { error: error.message || "Failed to create invite" },
      { status: error.status || httpStatus },
    );
  }
}
