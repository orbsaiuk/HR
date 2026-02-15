import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { getAllTeamMembers } from "@/features/team-member-management/services/teamMemberManagementService";

export async function GET() {
  try {
    const { orgId } = await resolveOrgContext();
    const teamMembers = await getAllTeamMembers(orgId);
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
