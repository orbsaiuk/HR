import { NextResponse } from "next/server";
import { getTeamMemberById } from "@/features/team-members/services";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const teamMember = await getTeamMemberById(id);

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    return NextResponse.json(
      { error: "Failed to fetch team member" },
      { status: 500 },
    );
  }
}
