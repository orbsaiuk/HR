import { client } from "@/sanity/client";
import { teamMemberInviteQueries, organizationQueries } from "@/sanity/queries";
import { sendInvitationEmail } from "@/shared/services/emailService";

export async function getInvites(orgId) {
  return client.fetch(teamMemberInviteQueries.getAllInvites, { orgId });
}


export async function createInvite(
  email,
  invitedByUserId,
  orgId,
  roleKey = "viewer",
  { organizationName, inviterName, roleName } = {},
) {
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
  const inviteKey = `${normalizedEmail}-${Date.now()}`;

  const result = await client
    .patch(orgId)
    .setIfMissing({ invites: [] })
    .append("invites", [
      {
        _key: inviteKey,
        email: normalizedEmail,
        status: "pending",
        roleKey,
        invitedBy: {
          _type: "reference",
          _ref: invitedByUserId,
        },
        createdAt: timestamp,
      },
    ])
    .commit();

  // Send invitation email — awaited to prevent serverless early termination
  try {
    await sendInvitationEmail({
      recipientEmail: normalizedEmail,
      organizationName: organizationName || "the team",
      inviterName: inviterName || "A team admin",
      roleName: roleName || roleKey,
    });
  } catch (err) {
    console.error("[createInvite] Failed to send invitation email:", err.message);
  }

  return result;
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


export async function findPendingInviteByEmail(email) {
  const normalizedEmail = email.toLowerCase().trim();
  const results = await client.fetch(teamMemberInviteQueries.findPendingInviteByEmail, {
    email: normalizedEmail,
  });

  // Return the first pending invite found (there should typically only be one)
  if (results && results.length > 0) {
    const { _id: orgId, name: orgName, invite } = results[0];
    return {
      orgId,
      orgName,
      invite,
    };
  }

  return null;
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
  findPendingInviteByEmail,
  markInviteJoined,
  getOwnerTeamMember,
  isOwner,
  getAllTeamMembers,
  removeTeamMember,
};
