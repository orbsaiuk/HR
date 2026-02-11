import { client } from "@/sanity/client";
import { teamMemberInviteQueries } from "@/sanity/queries";

export async function getInvites() {
  return client.fetch(teamMemberInviteQueries.getAllInvites);
}

export async function createInvite(email, invitedByTeamMemberId) {
  // Check for existing invite with this email
  const existing = await client.fetch(
    teamMemberInviteQueries.getInviteByEmail,
    { email },
  );
  if (existing) {
    throw new Error("An invite for this email already exists");
  }

  // Check if email is already a team member
  const existingTeamMember = await client.fetch(
    `*[_type == "teamMember" && email == $email][0]`,
    { email },
  );
  if (existingTeamMember) {
    throw new Error("A team member with this email already exists");
  }

  return client.create({
    _type: "teamMemberInvite",
    email: email.toLowerCase().trim(),
    status: "pending",
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

export async function getInviteByEmail(email) {
  return client.fetch(teamMemberInviteQueries.getInviteByEmail, {
    email: email.toLowerCase().trim(),
  });
}

export async function markInviteJoined(email, teamMemberId) {
  const invite = await client.fetch(teamMemberInviteQueries.getInviteByEmail, {
    email: email.toLowerCase().trim(),
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

export async function getOwnerTeamMember() {
  return client.fetch(teamMemberInviteQueries.getOwnerTeamMember);
}

export async function isOwner(clerkId) {
  const owner = await client.fetch(teamMemberInviteQueries.getOwnerTeamMember);
  if (!owner) return false;
  return owner.clerkId === clerkId;
}

export async function getAllTeamMembers() {
  return client.fetch(teamMemberInviteQueries.getAllTeamMembersManaged);
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
