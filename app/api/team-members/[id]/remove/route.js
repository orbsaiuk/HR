import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { userProfileQueries } from "@/sanity/queries";
import { resolveOrgContext, invalidateOrgContextCache } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
  getOwnerTeamMember,
  removeTeamMember,
} from "@/features/team-member-management/services/teamMemberManagementService";
import { logAuditEvent } from "@/features/audit/services/auditService";
import { incrementPermissionsVersion } from "@/features/organizations/services/organizationService";

export async function DELETE(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_TEAM);

    const { id } = await params;

    // Prevent removing the org owner (first/earliest joined team member)
    const owner = await getOwnerTeamMember(context.orgId);
    if (owner && owner.user._id === id) {
      return NextResponse.json(
        { error: "Cannot remove the account owner" },
        { status: 400 },
      );
    }

    // 1. Get the user's clerkId from Sanity
    const userDoc = await client.fetch(userProfileQueries.getById, { id });
    if (!userDoc?.clerkId) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 },
      );
    }

    const clerkOrgId = context.organization.clerkOrgId;
    const clerk = await clerkClient();

    // 2. Remove the user from the Clerk organization
    if (clerkOrgId) {
      try {
        await clerk.organizations.deleteOrganizationMembership({
          organizationId: clerkOrgId,
          userId: userDoc.clerkId,
        });
      } catch (err) {
        // If the user is already not a member, continue with Sanity cleanup
        if (!err.message?.includes("not found")) {
          console.error("Failed to remove user from Clerk org:", err.message);
        }
      }
    }

    // 3. Reset the user's role in Clerk metadata
    try {
      await clerk.users.updateUserMetadata(userDoc.clerkId, {
        publicMetadata: {
          role: "user",
        },
      });
    } catch (err) {
      console.error("Failed to reset user Clerk metadata:", err.message);
    }

    // 4. Remove the team member from the Sanity organization document
    await removeTeamMember(id, context.orgId);

    // Invalidate cached org context so membership changes take effect immediately
    invalidateOrgContextCache(context.organization.clerkOrgId);

    await Promise.all([
      logAuditEvent({
        action: "member.removed",
        category: "team",
        description: `Removed team member "${userDoc.name || userDoc.email || id}"`,
        actorId: context.teamMember._id,
        orgId: context.orgId,
        targetType: "teamMember",
        targetId: id,
        metadata: {
          before: JSON.stringify({ userId: id, name: userDoc.name, email: userDoc.email }),
        },
      }),
      incrementPermissionsVersion(context.orgId),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing team member:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to remove team member" },
      { status },
    );
  }
}
