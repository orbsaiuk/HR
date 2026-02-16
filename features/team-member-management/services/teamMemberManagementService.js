import { client } from "@/sanity/client";
import { teamMemberInviteQueries, organizationQueries } from "@/sanity/queries";

export async function getInvites(orgId) {
  return client.fetch(teamMemberInviteQueries.getAllInvites, { orgId });
}

export async function createInvite(email, invitedByUserId, orgId) {
  const normalizedEmail = email.toLowerCase().trim();

  // Check for existing invite with this email in this org
  const existing = await client.fetch(
    teamMemberInviteQueries.getInviteByEmail,
    { email: normalizedEmail, orgId },
  );
  if (existing) {
    throw new Error("An invite for this email already exists");
  }

  // Check if email is already a team member in this org (by checking user emails)
  const existingMember = await client.fetch(
    organizationQueries.getTeamMemberByEmail,
    { orgId, email: normalizedEmail },
  );
  if (existingMember) {
    throw new Error("A team member with this email already exists");
  }

  const timestamp = new Date().toISOString();

  return client
    .patch(orgId)
    .append("invites", [
      {
        _key: `${normalizedEmail}-${Date.now()}`, // Unique key for the array item
        email: normalizedEmail,
        status: "pending",
        invitedBy: {
          _type: "reference",
          _ref: invitedByUserId,
        },
        createdAt: timestamp,
      },
    ])
    .commit();
}

export async function deleteInvite(inviteKey, orgId) {
  return client
    .patch(orgId)
    .unset([`invites[_key == "${inviteKey}"]`])
    .commit();
}

export async function getInviteByEmail(email, orgId) {
  return client.fetch(teamMemberInviteQueries.getInviteByEmail, {
    email: email.toLowerCase().trim(),
    orgId,
  });
}

export async function markInviteJoined(email, userId, orgId) {
  const normalizedEmail = email.toLowerCase().trim();

  const invite = await client.fetch(teamMemberInviteQueries.getInviteByEmail, {
    email: normalizedEmail,
    orgId,
  });

  if (!invite) return null;

  return client
    .patch(orgId)
    .set({
      [`invites[_key == "${invite._key}"].status`]: "joined",
      [`invites[_key == "${invite._key}"].joinedUser`]: {
        _type: "reference",
        _ref: userId,
      },
    })
    .commit();
}

export async function getOwnerTeamMember(orgId) {
  return client.fetch(teamMemberInviteQueries.getOwnerTeamMember, { orgId });
}

export async function isOwner(clerkId, orgId) {
  const owner = await client.fetch(teamMemberInviteQueries.getOwnerTeamMember, {
    orgId,
  });
  if (!owner) return false;
  return owner.user.clerkId === clerkId;
}

export async function getAllTeamMembers(orgId) {
  return client.fetch(teamMemberInviteQueries.getAllTeamMembersManaged, {
    orgId,
  });
}

export async function removeTeamMember(userId, orgId) {
  return client
    .patch(orgId)
    .unset([`teamMembers[user._ref == "${userId}"]`])
    .commit();
}

export const teamMemberManagementService = {
  getInvites,
  createInvite,
  deleteInvite,
  getInviteByEmail,
  markInviteJoined,
  getOwnerTeamMember,
  isOwner,
  getAllTeamMembers,
  removeTeamMember,
};
