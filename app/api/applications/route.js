import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { formsQueries } from "@/sanity/queries";
import {
  getApplications,
  createApplication,
} from "@/features/applications/services/applicationService";

async function resolveTeamMember(user) {
  return client.fetch(formsQueries.getTeamMemberByClerkId, {
    clerkId: user.id,
  });
}

export async function GET(request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const positionId = searchParams.get("positionId");

    const teamMember = await resolveTeamMember(user);
    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    // If a positionId filter is provided, use the position-scoped query
    if (positionId) {
      const { getApplicationsByPosition } =
        await import("@/features/applications/services/applicationService");
      const apps = await getApplicationsByPosition(positionId);
      return NextResponse.json(apps);
    }

    const apps = await getApplications(teamMember._id);
    return NextResponse.json(apps);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Failed to fetch applications" },
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
    const application = await createApplication(input);
    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Error creating application:", error);
    const status = error.message?.includes("already applied") ? 409 : 500;
    return NextResponse.json(
      { error: error.message || "Failed to create application" },
      { status },
    );
  }
}
