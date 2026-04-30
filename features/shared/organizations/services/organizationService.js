import { client, clientRead } from "@/sanity/client";
import { organizationQueries } from "@/sanity/queries/organizations";

export async function getOrganizationById(id) {
  return client.fetch(organizationQueries.getById, { id });
}

export async function getOrganizationByIdWithMembers(id) {
  return client.fetch(organizationQueries.getByIdWithMembers, { id });
}

export async function getOrganizationByClerkOrgId(clerkOrgId) {
  return client.fetch(organizationQueries.getByClerkOrgId, { clerkOrgId });
}

export async function getOrganizationBySlug(slug) {
  return client.fetch(organizationQueries.getBySlug, { slug });
}

export async function updateOrganization(id, input) {
  const updates = {
    updatedAt: new Date().toISOString(),
  };

  if (input.name !== undefined) updates.name = input.name;
  if (input.logo !== undefined) updates.logo = input.logo;
  if (input.description !== undefined) updates.description = input.description;
  if (input.website !== undefined) updates.website = input.website;
  if (input.settings !== undefined) updates.settings = input.settings;
  if (input.industry !== undefined) updates.industry = input.industry;
  if (input.size !== undefined) updates.size = input.size;
  if (input.location !== undefined) updates.location = input.location;
  if (input.foundedYear !== undefined) updates.foundedYear = input.foundedYear;
  if (input.socialLinks !== undefined) updates.socialLinks = input.socialLinks;
  if (input.services !== undefined) updates.services = input.services;
  if (input.officeLocations !== undefined)
    updates.officeLocations = input.officeLocations;

  return client.patch(id).set(updates).commit();
}

export async function getOrganizationMembers(orgId) {
  return client.fetch(organizationQueries.getMembers, { orgId });
}

export async function createOrganization(data) {
  return client.create({
    _type: "organization",
    name: data.name,
    slug: { _type: "slug", current: data.slug },
    clerkOrgId: data.id,
    description: data.public_metadata?.description || "",
    website: data.public_metadata?.website || undefined,
    settings: {
      brandColor: data.public_metadata?.brandColor || undefined,
      careerPageEnabled: true,
    },
    teamMembers: [],
    invites: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export async function getTeamMemberByClerkAndOrg(clerkId, orgId) {
  return client.fetch(organizationQueries.getTeamMemberByClerkAndOrg, {
    clerkId,
    orgId,
  });
}
export async function addTeamMemberToOrg(orgId, userId, roleKey = "recruiter") {
  // Check if user is already a member to prevent duplicates from race conditions
  const existingRefs = await client.fetch(
    organizationQueries.getTeamMemberUserRefs,
    { orgId },
  );
  const isAlreadyMember = existingRefs?.includes(userId);

  if (isAlreadyMember) {
    return null;
  }

  const timestamp = new Date().toISOString();

  return client
    .patch(orgId)
    .setIfMissing({ teamMembers: [] })
    .append("teamMembers", [
      {
        _key: `${userId}-${Date.now()}`,
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
export async function removeTeamMemberFromOrg(orgId, userId) {
  return client
    .patch(orgId)
    .unset([`teamMembers[user._ref == "${userId}"]`])
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
export async function addInviteToOrg(
  orgId,
  email,
  invitedByUserId,
  roleKey = "viewer",
) {
  const normalizedEmail = email.toLowerCase().trim();
  const timestamp = new Date().toISOString();

  return client
    .patch(orgId)
    .append("invites", [
      {
        _key: `${normalizedEmail}-${Date.now()}`,
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
}
export async function removeInviteFromOrg(orgId, inviteKey) {
  return client
    .patch(orgId)
    .unset([`invites[_key == "${inviteKey}"]`])
    .commit();
}

/**
 * Get platform-wide stats (public, read-only)
 */
export async function getPlatformStats() {
  return clientRead.fetch(organizationQueries.getPlatformStats);
}

export async function getFeaturedPositions() {
  return clientRead.fetch(organizationQueries.getFeaturedPositions);
}

export async function getPublicCompanyBySlug(slug) {
  return clientRead.fetch(organizationQueries.getPublicCompanyBySlug, { slug });
}

export async function incrementPermissionsVersion(orgId) {
  try {
    return await client.patch(orgId).inc({ permissionsVersion: 1 }).commit();
  } catch (error) {
    // Version increment should never break the main operation
    console.error(
      "[organizationService] Failed to increment permissionsVersion:",
      error.message,
    );
    return null;
  }
}

export async function getPermissionsVersion(orgId) {
  return client.fetch(organizationQueries.getPermissionsVersion, { orgId });
}

export const organizationService = {
  getOrganizationById,
  getOrganizationByIdWithMembers,
  getOrganizationByClerkOrgId,
  getOrganizationBySlug,
  updateOrganization,
  getOrganizationMembers,
  createOrganization,
  getTeamMemberByClerkAndOrg,
  addTeamMemberToOrg,
  removeTeamMemberFromOrg,
  updateTeamMemberRole,
  addInviteToOrg,
  removeInviteFromOrg,
  getPlatformStats,
  getFeaturedPositions,
  getPublicCompanyBySlug,
  incrementPermissionsVersion,
  getPermissionsVersion,
};
