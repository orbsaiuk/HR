import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";

/**
 * GET /api/organizations — Get the current organization's details
 */
export async function GET() {
  try {
    const { organization } = await resolveOrgContext();
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
