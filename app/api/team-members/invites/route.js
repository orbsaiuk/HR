import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  isOwner,
  getInvites,
  createInvite,
} from "@/features/team-member-management/services/teamMemberManagementService";
import { client } from "@/sanity/client";
import { teamMembersQueries } from "@/sanity/queries";

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

    const invites = await getInvites();
    return NextResponse.json(invites);
  } catch (error) {
    console.error("Error fetching invites:", error);
    return NextResponse.json(
      { error: "Failed to fetch invites" },
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

    const ownerCheck = await isOwner(user.id);
    if (!ownerCheck) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Get the owner's team member ID
    const teamMember = await client.fetch(teamMembersQueries.getByClerkId, {
      clerkId: user.id,
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    const invite = await createInvite(email, teamMember._id);
    return NextResponse.json(invite, { status: 201 });
  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create invite" },
      { status: error.message?.includes("already exists") ? 409 : 500 },
    );
  }
}
