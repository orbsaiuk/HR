import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { hasAnyPermission } from "@/shared/lib/permissionChecker";
import { ADMIN_ROLE_KEY, PERMISSIONS } from "@/shared/lib/permissions";
import { getOrganizationMembers } from "@/features/shared/organizations/services/organizationService";

/**
 * GET /api/organizations/[id]/members — List all members of the organization
 */
export async function GET(request, { params }) {
  try {
    const context = await resolveOrgContext();
    const isOrgAdmin =
      context.orgRole === "org:admin" ||
      context.orgRole === "admin" ||
      context.teamMember?.roleKey === ADMIN_ROLE_KEY;

    // Position creators need this list to assign team members while creating/editing positions.
    const isPositionCreator = hasAnyPermission(context, [
      PERMISSIONS.MANAGE_POSITIONS,
    ]);

    const hasLegacyAccess = hasAnyPermission(context, [
      PERMISSIONS.MANAGE_TEAM,
      PERMISSIONS.MANAGE_FORMS,
      PERMISSIONS.MANAGE_SETTINGS,
    ]);

    const canViewMembers = isOrgAdmin || isPositionCreator || hasLegacyAccess;

    if (!canViewMembers) {
      return NextResponse.json(
        { error: "Forbidden: insufficient permissions" },
        { status: 403 },
      );
    }

    const { id } = await params;

    // Ensure the user can only list members of their own organization
    if (id !== context.orgId) {
      return NextResponse.json(
        { error: "Cannot access another organization's members" },
        { status: 403 },
      );
    }

    const members = await getOrganizationMembers(context.orgId);
    const normalizedMembers = (members || [])
      .map((member) => {
        const user = member?.user || member;
        if (!user?._id) return null;

        return {
          _id: user._id,
          clerkId: user.clerkId,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          roleKey: member?.roleKey,
          joinedAt: member?.joinedAt,
        };
      })
      .filter(Boolean);

    return NextResponse.json(normalizedMembers);
  } catch (error) {
    console.error("Error fetching organization members:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch members" },
      { status },
    );
  }
}
