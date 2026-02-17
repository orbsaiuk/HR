import { client, clientRead } from "@/sanity/client";
import { orgRequestQueries } from "@/sanity/queries/organizations";
import { clerkClient } from "@clerk/nextjs/server";
import { getOrganizationByClerkOrgId } from "@/features/organizations/services/organizationService";
import { getUserByClerkId } from "@/features/auth/services/userService";

export async function createRequest(userId, data, orgLogoAssetRef) {
  // Check for existing pending request
  const pendingCount = await clientRead.fetch(
    orgRequestQueries.checkDuplicate,
    { userId },
  );

  if (pendingCount > 0) {
    throw Object.assign(
      new Error("You already have an existing organization request"),
      { status: 400 },
    );
  }

  const now = new Date().toISOString();

  return client.create({
    _type: "organizationRequest",
    requestedBy: { _type: "reference", _ref: userId },
    contactEmail: data.contactEmail,
    contactPhone: data.contactPhone || undefined,
    orgName: data.orgName,
    orgDescription: data.orgDescription || undefined,
    orgLocation: data.orgLocation || undefined,
    orgWebsite: data.orgWebsite || undefined,
    orgIndustry: data.orgIndustry || undefined,
    orgSize: data.orgSize || undefined,
    orgLogo: orgLogoAssetRef
      ? { _type: "image", asset: { _type: "reference", _ref: orgLogoAssetRef } }
      : undefined,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  });
}

export async function getRequestsByUser(userId) {
  return clientRead.fetch(orgRequestQueries.getByUser, { userId });
}

export async function getRequestById(id) {
  return clientRead.fetch(orgRequestQueries.getById, { id });
}

export async function approveRequest(id, adminInfo, orgSlug) {
  const request = await clientRead.fetch(orgRequestQueries.getById, { id });

  if (!request) {
    throw Object.assign(new Error("Request not found"), { status: 404 });
  }

  if (request.status !== "pending") {
    throw Object.assign(new Error(`Request is already ${request.status}`), {
      status: 400,
    });
  }

  const now = new Date().toISOString();
  const clerk = await clerkClient();

  // 1. Create Clerk Organization (createdBy auto-adds user as admin)
  //    Pass request data as public_metadata so the webhook can use it.
  const clerkOrg = await clerk.organizations.createOrganization({
    name: request.orgName,
    createdBy: request.requestedBy?.clerkId,
    publicMetadata: {
      description: request.orgDescription || "",
      website: request.orgWebsite || undefined,
      industry: request.orgIndustry || undefined,
      size: request.orgSize || undefined,
      requestId: id,
    },
  });

  // 2. Wait briefly for the webhook to create the Sanity org, then find it.
  //    If the webhook hasn't fired yet, create the org ourselves.
  let sanityOrg = null;
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    sanityOrg = await getOrganizationByClerkOrgId(clerkOrg.id);
    if (sanityOrg) break;
    await new Promise((r) => setTimeout(r, 1000));
  }

  // Resolve the slug: prefer the one passed during approval, fall back to auto-generated
  const resolvedSlug = orgSlug
    ? { _type: "slug", current: orgSlug }
    : {
      _type: "slug",
      current: request.orgName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
    };

  if (!sanityOrg) {
    // Webhook hasn't fired yet — create the org ourselves
    sanityOrg = await client.create({
      _type: "organization",
      name: request.orgName,
      slug: resolvedSlug,
      clerkOrgId: clerkOrg.id,
      description: request.orgDescription || "",
      location: request.orgLocation || undefined,
      website: request.orgWebsite || undefined,
      industry: request.orgIndustry || undefined,
      size: request.orgSize || undefined,
      logo: request.orgLogo || undefined,
      settings: {
        careerPageEnabled: true,
      },
      teamMembers: [],
      invites: [],
      createdAt: now,
      updatedAt: now,
    });
  } else {
    // Webhook created the org — update it with request-specific data
    await client
      .patch(sanityOrg._id)
      .setIfMissing({
        teamMembers: [],
        invites: [],
      })
      .set({
        slug: resolvedSlug,
        description: request.orgDescription || "",
        location: request.orgLocation || undefined,
        website: request.orgWebsite || undefined,
        industry: request.orgIndustry || undefined,
        size: request.orgSize || undefined,
        logo: request.orgLogo || undefined,
        updatedAt: now,
      })
      .commit();
  }

  // 3. Add the requesting user to the org's embedded teamMembers array as admin.
  //    The webhook (organizationMembership.created) may also do this, but
  //    we handle it here to avoid race conditions.
  if (request.requestedBy?.clerkId) {
    const userDoc = await getUserByClerkId(request.requestedBy.clerkId);

    if (userDoc) {
      // Check if already a team member in this org
      const isAlreadyMember = sanityOrg.teamMembers?.some(
        (tm) => tm.user?._ref === userDoc._id,
      );

      if (!isAlreadyMember) {
        // Add as admin (first member)
        await client
          .patch(sanityOrg._id)
          .setIfMissing({ teamMembers: [] })
          .append("teamMembers", [
            {
              _key: `${userDoc._id}-${Date.now()}`,
              user: {
                _type: "reference",
                _ref: userDoc._id,
              },
              role: "admin",
              joinedAt: now,
            },
          ])
          .commit();
      }
    }
  }

  // 4. Set the user's role to teamMember so the UI updates
  if (request.requestedBy?.clerkId) {
    await clerk.users.updateUserMetadata(request.requestedBy.clerkId, {
      publicMetadata: { role: "teamMember" },
    });
  }

  // 5. Update request status to approved and link the organization
  const updated = await client
    .patch(id)
    .set({
      status: "approved",
      clerkOrgId: clerkOrg.id,
      organization: { _type: "reference", _ref: sanityOrg._id },
      reviewedAt: now,
      reviewedBy: adminInfo?.email || adminInfo?.name || "admin",
      updatedAt: now,
    })
    .commit();

  return updated;
}

/**
 * Reject an organization request.
 * @param {string} id - Request document _id
 * @param {string} reason - Rejection reason
 * @param {object} adminInfo - { name, email } of the admin who rejected
 */
export async function rejectRequest(id, reason, adminInfo) {
  const request = await clientRead.fetch(orgRequestQueries.getById, { id });

  if (!request) {
    throw Object.assign(new Error("Request not found"), { status: 404 });
  }

  if (request.status !== "pending") {
    throw Object.assign(new Error(`Request is already ${request.status}`), {
      status: 400,
    });
  }

  const now = new Date().toISOString();

  return client
    .patch(id)
    .set({
      status: "rejected",
      rejectionReason: reason,
      reviewedAt: now,
      reviewedBy: adminInfo?.email || adminInfo?.name || "admin",
      updatedAt: now,
    })
    .commit();
}

/**
 * Get all pending organization requests (for admin use).
 */
export async function getPendingRequests() {
  return clientRead.fetch(orgRequestQueries.getPending);
}

export const orgRequestService = {
  createRequest,
  getRequestsByUser,
  getRequestById,
  approveRequest,
  rejectRequest,
  getPendingRequests,
};
