import { client } from "@/sanity/client";
import { organizationQueries } from "@/sanity/queries";

/**
 * Get all temporary grants for an organization.
 * Returns all grants (including expired ones) for management purposes.
 */
export async function getTemporaryGrants(orgId) {
    const grants = await client.fetch(organizationQueries.getTemporaryGrants, { orgId });
    return grants || [];
}

/**
 * Get active (non-expired) temporary grants for a specific user.
 */
export async function getActiveTemporaryGrantsForUser(orgId, userId) {
    const grants = await client.fetch(
        organizationQueries.getActiveTemporaryGrantsForUser,
        { orgId, userId },
    );
    return grants || [];
}

export async function grantTemporaryPermissions(orgId, userId, permissions, expiresAt, grantedById, reason) {
    const grant = {
        _key: `grant_${userId}_${Date.now()}`,
        user: { _type: "reference", _ref: userId },
        permissions,
        grantedBy: { _type: "reference", _ref: grantedById },
        expiresAt,
        reason: reason || "",
        grantedAt: new Date().toISOString(),
    };

    return client
        .patch(orgId)
        .append("temporaryGrants", [grant])
        .commit();
}


export async function revokeTemporaryGrant(orgId, grantKey) {
    return client
        .patch(orgId)
        .unset([`temporaryGrants[_key == "${grantKey}"]`])
        .commit();
}


export async function cleanupExpiredGrants(orgId) {
    const allGrants = await getTemporaryGrants(orgId);
    const now = new Date();

    const expiredKeys = allGrants
        .filter((grant) => grant.expiresAt && new Date(grant.expiresAt) <= now)
        .map((grant) => grant._key);

    if (expiredKeys.length === 0) return 0;

    const unsetPaths = expiredKeys.map((key) => `temporaryGrants[_key == "${key}"]`);
    await client.patch(orgId).unset(unsetPaths).commit();

    return expiredKeys.length;
}
