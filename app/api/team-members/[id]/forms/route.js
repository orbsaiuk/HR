import { NextResponse } from "next/server";
import { getPublishedFormsByTeamMember } from "@/features/forms/services/formService";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Get published forms for this team member (public-facing, no org auth needed)
    // But include organization info for multi-tenant display
    const forms = await getPublishedFormsByTeamMember(id);

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching team member forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 },
    );
  }
}
