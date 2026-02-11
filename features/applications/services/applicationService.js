import { client } from "@/sanity/client";
import { applicationQueries } from "@/sanity/queries";

/**
 * Get all applications for the current recruiter's positions
 */
export async function getApplications(teamMemberId) {
  return client.fetch(applicationQueries.getByTeamMemberId, { teamMemberId });
}

/**
 * Get applications for a specific position
 */
export async function getApplicationsByPosition(positionId) {
  return client.fetch(applicationQueries.getByPositionId, { positionId });
}

/**
 * Get a single application by ID
 */
export async function getApplicationById(id) {
  return client.fetch(applicationQueries.getById, { id });
}

/**
 * Get application stats for the recruiter dashboard
 */
export async function getApplicationStats(teamMemberId) {
  return client.fetch(applicationQueries.getStats, { teamMemberId });
}

/**
 * Update an application's status
 */
export async function updateApplicationStatus(id, status, extra = {}) {
  const updates = {
    status,
    updatedAt: new Date().toISOString(),
  };
  if (extra.notes !== undefined) updates.notes = extra.notes;
  if (extra.rejectionReason !== undefined)
    updates.rejectionReason = extra.rejectionReason;
  if (extra.rating !== undefined) updates.rating = extra.rating;

  return client.patch(id).set(updates).commit();
}

/**
 * Update recruiter notes / rating on an application
 */
export async function updateApplication(id, input) {
  const updates = { updatedAt: new Date().toISOString() };
  if (input.notes !== undefined) updates.notes = input.notes;
  if (input.rating !== undefined) updates.rating = input.rating;
  if (input.status !== undefined) updates.status = input.status;
  if (input.rejectionReason !== undefined)
    updates.rejectionReason = input.rejectionReason;

  return client.patch(id).set(updates).commit();
}

/**
 * Delete an application
 */
export async function deleteApplication(id) {
  return client.delete(id);
}

/**
 * Create an application (typically called from the public-facing apply route)
 */
export async function createApplication(input) {
  // Check for duplicate
  const existing = await client.fetch(applicationQueries.checkDuplicate, {
    positionId: input.jobPositionId,
    userId: input.applicantId,
  });
  if (existing > 0) {
    throw new Error("You have already applied to this position");
  }

  const doc = {
    _type: "application",
    jobPosition: { _type: "reference", _ref: input.jobPositionId },
    applicant: { _type: "reference", _ref: input.applicantId },
    answers: input.answers || [],
    status: "new",
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (input.formId) {
    doc.form = { _type: "reference", _ref: input.formId };
  }

  return client.create(doc);
}

export const applicationService = {
  getApplications,
  getApplicationsByPosition,
  getApplicationById,
  getApplicationStats,
  updateApplicationStatus,
  updateApplication,
  deleteApplication,
  createApplication,
};
