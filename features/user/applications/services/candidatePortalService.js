import {
  getApplicationsByUser,
  getApplicationByIdForUser,
} from "@/features/company/applications/repositories/applicationRepository";
import { getUserByClerkId } from "@/features/shared/auth/services/userService";

/**
 * Get all applications for a user (candidate-facing)
 */
export async function getUserApplications(clerkUserId) {
  const user = await getUserByClerkId(clerkUserId);
  if (!user) return [];
  return getApplicationsByUser(user._id);
}

/**
 * Get a single application by ID with full details (candidate-facing)
 * Verifies the application belongs to the user.
 */
export async function getUserApplicationById(id, clerkUserId) {
  const user = await getUserByClerkId(clerkUserId);
  if (!user) return null;
  return getApplicationByIdForUser(id, user._id);
}

export const candidatePortalService = {
  getUserApplications,
  getUserApplicationById,
};
