import {
  getPublicPositions as repoGetPublicPositions,
  getPublicPositionById as repoGetPublicPositionById,
  getDepartments as repoGetDepartments,
  getLocations as repoGetLocations,
} from "../repositories/careerRepository";
import {
  createApplication,
  checkDuplicate,
} from "@/features/company/applications/repositories/applicationRepository";

/**
 * Get all published/open positions for the public careers page.
 * Cross-org — shows all publicly available positions with organization info.
 */
export async function getPublicPositions() {
  return repoGetPublicPositions();
}

/**
 * Get a single published/open position by ID.
 * Includes organization info for display.
 */
export async function getPublicPositionById(id) {
  return repoGetPublicPositionById(id);
}

/**
 * Get unique departments for filter
 */
export async function getDepartments() {
  return repoGetDepartments();
}

/**
 * Get unique locations for filter
 */
export async function getLocations() {
  return repoGetLocations();
}

/**
 * Submit a job application (public-facing).
 * The application inherits organization context from the job position.
 */
export async function submitApplication(input) {
  // Check for duplicate application
  if (input.applicantId) {
    const existing = await checkDuplicate(input.jobPositionId, input.applicantId);
    if (existing > 0) {
      throw new Error("You have already applied to this position");
    }
  }

  const doc = {
    job_position_id: input.jobPositionId,
    org_id: input.organizationId || null,
    applicant_id: input.applicantId || null,
    form_id: input.formId || null,
    answers: input.answers || [],
    profileSnapshot: input.profileSnapshot || {},
  };

  return createApplication(doc);
}

export const careerService = {
  getPublicPositions,
  getPublicPositionById,
  getDepartments,
  getLocations,
  submitApplication,
};
