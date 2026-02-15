import { client } from "@/sanity/client";
import { teamMemberInviteQueries } from "@/sanity/queries";

export async function getInvites(orgId) {
  return client.fetch(teamMemberInviteQueries.getAllInvites, { orgId });
}

export async function createInvite(email, invitedByTeamMemberId, orgId) {
  // Check for existing invite with this email in this org
  const existing = await client.fetch(
    teamMemberInviteQueries.getInviteByEmail,
    { email, orgId },
  );
  if (existing) {
    throw new Error("An invite for this email already exists");
  }

  // Check if email is already a team member in this org
  const existingTeamMember = await client.fetch(
    `*[_type == "teamMember" && email == $email && organization._ref == $orgId][0]`,
    { email, orgId },
  );
  if (existingTeamMember) {
    throw new Error("A team member with this email already exists");
  }

  return client.create({
    _type: "teamMemberInvite",
    email: email.toLowerCase().trim(),
    status: "pending",
    organization: { _type: "reference", _ref: orgId },
    invitedBy: {
      _type: "reference",
      _ref: invitedByTeamMemberId,
    },
    createdAt: new Date().toISOString(),
  });
}

export async function deleteInvite(id) {
  return client.delete(id);
}

export async function getInviteByEmail(email, orgId) {
  return client.fetch(teamMemberInviteQueries.getInviteByEmail, {
    email: email.toLowerCase().trim(),
    orgId,
  });
}

export async function markInviteJoined(email, teamMemberId, orgId) {
  const invite = await client.fetch(teamMemberInviteQueries.getInviteByEmail, {
    email: email.toLowerCase().trim(),
    orgId,
  });

  if (!invite) return null;

  return client
    .patch(invite._id)
    .set({
      status: "joined",
      teamMember: {
        _type: "reference",
        _ref: teamMemberId,
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
  return owner.clerkId === clerkId;
}

export async function getAllTeamMembers(orgId) {
  return client.fetch(teamMemberInviteQueries.getAllTeamMembersManaged, {
    orgId,
  });
}

export async function removeTeamMember(id) {
  // Delete associated invites for this team member
  const teamMember = await client.fetch(
    `*[_type == "teamMember" && _id == $id][0]{ _id, email }`,
    { id },
  );

  if (teamMember) {
    const invites = await client.fetch(
      `*[_type == "teamMemberInvite" && email == $email]`,
      { email: teamMember.email },
    );

    if (invites.length > 0) {
      const transaction = client.transaction();
      invites.forEach((invite) => transaction.delete(invite._id));
      await transaction.commit();
    }
  }

  // Delete the team member document
  return client.delete(id);
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
