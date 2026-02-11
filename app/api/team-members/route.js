import { NextResponse } from "next/server";
import { getTeamMembers } from "@/features/team-members/services";

export async function GET() {
  try {
    const teamMembers = await getTeamMembers();
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 },
    );
  }
}
