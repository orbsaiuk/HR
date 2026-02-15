import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { getScorecardSummary } from "@/features/scorecards/services/scorecardService";

/**
 * GET /api/applications/[id]/scorecards/summary — average scores and recommendation breakdown
 */
export async function GET(request, { params }) {
  try {
    const { orgId } = await resolveOrgContext();
    const { id } = await params;
    const summary = await getScorecardSummary(id, orgId);

    // Calculate averages
    const scorecards = summary.scorecards || [];
    const count = summary.count || 0;

    const avgScore =
      count > 0
        ? scorecards.reduce((sum, s) => sum + (s.overallScore || 0), 0) / count
        : 0;

    const recommendations = {};
    scorecards.forEach((s) => {
      if (s.recommendation) {
        recommendations[s.recommendation] =
          (recommendations[s.recommendation] || 0) + 1;
      }
    });

    return NextResponse.json({
      count,
      averageScore: Math.round(avgScore * 10) / 10,
      recommendations,
      evaluators: scorecards.map((s) => ({
        name: s.evaluator?.name,
        overallScore: s.overallScore,
        recommendation: s.recommendation,
      })),
    });
  } catch (error) {
    console.error("Error fetching scorecard summary:", error);
    const status = error.status || 500;
    return NextResponse.json(
      { error: error.message || "Failed to fetch scorecard summary" },
      { status },
    );
  }
}
