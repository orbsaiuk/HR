import { client, clientRead } from "@/sanity/client";
import { orgRequestQueries } from "@/sanity/queries/organizations";
import { clerkClient } from "@clerk/nextjs/server";

export async function createRequest(userId, data) {
    // Check for existing pending request
    const pendingCount = await clientRead.fetch(
        orgRequestQueries.checkDuplicate,
        { userId },
    );

    if (pendingCount > 0) {
        throw Object.assign(
            new Error("You already have a pending organization request"),
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
        orgSlug: data.orgSlug
            ? { _type: "slug", current: data.orgSlug }
            : undefined,
        orgDescription: data.orgDescription || undefined,
        orgWebsite: data.orgWebsite || undefined,
        orgIndustry: data.orgIndustry || undefined,
        orgSize: data.orgSize || undefined,
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

export async function approveRequest(id, adminInfo) {
    const request = await clientRead.fetch(orgRequestQueries.getById, { id });

    if (!request) {
        throw Object.assign(new Error("Request not found"), { status: 404 });
    }

    if (request.status !== "pending") {
        throw Object.assign(
            new Error(`Request is already ${request.status}`),
            { status: 400 },
        );
    }

    const clerk = await clerkClient();

    // 1. Create Clerk Organization
    const clerkOrg = await clerk.organizations.createOrganization({
        name: request.orgName,
        slug: request.orgSlug?.current || undefined,
        createdBy: request.requestedBy?.clerkId,
    });

    // 2. Create organization doc in Sanity
    const sanityOrg = await client.create({
        _type: "organization",
        name: request.orgName,
        slug: request.orgSlug || {
            _type: "slug",
            current: clerkOrg.slug,
        },
        clerkOrgId: clerkOrg.id,
        description: request.orgDescription || "",
        website: request.orgWebsite || undefined,
        settings: {
            careerPageEnabled: true,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    // 3. Add requester as org admin in Clerk
    if (request.requestedBy?.clerkId) {
        await clerk.organizations.createOrganizationMembership({
            organizationId: clerkOrg.id,
            userId: request.requestedBy.clerkId,
            role: "org:admin",
        });
    }

    // 4. Update request status to approved
    const now = new Date().toISOString();
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
        throw Object.assign(
            new Error(`Request is already ${request.status}`),
            { status: 400 },
        );
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
