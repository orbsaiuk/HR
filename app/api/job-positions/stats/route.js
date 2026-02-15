import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { getJobPositionStats } from "@/features/job-positions/services/jobPositionService";

export async function GET() {
  try {
    const { orgId } = await resolveOrgContext();
    const stats = await getJobPositionStats(orgId);
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching position stats:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch stats" },
      { status },
    );
  }
}
