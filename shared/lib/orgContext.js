import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { organizationQueries } from "@/sanity/queries";

/**
 * Custom error class for organization context resolution failures.
 */
export class OrgContextError extends Error {
  constructor(message, status = 403) {
    super(message);
    this.name = "OrgContextError";
    this.status = status;
  }
}

export async function resolveOrgContext() {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    throw new OrgContextError("Not authenticated", 401);
  }

  if (!orgId) {
    throw new OrgContextError("No organization selected", 403);
  }

  // Fetch the organization by Clerk org ID
  const organization = await client.fetch(organizationQueries.getByClerkOrgId, {
    clerkOrgId: orgId,
  });

  if (!organization) {
    throw new OrgContextError("Organization not found", 404);
  }

  // Fetch the team member for this user within this organization's embedded teamMembers array
  const teamMemberEntry = await client.fetch(
    organizationQueries.getTeamMemberByClerkAndOrg,
    { clerkId: userId, orgId: organization._id },
  );

  if (!teamMemberEntry) {
    throw new OrgContextError("Not a member of this organization", 403);
  }

  // Make teamMember._id resolve to the user's _id for backward compatibility
  const teamMember = {
    ...teamMemberEntry,
    _id: teamMemberEntry.user._id,
  };

  return {
    organization,
    teamMember,
    orgRole,
    orgId: organization._id,
  };
}
