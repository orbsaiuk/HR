import { client, clientRead } from "@/sanity/client";
import { careerQueries, applicationQueries } from "@/sanity/queries/recruitment";

/**
 * Get all open positions for the public careers page.
 * Cross-org — shows all open positions with organization info.
 */
export async function getPublicPositions() {
  return clientRead.fetch(careerQueries.getPublicPositions);
}

/**
 * Get a single open position by ID.
 * Includes organization info for display.
 */
export async function getPublicPositionById(id) {
  return clientRead.fetch(careerQueries.getPublicPositionById, { id });
}

/**
 * Get unique departments for filter
 */
export async function getDepartments() {
  const departments = await clientRead.fetch(careerQueries.getDepartments);
  return departments.filter(Boolean);
}

/**
 * Get unique locations for filter
 */
export async function getLocations() {
  const locations = await clientRead.fetch(careerQueries.getLocations);
  return locations.filter(Boolean);
}

/**
 * Submit a job application (public-facing).
 * The application inherits organization context from the job position.
 */
export async function submitApplication(input) {
  // Check for duplicate application
  if (input.applicantId) {
    const existing = await client.fetch(applicationQueries.checkDuplicate, {
      positionId: input.jobPositionId,
      userId: input.applicantId,
    });
    if (existing > 0) {
      throw new Error("You have already applied to this position");
    }
  }

  const doc = {
    _type: "application",
    jobPosition: { _type: "reference", _ref: input.jobPositionId },
    answers: input.answers || [],
    status: "new",
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (input.applicantId) {
    doc.applicant = { _type: "reference", _ref: input.applicantId };
  }

  if (input.formId) {
    doc.form = { _type: "reference", _ref: input.formId };
  }

  return client.create(doc);
}

export const careerService = {
  getPublicPositions,
  getPublicPositionById,
  getDepartments,
  getLocations,
  submitApplication,
};
