import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { getAllTeamMembers } from "@/features/team-member-management/services/teamMemberManagementService";

export async function GET() {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_TEAM);

    const teamMembers = await getAllTeamMembers(context.orgId);
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch team members" },
      { status },
    );
  }
}
