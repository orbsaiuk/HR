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

export async function addTeamMemberToOrg(orgId, userId, roleKey = "recruiter") {
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
        roleKey,
        joinedAt: timestamp,
      },
    ])
    .commit();
}

export async function updateTeamMemberRole(orgId, key, newRoleKey) {
  return client
    .patch(orgId)
    .set({
      [`teamMembers[_key == "${key}"].roleKey`]: newRoleKey,
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

export const teamMemberService = {
  getTeamMemberById,
  getTeamMemberByClerkId,
  addTeamMemberToOrg,
  updateTeamMemberRole,
  removeTeamMemberFromOrg,
};
