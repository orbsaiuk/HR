import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Get published forms for this team member (public-facing, no org auth needed)
    // But include organization info for multi-tenant display
    const forms = await client.fetch(
      `*[_type == "form" && teamMember._ref == $teamMemberId && status == "published"] | order(updatedAt desc) {
        _id,
        title,
        description,
        status,
        "responseCount": count(*[_type == "response" && form._ref == ^._id]),
        "organizationName": organization->name,
        createdAt,
        updatedAt
      }`,
      { teamMemberId: id },
    );

    return NextResponse.json(forms);
  } catch (error) {
    console.error("Error fetching team member forms:", error);
    return NextResponse.json(
      { error: "Failed to fetch forms" },
      { status: 500 },
    );
  }
}
