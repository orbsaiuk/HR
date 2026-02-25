export const apiKeyQueries = {
    /**
     * Find an API key by its hash.
     * Used during request authentication to validate the key.
     * Returns only the fields needed for permission resolution.
     */
    getByHash: `*[_type == "apiKey" && keyHash == $keyHash && isRevoked != true][0] {
        _id,
        name,
        keyPrefix,
        permissions,
        "organization": organization-> {
            _id,
            clerkOrgId,
            roles[] {
                _key,
                name,
                permissions,
                isSystem
            }
        },
        "createdBy": createdBy-> { _id, name, email },
        expiresAt,
        isRevoked,
        createdAt
    }`,

    /**
     * Get all API keys for an organization (for management UI).
     * Does NOT return the keyHash — only metadata.
     */
    getByOrg: `*[_type == "apiKey" && organization._ref == $orgId] | order(createdAt desc) {
        _id,
        name,
        keyPrefix,
        permissions,
        "createdBy": createdBy-> { _id, name, email },
        expiresAt,
        lastUsedAt,
        isRevoked,
        createdAt
    }`,

    /**
     * Get a single API key by ID (for management UI).
     * Does NOT return the keyHash.
     */
    getById: `*[_type == "apiKey" && _id == $id][0] {
        _id,
        name,
        keyPrefix,
        permissions,
        "organization": organization-> { _id, name },
        "createdBy": createdBy-> { _id, name, email },
        expiresAt,
        lastUsedAt,
        isRevoked,
        createdAt
    }`,
};
