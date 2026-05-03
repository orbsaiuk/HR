import { NextResponse } from "next/server";
import { resolveContext } from "@/shared/lib/orgContext";
import { getCompanyDashboardStats } from "@/features/company/dashboard/services/dashboardService";

export async function GET(request) {
  try {
    const context = await resolveContext(request);
    
    if (!context || !context.orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getCompanyDashboardStats(context.orgId, context.teamMember._id);

    return NextResponse.json(stats);
  } catch (error) {
    console.error("GET /api/company/dashboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
