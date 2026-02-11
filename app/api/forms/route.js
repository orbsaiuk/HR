import { NextResponse } from "next/server";
import { getForms, createForm } from "@/features/forms/services/formService";
import { client } from "@/sanity/client";
import { currentUser } from "@clerk/nextjs/server";
import { formsQueries } from "@/sanity/queries";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get team member from Sanity
    const teamMember = await client.fetch(formsQueries.getTeamMemberByClerkId, {
      clerkId: user.id,
    });

    if (!teamMember) {
      return NextResponse.json(
        { error: "Team member not found" },
        { status: 404 },
      );
    }

    const forms = await getForms(teamMember._id);
    return NextResponse.json(forms);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const input = await request.json();
    const form = await createForm(input);
    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create form" },
      { status: 500 },
    );
  }
}
