"use client";

import { useState, useEffect } from "react";
import { Save, Loader2 } from "lucide-react";
import { useScorecardActions } from "../model/useScorecardActions";
import {
  DEFAULT_CRITERIA,
  RECOMMENDATION_OPTIONS,
  StarRating,
} from "./ScorecardHelpers";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/shared/hooks/useToast";
import { Toast } from "@/shared/components/feedback/Toast";

export function ScorecardForm({ applicationId, existingScorecard, onSaved }) {
  const { submitScorecard, actionLoading } = useScorecardActions();
  const { toast, showToast, hideToast } = useToast();

  const [criteria, setCriteria] = useState(
    existingScorecard?.criteria?.length
      ? existingScorecard.criteria
      : DEFAULT_CRITERIA.map((c) => ({ ...c })),
  );
  const [recommendation, setRecommendation] = useState(
    existingScorecard?.recommendation || "",
  );
  const [summary, setSummary] = useState(existingScorecard?.summary || "");

  useEffect(() => {
    if (existingScorecard) {
      setCriteria(
        existingScorecard.criteria?.length
          ? existingScorecard.criteria
          : DEFAULT_CRITERIA.map((c) => ({ ...c })),
      );
      setRecommendation(existingScorecard.recommendation || "");
      setSummary(existingScorecard.summary || "");
    }
  }, [existingScorecard]);

  const overallScore =
    criteria.length > 0
      ? Math.round(
          (criteria.reduce((sum, c) => sum + (c.score || 0), 0) /
            criteria.length) *
            10,
        ) / 10
      : 0;

  const handleCriterionChange = (idx, field, value) => {
    setCriteria((prev) =>
      prev.map((c, i) => (i === idx ? { ...c, [field]: value } : c)),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const unscored = criteria.filter((c) => !c.score || c.score === 0);
    if (unscored.length > 0) {
      showToast(
        `Please rate all criteria. Missing: ${unscored.map((c) => c.name).join(", ")}`,
        "error",
      );
      return;
    }

    const result = await submitScorecard(applicationId, {
      criteria,
      overallScore,
      recommendation: recommendation || undefined,
      summary: summary || undefined,
    });

    if (result.success) {
      showToast(
        existingScorecard ? "Scorecard updated" : "Scorecard submitted",
        "success",
      );
      onSaved?.(result.data);
    } else {
      showToast(result.error, "error");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>
                {existingScorecard
                  ? "Edit Your Scorecard"
                  : "Submit Evaluation"}
              </span>
              <span className="text-sm font-normal text-muted-foreground">
                Overall: {overallScore > 0 ? `${overallScore}/5` : "—"}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {/* Criteria */}
            <div className="space-y-4">
              {criteria.map((criterion, idx) => (
                <div key={idx} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="font-medium">{criterion.name}</Label>
                    <StarRating
                      value={criterion.score}
                      onChange={(score) =>
                        handleCriterionChange(idx, "score", score)
                      }
                    />
                  </div>
                  <Textarea
                    placeholder={`Comments on ${criterion.name.toLowerCase()}...`}
                    value={criterion.comment || ""}
                    onChange={(e) =>
                      handleCriterionChange(idx, "comment", e.target.value)
                    }
                    rows={2}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>

            {/* Recommendation */}
            <div className="space-y-2">
              <Label className="font-medium">Recommendation</Label>
              <div className="flex flex-wrap gap-2">
                {RECOMMENDATION_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() =>
                      setRecommendation(
                        recommendation === opt.value ? "" : opt.value,
                      )
                    }
                    className={`rounded-full border px-3 py-1 text-sm font-medium transition-all ${
                      recommendation === opt.value
                        ? `${opt.color} ring-2 ring-offset-1 ring-gray-400`
                        : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-2">
              <Label className="font-medium">Summary Notes</Label>
              <Textarea
                placeholder="Overall evaluation summary..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
              />
            </div>

            {/* Submit */}
            <Button type="submit" disabled={actionLoading} className="w-full">
              {actionLoading ? (
                <Loader2 size={16} className="mr-2 animate-spin" />
              ) : (
                <Save size={16} className="mr-2" />
              )}
              {existingScorecard ? "Update Scorecard" : "Submit Scorecard"}
            </Button>
          </CardContent>
        </Card>
      </form>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </>
  );
}
