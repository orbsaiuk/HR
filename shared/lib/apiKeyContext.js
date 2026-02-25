import { validateApiKey } from "@/features/api-keys/services/apiKeyService";

export async function resolveApiKeyContext(request) {
    const authHeader = request.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer fba_")) {
        return null;
    }

    const rawKey = authHeader.slice("Bearer ".length);
    const apiKey = await validateApiKey(rawKey);

    if (!apiKey) return null;

    // Build a context object compatible with resolveOrgContext() output
    return {
        organization: apiKey.organization,
        orgId: apiKey.organization._id,
        // Synthetic "team member" for audit logging
        teamMember: {
            _id: apiKey._id,
            roleKey: "api_key",
            name: `API Key: ${apiKey.name}`,
        },
        // API key permissions (already validated against creator's permissions at creation time)
        apiKeyPermissions: apiKey.permissions,
        isApiKeyContext: true,
    };
}

/**
 * Check if a context is an API key context.
 */
export function isApiKeyContext(context) {
    return context?.isApiKeyContext === true;
}
