import { client, clientRead } from "@/sanity/client";
import { orgRequestQueries } from "@/sanity/queries/organizations";

/**
 * Repository layer for organization request data access.
 * All direct Sanity queries are encapsulated here.
 */


export async function countActiveRequestsByUser(userId) {
    return clientRead.fetch(orgRequestQueries.checkDuplicate, { userId });
}


export async function createOrgRequest(doc) {
    return client.create(doc);
}


export async function fetchRequestsByUser(userId) {
    return clientRead.fetch(orgRequestQueries.getByUser, { userId });
}


export async function fetchRequestById(id) {
    return clientRead.fetch(orgRequestQueries.getById, { id });
}

export async function fetchPendingRequests() {
    return clientRead.fetch(orgRequestQueries.getPending);
}


export async function markRequestApproved(id, { clerkOrgId, sanityOrgId, reviewedBy }) {
    const now = new Date().toISOString();
    return client
        .patch(id)
        .set({
            status: "approved",
            clerkOrgId,
            organization: { _type: "reference", _ref: sanityOrgId },
            reviewedAt: now,
            reviewedBy,
            updatedAt: now,
        })
        .commit();
}


export async function markRequestRejected(id, reason, reviewedBy) {
    const now = new Date().toISOString();
    return client
        .patch(id)
        .set({
            status: "rejected",
            rejectionReason: reason,
            reviewedAt: now,
            reviewedBy,
            updatedAt: now,
        })
        .commit();
}
