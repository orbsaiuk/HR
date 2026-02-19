import { client } from "@/sanity/client";
import { userProfileQueries } from "@/sanity/queries";

export async function getUserByClerkId(clerkId) {
  return client.fetch(userProfileQueries.getByClerkId, { clerkId });
}

/**
 * Create a new user document in Sanity.
 * Uses createIfNotExists with a deterministic _id to prevent duplicate
 * documents when the webhook and sync route race on sign-up.
 */
export async function createUser({ clerkId, name, email, avatar }) {
  const deterministicId = `user-${clerkId}`;
  const now = new Date().toISOString();

  await client.createIfNotExists({
    _id: deterministicId,
    _type: "user",
    clerkId,
    name: name || "",
    email: email || "",
    avatar: avatar || undefined,
    createdAt: now,
    updatedAt: now,
  });

  // Return the document (may have been created by a concurrent call)
  return client.fetch(userProfileQueries.getByClerkId, { clerkId });
}

/**
 * Update an existing user document in Sanity
 */
export async function updateUser(userId, { name, email, avatar }) {
  const patches = {};
  if (name !== undefined) patches.name = name;
  if (email !== undefined) patches.email = email;
  if (avatar !== undefined) patches.avatar = avatar;
  patches.updatedAt = new Date().toISOString();

  return client.patch(userId).set(patches).commit();
}

export async function getUserApplications(userId) {
  return client.fetch(userProfileQueries.getUserApplications, { userId });
}

export async function getUserApplication(userId, applicationId) {
  return client.fetch(userProfileQueries.getUserApplication, {
    userId,
    applicationId,
  });
}

export async function getLegacyTeacher(clerkId) {
  return client.fetch(userProfileQueries.getLegacyTeacher, { clerkId });
}

export const userService = {
  getUserByClerkId,
  createUser,
  updateUser,
  getUserApplications,
  getUserApplication,
  getLegacyTeacher,
};
