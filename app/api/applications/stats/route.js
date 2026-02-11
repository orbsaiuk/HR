import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { formsQueries } from "@/sanity/queries";
import { getApplicationStats } from "@/features/applications/services/applicationService";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamMember = await client.fetch(formsQueries.getTeamMemberByClerkId, {
      clerkId: user.id,
    });
    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    const stats = await getApplicationStats(teamMember._id);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching application stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
