import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { client } from "@/sanity/client";
import { teamMembersQueries } from "@/sanity/queries/users";

export async function GET(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;
    const teamMember = await client.fetch(teamMembersQueries.getById, { id });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error("Error fetching team member:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch team member" },
      { status },
    );
  }
}
