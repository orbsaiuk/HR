import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { getApplicationStats } from "@/features/applications/services/applicationService";

export async function GET() {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_APPLICATIONS);
    const { orgId } = context;
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
