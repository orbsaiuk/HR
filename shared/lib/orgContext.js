import { auth } from "@clerk/nextjs/server";
import { client } from "@/sanity/client";
import { organizationQueries } from "@/sanity/queries";
import { resolveApiKeyContext } from "@/shared/lib/apiKeyContext";
import { createCache, invalidateWhere } from "@/shared/lib/cache";

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

const orgContextCache = createCache({ max: 500, ttl: 60_000 });

export async function resolveContext(request) {
  // Try API key first (API keys are not cached — they're already validated once)
  const apiKeyCtx = await resolveApiKeyContext(request);
  if (apiKeyCtx) return apiKeyCtx;

  // Fall back to Clerk session (with caching)
  return resolveOrgContext();
}

export async function resolveOrgContext() {
  const { userId, orgId, orgRole } = await auth();

  if (!userId) {
    throw new OrgContextError("Not authenticated", 401);
  }

  if (!orgId) {
    throw new OrgContextError("No organization selected", 403);
  }

  // Check cache first
  const cacheKey = `${userId}:${orgId}`;
  const cached = orgContextCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Cache miss — fetch from Sanity
  const organization = await client.fetch(organizationQueries.getByClerkOrgId, {
    clerkOrgId: orgId,
  });

  if (!organization) {
    throw new OrgContextError("Organization not found", 404);
  }

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

  const context = {
    organization,
    teamMember,
    orgRole,
    orgId: organization._id,
  };

  // Store in cache
  orgContextCache.set(cacheKey, context);

  return context;
}

export function invalidateOrgContextCache(clerkOrgId) {
  if (clerkOrgId) {
    invalidateWhere(orgContextCache, (key) => key.endsWith(`:${clerkOrgId}`));
  } else {
    orgContextCache.clear();
  }
}

export function invalidateUserOrgCache(userId, clerkOrgId) {
  orgContextCache.delete(`${userId}:${clerkOrgId}`);
}
