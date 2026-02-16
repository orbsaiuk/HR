import { client, clientRead } from "@/sanity/client";
import { organizationQueries } from "@/sanity/queries/organizations";

/**
 * Get an organization by its Sanity document ID
 */
export async function getOrganizationById(id) {
  return client.fetch(organizationQueries.getById, { id });
}

/**
 * Get an organization by its Clerk org ID
 */
export async function getOrganizationByClerkOrgId(clerkOrgId) {
  return client.fetch(organizationQueries.getByClerkOrgId, { clerkOrgId });
}

/**
 * Get an organization by its slug
 */
export async function getOrganizationBySlug(slug) {
  return client.fetch(organizationQueries.getBySlug, { slug });
}

/**
 * Update organization settings and details
 */
export async function updateOrganization(id, input) {
  const updates = {
    updatedAt: new Date().toISOString(),
  };

  if (input.name !== undefined) updates.name = input.name;
  if (input.description !== undefined) updates.description = input.description;
  if (input.website !== undefined) updates.website = input.website;
  if (input.settings !== undefined) updates.settings = input.settings;

  return client.patch(id).set(updates).commit();
}

/**
 * Get all members of an organization
 */
export async function getOrganizationMembers(orgId) {
  return client.fetch(organizationQueries.getMembers, { orgId });
}

/**
 * Create a new organization
 */
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

/**
 * Get team member by Clerk ID and organization ID
 */
export async function getTeamMemberByClerkAndOrg(clerkId, orgId) {
  return client.fetch(organizationQueries.getTeamMemberByClerkAndOrg, {
    clerkId,
    orgId,
  });
}
export async function addTeamMemberToOrg(orgId, userId, role = "recruiter") {
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
        role,
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
export async function updateTeamMemberRole(orgId, key, newRole) {
  return client
    .patch(orgId)
    .set({
      [`teamMembers[_key == "${key}"].role`]: newRole,
    })
    .commit();
}
export async function addInviteToOrg(orgId, email, invitedByUserId) {
  const normalizedEmail = email.toLowerCase().trim();
  const timestamp = new Date().toISOString();

  return client
    .patch(orgId)
    .append("invites", [
      {
        _key: `${normalizedEmail}-${Date.now()}`,
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

/**
 * Get featured positions for the landing page (public, read-only)
 */
export async function getFeaturedPositions() {
  return clientRead.fetch(organizationQueries.getFeaturedPositions);
}

/**
 * Get a public company profile by slug (public, read-only)
 */
export async function getPublicCompanyBySlug(slug) {
  return clientRead.fetch(organizationQueries.getPublicCompanyBySlug, { slug });
}

export const organizationService = {
  getOrganizationById,
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
};
