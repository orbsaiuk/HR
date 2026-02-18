import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { getFormAnalytics } from "@/features/analytics/services/analyticsService";

export async function GET(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_ANALYTICS);
    const { orgId } = context;
    const { formId } = await params;

    const analytics = await getFormAnalytics(formId, orgId);

    return NextResponse.json(analytics);
  } catch (error) {
    console.error("Error fetching analytics:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status },
    );
  }
}
