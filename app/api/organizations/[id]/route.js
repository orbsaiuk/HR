import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import {
  getOrganizationById,
  updateOrganization,
} from "@/features/organizations/services/organizationService";

/**
 * GET /api/organizations/[id] — Get organization details by ID
 */
export async function GET(request, { params }) {
  try {
    await resolveOrgContext();
    const { id } = await params;

    const organization = await getOrganizationById(id);
    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error fetching organization:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch organization" },
      { status },
    );
  }
}

/**
 * PUT /api/organizations/[id] — Update organization settings (admin only)
 */
export async function PUT(request, { params }) {
  try {
    const { orgRole, orgId } = await resolveOrgContext();

    // Only admins can update organization settings
    if (orgRole !== "org:admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Ensure the user can only update their own organization
    if (id !== orgId) {
      return NextResponse.json(
        { error: "Cannot update another organization" },
        { status: 403 },
      );
    }

    const input = await request.json();
    const organization = await updateOrganization(id, input);
    return NextResponse.json(organization);
  } catch (error) {
    console.error("Error updating organization:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to update organization" },
      { status },
    );
  }
}
