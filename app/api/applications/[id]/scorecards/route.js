import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
  getScorecardsByApplication,
  upsertScorecard,
} from "@/features/scorecards/services/scorecardService";

/**
 * GET /api/applications/[id]/scorecards — list all scorecards for an application
 */
export async function GET(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.VIEW_APPLICATIONS);
    const { id } = await params;
    const scorecards = await getScorecardsByApplication(id, context.orgId);
    return NextResponse.json(scorecards);
  } catch (error) {
    console.error("Error fetching scorecards:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch scorecards" },
      { status },
    );
  }
}

/**
 * POST /api/applications/[id]/scorecards — create or update a scorecard
 */
export async function POST(request, { params }) {
  try {
    const context = await resolveOrgContext();
    requirePermission(context, PERMISSIONS.MANAGE_APPLICATIONS);
    const { teamMember, orgId } = context;
    const { id } = await params;
    const body = await request.json();

    const { criteria, overallScore, recommendation, summary } = body;

    if (!criteria || !Array.isArray(criteria) || criteria.length === 0) {
      return NextResponse.json(
        { error: "At least one criterion is required" },
        { status: 400 },
      );
    }

    const result = await upsertScorecard({
      applicationId: id,
      evaluatorId: teamMember._id,
      orgId,
      criteria,
      overallScore,
      recommendation,
      summary,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating/updating scorecard:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to save scorecard" },
      { status },
    );
  }
}
