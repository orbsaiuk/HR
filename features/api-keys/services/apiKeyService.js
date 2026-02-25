import { client } from "@/sanity/client";
import { apiKeyQueries } from "@/sanity/queries";
import { createHash, randomBytes } from "crypto";

/**
 * Generate a new API key.
 * Returns the raw key (shown once) and stores only the hash.
 *
 * Key format: fba_{32 random hex chars}
 * Example: fba_a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6
 */
function generateRawKey() {
    const random = randomBytes(16).toString("hex");
    return `fba_${random}`;
}

/**
 * Hash an API key using SHA-256.
 * The hash is stored in Sanity; the raw key is never stored.
 */
function hashKey(rawKey) {
    return createHash("sha256").update(rawKey).digest("hex");
}

export async function createApiKey(orgId, createdById, { name, permissions, expiresAt }) {
    const rawKey = generateRawKey();
    const keyHash = hashKey(rawKey);
    const keyPrefix = rawKey.slice(0, 12); // "fba_" + first 8 chars

    const doc = {
        _type: "apiKey",
        name,
        keyHash,
        keyPrefix,
        organization: { _type: "reference", _ref: orgId },
        createdBy: { _type: "reference", _ref: createdById },
        permissions,
        expiresAt: expiresAt || undefined,
        isRevoked: false,
        createdAt: new Date().toISOString(),
    };

    const apiKey = await client.create(doc);

    // Return the raw key — this is the ONLY time it's available
    return { rawKey, apiKey };
}

export async function validateApiKey(rawKey) {
    if (!rawKey || !rawKey.startsWith("fba_")) return null;

    const keyHash = hashKey(rawKey);
    const apiKey = await client.fetch(apiKeyQueries.getByHash, { keyHash });

    if (!apiKey) return null;

    // Check expiration
    if (apiKey.expiresAt && new Date(apiKey.expiresAt) <= new Date()) {
        return null;
    }

    // Update lastUsedAt asynchronously (don't await — don't block the request)
    client
        .patch(apiKey._id)
        .set({ lastUsedAt: new Date().toISOString() })
        .commit()
        .catch((err) => console.error("[apiKeyService] Failed to update lastUsedAt:", err.message));

    return apiKey;
}

/**
 * Get all API keys for an organization (metadata only, no hashes).
 */
export async function getApiKeys(orgId) {
    return client.fetch(apiKeyQueries.getByOrg, { orgId });
}

/**
 * Get a single API key by ID.
 */
export async function getApiKeyById(id) {
    return client.fetch(apiKeyQueries.getById, { id });
}

/**
 * Revoke an API key by setting isRevoked = true.
 * The document is kept for audit purposes.
 */
export async function revokeApiKey(id) {
    return client.patch(id).set({ isRevoked: true }).commit();
}

/**
 * Delete an API key document permanently.
 * Use revokeApiKey() instead for audit trail preservation.
 */
export async function deleteApiKey(id) {
    return client.delete(id);
}
