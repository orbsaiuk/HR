import { client, clientRead } from "@/sanity/client";
import { applicationQueries } from "@/sanity/queries/recruitment";

/**
 * Get all applications for a user (candidate-facing)
 */
export async function getUserApplications(userId) {
  return clientRead.fetch(applicationQueries.getByUserId, { userId });
}

/**
 * Get a single application by ID with full details (candidate-facing)
 * Verifies the application belongs to the user.
 */
export async function getUserApplicationById(id, userId) {
  const application = await clientRead.fetch(applicationQueries.getById, {
    id,
  });

  if (!application) return null;

  // Verify ownership
  if (application.applicant?._id !== userId) {
    return null;
  }

  return application;
}

export const candidatePortalService = {
  getUserApplications,
  getUserApplicationById,
};
