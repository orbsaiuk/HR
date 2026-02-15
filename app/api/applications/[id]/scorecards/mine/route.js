import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { getScorecardByEvaluatorAndApplication } from "@/features/scorecards/services/scorecardService";

/**
 * GET /api/applications/[id]/scorecards/mine — get the current user's scorecard for this application
 */
export async function GET(request, { params }) {
  try {
    const { teamMember } = await resolveOrgContext();
    const { id } = await params;
    const scorecard = await getScorecardByEvaluatorAndApplication(
      teamMember._id,
      id,
    );

    return NextResponse.json(scorecard || null);
  } catch (error) {
    console.error("Error fetching my scorecard:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch scorecard" },
      { status },
    );
  }
}
