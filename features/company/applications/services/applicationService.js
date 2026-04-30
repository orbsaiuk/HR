import {
  getApplicationsByOrg,
  getApplicationsByTeamMember as repoGetApplicationsByTeamMember,
  getApplicationsByPosition as repoGetApplicationsByPosition,
  getApplicationById as repoGetApplicationById,
  getApplicationStats as repoGetApplicationStats,
  updateApplication as repoUpdateApplication,
  checkDuplicate,
  createApplication as repoCreateApplication,
} from "../repositories/applicationRepository";
import { getJobPositionById } from "@/features/company/job-positions/repositories/jobPositionRepository";

/**
 * Get all applications for the organization's positions
 */
export async function getApplications(orgId) {
  return getApplicationsByOrg(orgId);
}

/**
 * Get applications for a specific recruiter's positions within the org
 */
export async function getApplicationsByTeamMember(orgId, teamMemberId) {
  return repoGetApplicationsByTeamMember(orgId, teamMemberId);
}

/**
 * Get applications for a specific position
 */
export async function getApplicationsByPosition(positionId) {
  return repoGetApplicationsByPosition(positionId);
}

/**
 * Get a single application by ID
 */
export async function getApplicationById(id) {
  return repoGetApplicationById(id);
}

/**
 * Get application stats for the recruiter dashboard — scoped by org
 */
export async function getApplicationStats(orgId) {
  return repoGetApplicationStats(orgId);
}

/**
 * Update an application's status
 */
export async function updateApplicationStatus(id, status, extra = {}) {
  return repoUpdateApplication(id, { status, ...extra });
}

/**
 * Update recruiter notes / rating on an application
 */
export async function updateApplication(id, input) {
  return repoUpdateApplication(id, input);
}

/**
 * Create an application (typically called from the public-facing apply route)
 */
export async function createApplication(input) {
  // Check for duplicate
  const existing = await checkDuplicate(input.jobPositionId, input.applicantId);
  if (existing > 0) {
    throw new Error("You have already applied to this position");
  }

  // Fetch the job position to get its organization reference
  const jobPosition = await getJobPositionById(input.jobPositionId);

  return repoCreateApplication({
    job_position_id: input.jobPositionId,
    applicant_id: input.applicantId,
    answers: input.answers || [],
    form_id: input.formId || undefined,
    org_id: jobPosition?.organization?._id || undefined,
  });
}

export const applicationService = {
  getApplications,
  getApplicationsByTeamMember,
  getApplicationsByPosition,
  getApplicationById,
  getApplicationStats,
  updateApplicationStatus,
  updateApplication,
  createApplication,
};
