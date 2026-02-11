import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  isOwner,
  getAllTeamMembers,
} from "@/features/team-member-management/services/teamMemberManagementService";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ownerCheck = await isOwner(user.id);
    if (!ownerCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const teamMembers = await getAllTeamMembers();
    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return NextResponse.json(
      { error: "Failed to fetch team members" },
      { status: 500 },
    );
  }
}
