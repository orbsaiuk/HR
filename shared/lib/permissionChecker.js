import { ADMIN_ROLE_KEY, ALL_PERMISSIONS, PERMISSION_IMPLICATIONS, expandPermissions } from "@/shared/lib/permissions";

/**
 * Get active temporary grants for a user (non-expired only).
 * Returns the combined permissions from all active grants.
 */
function getActiveTemporaryPermissions(context) {
    const { teamMember, organization } = context;
    if (!teamMember || !organization?.temporaryGrants) return [];

    const now = new Date();
    const userId = teamMember._id;

    const activeGrants = organization.temporaryGrants.filter((grant) => {
        if (!grant.user?._id || grant.user._id !== userId) return false;
        if (!grant.expiresAt) return false;
        return new Date(grant.expiresAt) > now;
    });

    // Flatten all permissions from active grants
    const tempPermissions = activeGrants.flatMap((grant) => grant.permissions || []);
    return [...new Set(tempPermissions)];
}

/**
 * Check if the current user has a specific permission.
 * Supports permission implications — e.g., manage_forms implies view_forms.
 * Also checks active temporary grants and API key permissions.
 */
export function hasPermission(context, permission) {
    const { teamMember, organization } = context;

    if (!teamMember || !organization) return false;

    // API key context — check the key's explicit permissions
    if (context.isApiKeyContext) {
        const keyPerms = context.apiKeyPermissions || [];
        if (keyPerms.includes(permission)) return true;
        // Check implications for API key permissions
        for (const perm of keyPerms) {
            const implied = PERMISSION_IMPLICATIONS[perm];
            if (implied && implied.includes(permission)) return true;
        }
        return false;
    }

    const roleKey = teamMember.roleKey;

    // Admin role always has all permissions (safety net)
    if (roleKey === ADMIN_ROLE_KEY) return true;

    // Find the role in the organization's roles array
    const role = organization.roles?.find((r) => r._key === roleKey);
    if (!role) return false;

    const rolePermissions = role.permissions || [];

    // Direct check
    if (rolePermissions.includes(permission)) return true;

    // Implication check: does any permission the user has imply the requested one?
    for (const perm of rolePermissions) {
        const implied = PERMISSION_IMPLICATIONS[perm];
        if (implied && implied.includes(permission)) return true;
    }

    // Temporary grant check: does the user have an active temporary grant for this permission?
    const tempPermissions = getActiveTemporaryPermissions(context);
    if (tempPermissions.includes(permission)) return true;

    // Implication check on temporary permissions
    for (const perm of tempPermissions) {
        const implied = PERMISSION_IMPLICATIONS[perm];
        if (implied && implied.includes(permission)) return true;
    }

    return false;
}

/**
 * Check if the current user has ALL of the specified permissions.
 */
export function hasAllPermissions(context, permissions) {
    return permissions.every((p) => hasPermission(context, p));
}

/**
 * Check if the current user has ANY of the specified permissions.
 */
export function hasAnyPermission(context, permissions) {
    return permissions.some((p) => hasPermission(context, p));
}

/**
 * Get all permissions for the current user based on their role.
 * Returns expanded permissions (with implications resolved) plus any active temporary grants.
 */
export function getUserPermissions(context) {
    const { teamMember, organization } = context;

    if (!teamMember || !organization) return [];

    const roleKey = teamMember.roleKey;

    // Admin gets everything
    if (roleKey === ADMIN_ROLE_KEY) return [...ALL_PERMISSIONS];

    const role = organization.roles?.find((r) => r._key === roleKey);
    const basePermissions = role?.permissions || [];

    // Include active temporary grants
    const tempPermissions = getActiveTemporaryPermissions(context);
    const combined = [...new Set([...basePermissions, ...tempPermissions])];

    // Expand with implications so the frontend has the full picture
    return expandPermissions(combined);
}

/**
 * Require a permission, throwing an error if not present.
 * Use in API routes for clean authorization.
 */
export function requirePermission(context, permission) {
    if (!hasPermission(context, permission)) {
        const error = new Error("Forbidden: insufficient permissions");
        error.status = 403;
        throw error;
    }
}
