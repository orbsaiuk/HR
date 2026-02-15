import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { getOrganizationMembers } from "@/features/organizations/services/organizationService";

/**
 * GET /api/organizations/[id]/members — List all members of the organization
 */
export async function GET(request, { params }) {
  try {
    const { orgId } = await resolveOrgContext();
    const { id } = await params;

    // Ensure the user can only list members of their own organization
    if (id !== orgId) {
      return NextResponse.json(
        { error: "Cannot access another organization's members" },
        { status: 403 },
      );
    }

    const members = await getOrganizationMembers(orgId);
    return NextResponse.json(members);
  } catch (error) {
    console.error("Error fetching organization members:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch members" },
      { status },
    );
  }
}
