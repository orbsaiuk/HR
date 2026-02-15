"use client";

import { useScorecards } from "../model/useScorecards";
import { StarRating, RecommendationBadge } from "./ScorecardHelpers";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Loading } from "@/shared/components/feedback/Loading";
import { formatDistanceToNow } from "date-fns";
import { User, ClipboardCheck } from "lucide-react";

export function ScorecardsList({ applicationId }) {
  const { scorecards, loading } = useScorecards(applicationId);

  if (loading) return <Loading />;

  if (!scorecards || scorecards.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <ClipboardCheck size={32} className="mx-auto mb-2 opacity-40" />
          <p>No evaluations submitted yet.</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate average
  const avgScore =
    scorecards.reduce((sum, s) => sum + (s.overallScore || 0), 0) /
    scorecards.length;

  return (
    <div className="space-y-4">
      {/* Summary bar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {scorecards.length} evaluation{scorecards.length !== 1 && "s"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Average:</span>
              <span className="font-semibold">
                {Math.round(avgScore * 10) / 10}/5
              </span>
              <StarRating value={Math.round(avgScore)} readonly size={14} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Individual scorecards */}
      {scorecards.map((scorecard) => (
        <Card key={scorecard._id}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-sm font-medium">
                    {scorecard.evaluator?.name || "Unknown"}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {scorecard.createdAt &&
                      formatDistanceToNow(new Date(scorecard.createdAt), {
                        addSuffix: true,
                      })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {scorecard.recommendation && (
                  <RecommendationBadge value={scorecard.recommendation} />
                )}
                <span className="text-sm font-semibold">
                  {scorecard.overallScore}/5
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Criteria breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {scorecard.criteria?.map((criterion, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border rounded-md px-3 py-2 text-sm"
                >
                  <span className="text-muted-foreground">
                    {criterion.name}
                  </span>
                  <StarRating value={criterion.score} readonly size={12} />
                </div>
              ))}
            </div>

            {/* Comments per criterion */}
            {scorecard.criteria?.some((c) => c.comment) && (
              <div className="space-y-1">
                {scorecard.criteria
                  .filter((c) => c.comment)
                  .map((criterion, idx) => (
                    <div key={idx} className="text-sm">
                      <span className="font-medium">{criterion.name}:</span>{" "}
                      <span className="text-muted-foreground">
                        {criterion.comment}
                      </span>
                    </div>
                  ))}
              </div>
            )}

            {/* Summary */}
            {scorecard.summary && (
              <div className="border-t pt-3 mt-2">
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {scorecard.summary}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
