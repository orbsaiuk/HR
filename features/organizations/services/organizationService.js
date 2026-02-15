import { client } from "@/sanity/client";
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

export const organizationService = {
  getOrganizationById,
  getOrganizationByClerkOrgId,
  getOrganizationBySlug,
  updateOrganization,
  getOrganizationMembers,
};
