import { client } from "@/sanity/client";
import { scorecardQueries } from "@/sanity/queries";

/**
 * Get all scorecards for a specific application — org-scoped
 */
export async function getScorecardsByApplication(applicationId, orgId) {
  return client.fetch(scorecardQueries.getByApplicationId, {
    applicationId,
    orgId,
  });
}

/**
 * Get a single scorecard by ID
 */
export async function getScorecardById(id) {
  return client.fetch(scorecardQueries.getById, { id });
}

/**
 * Get existing scorecard by evaluator + application
 */
export async function getScorecardByEvaluatorAndApplication(
  evaluatorId,
  applicationId,
) {
  return client.fetch(scorecardQueries.getByEvaluatorAndApplication, {
    evaluatorId,
    applicationId,
  });
}

/**
 * Get average scores for an application — org-scoped
 */
export async function getScorecardSummary(applicationId, orgId) {
  return client.fetch(scorecardQueries.getAverageForApplication, {
    applicationId,
    orgId,
  });
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
    updatedAt: new Date().toISOString(),
  };

  if (existing) {
    return client.patch(existing._id).set(data).commit();
  }

  const doc = {
    _type: "evaluationScorecard",
    application: { _type: "reference", _ref: input.applicationId },
    evaluator: { _type: "reference", _ref: input.evaluatorId },
    ...data,
    createdAt: new Date().toISOString(),
  };

  // Denormalize organization reference if provided
  if (input.orgId) {
    doc.organization = { _type: "reference", _ref: input.orgId };
  }

  return client.create(doc);
}

/**
 * Delete a scorecard
 */
export async function deleteScorecard(id) {
  return client.delete(id);
}

export const scorecardService = {
  getScorecardsByApplication,
  getScorecardById,
  getScorecardByEvaluatorAndApplication,
  getScorecardSummary,
  upsertScorecard,
  deleteScorecard,
};
