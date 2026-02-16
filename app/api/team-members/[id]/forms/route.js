import { NextResponse } from "next/server";
import { getPublishedFormsByUser } from "@/features/forms/services/formService";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Get published forms created by this user (public-facing, no org auth needed)
    // The id parameter is now the user's _id (not a standalone teamMember doc _id)
    const forms = await getPublishedFormsByUser(id);

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching team member forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 },
    );
  }
}
