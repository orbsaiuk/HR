import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { getApplicationStats } from "@/features/applications/services/applicationService";

export async function GET() {
  try {
    const { orgId } = await resolveOrgContext();
    const stats = await getApplicationStats(orgId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching application stats:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch stats" },
      { status },
    );
  }
}
