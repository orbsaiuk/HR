import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { formsQueries } from "@/sanity/queries";
import {
  getJobPositions,
  getJobPositionStats,
  createJobPosition,
} from "@/features/job-positions/services/jobPositionService";

async function resolveTeamMember(user) {
  const teamMember = await client.fetch(formsQueries.getTeamMemberByClerkId, {
    clerkId: user.id,
  });
  return teamMember;
}

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const teamMember = await resolveTeamMember(user);
    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    const positions = await getJobPositions(teamMember._id);
    return NextResponse.json(positions);
  } catch (error) {
    console.error("Error fetching positions:", error);
    return NextResponse.json(
      { error: "Failed to fetch positions" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const input = await request.json();
    const position = await createJobPosition(input);
    return NextResponse.json(position, { status: 201 });
  } catch (error) {
    console.error("Error creating position:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create position" },
      { status: 500 },
    );
  }
}
