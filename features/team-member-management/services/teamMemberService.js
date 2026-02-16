import { client } from "@/sanity/client";
import { teamMembersQueries, userProfileQueries } from "@/sanity/queries";

/**
 * Get a user document by its Sanity ID.
 * In the embedded structure, teamMembers are identified by their user._id.
 */
export async function getTeamMemberById(userId) {
  // This now gets a user document instead of a standalone teamMember doc
  return client.fetch(userProfileQueries.getById, { id: userId });
}

/**
 * Find the organization(s) where a user (by clerkId) is a team member.
 * Returns the organization with the team member entry included.
 */
export async function getTeamMemberByClerkId(clerkId) {
  return client.fetch(teamMembersQueries.getByClerkId, { clerkId });
}

export async function addTeamMemberToOrg(orgId, userId, role = "recruiter") {
  const timestamp = new Date().toISOString();

  return client
    .patch(orgId)
    .append("teamMembers", [
      {
        _key: `${userId}-${Date.now()}`, // Unique key for the array item
        user: {
          _type: "reference",
          _ref: userId,
        },
        role,
        joinedAt: timestamp,
      },
    ])
    .commit();
}

export async function updateTeamMemberRole(orgId, key, newRole) {
  return client
    .patch(orgId)
    .set({
      [`teamMembers[_key == "${key}"].role`]: newRole,
    })
    .commit();
}

export async function removeTeamMemberFromOrg(orgId, userId) {
  // Unset all array items where user._ref matches the userId
  return client
    .patch(orgId)
    .unset([`teamMembers[user._ref == "${userId}"]`])
    .commit();
}

/**
 * Legacy exports for backward compatibility
 */
export async function createTeamMember(data) {
  // This function is deprecated. Use addTeamMemberToOrg instead.
  console.warn(
    "createTeamMember is deprecated. Use addTeamMemberToOrg instead.",
  );
  return client.create(data);
}

export async function updateTeamMember(id, updates) {
  // This function is deprecated. Use updateTeamMemberRole instead.
  console.warn(
    "updateTeamMember is deprecated. Use updateTeamMemberRole instead.",
  );
  return client.patch(id).set(updates).commit();
}

export async function deleteTeamMember(id) {
  // This function is deprecated. Use removeTeamMemberFromOrg instead.
  console.warn(
    "deleteTeamMember is deprecated. Use removeTeamMemberFromOrg instead.",
  );
  return client.delete(id);
}

export const teamMemberService = {
  getTeamMemberById,
  getTeamMemberByClerkId,
  // New embedded array functions
  addTeamMemberToOrg,
  updateTeamMemberRole,
  removeTeamMemberFromOrg,
  // Legacy exports (deprecated)
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
};
