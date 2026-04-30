import {
  getScorecardsByApplication as repoGetScorecardsByApplication,
  getScorecardById as repoGetScorecardById,
  getScorecardByEvaluatorAndApplication,
  getScorecardSummary as repoGetScorecardSummary,
  createScorecard,
  updateScorecard,
  deleteScorecard as repoDeleteScorecard,
} from "../repositories/scorecardRepository";

/**
 * Get all scorecards for a specific application — org-scoped
 */
export async function getScorecardsByApplication(applicationId, orgId) {
  return repoGetScorecardsByApplication(applicationId, orgId);
}

/**
 * Get a single scorecard by ID
 */
export async function getScorecardById(id) {
  return repoGetScorecardById(id);
}

/**
 * Get existing scorecard by evaluator + application
 */
export { getScorecardByEvaluatorAndApplication };

/**
 * Get average scores for an application — org-scoped
 */
export async function getScorecardSummary(applicationId, orgId) {
  return repoGetScorecardSummary(applicationId, orgId);
}

/**
 * Create or update a scorecard (upsert by evaluator + application)
 */
export async function upsertScorecard(input) {
  const existing = await getScorecardByEvaluatorAndApplication(
    input.evaluatorId,
    input.applicationId,
  );

  const data = {
    criteria: input.criteria,
    overallScore: input.overallScore,
    recommendation: input.recommendation,
    summary: input.summary,
  };

  if (existing) {
    return updateScorecard(existing._id, data);
  }

  return createScorecard({
    application: { _ref: input.applicationId },
    evaluator: { _ref: input.evaluatorId },
    organization: input.orgId ? { _ref: input.orgId } : undefined,
    ...data,
  });
}

/**
 * Delete a scorecard
 */
export async function deleteScorecard(id) {
  return repoDeleteScorecard(id);
}

export const scorecardService = {
  getScorecardsByApplication,
  getScorecardById,
  getScorecardByEvaluatorAndApplication,
  getScorecardSummary,
  upsertScorecard,
  deleteScorecard,
};
