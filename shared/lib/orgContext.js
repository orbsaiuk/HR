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

/**
 * Resolves the current organization context from the authenticated Clerk session.
 *
 * Returns the Sanity organization document, the team member document,
 * the Clerk org role, and the Sanity org ID.
 *
 * @returns {Promise<{ organization: object, teamMember: object, orgRole: string, orgId: string }>}
 * @throws {OrgContextError} If not authenticated, no org selected, org not found, or not a member
 */
export async function resolveOrgContext() {
    const { userId, orgId, orgRole } = await auth();

    if (!userId) {
        throw new OrgContextError("Not authenticated", 401);
    }

    if (!orgId) {
        throw new OrgContextError("No organization selected", 403);
    }

    // Fetch the organization by Clerk org ID
    const organization = await client.fetch(
        organizationQueries.getByClerkOrgId,
        { clerkOrgId: orgId },
    );

    if (!organization) {
        throw new OrgContextError("Organization not found", 404);
    }

    // Fetch the team member for this user within this organization
    const teamMember = await client.fetch(
        organizationQueries.getTeamMemberByClerkAndOrg,
        { clerkId: userId, orgId: organization._id },
    );

    if (!teamMember) {
        throw new OrgContextError(
            "Not a member of this organization",
            403,
        );
    }

    return {
        organization,
        teamMember,
        orgRole,
        orgId: organization._id,
    };
}
