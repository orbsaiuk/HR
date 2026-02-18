import { ADMIN_ROLE_KEY, ALL_PERMISSIONS } from "@/shared/lib/permissions";

/**
 * Check if the current user has a specific permission based on their role in the org context.
 *
 * @param {Object} context - The resolved org context from resolveOrgContext()
 * @param {string} context.teamMember - The team member entry (must include roleKey)
 * @param {Object} context.organization - The organization (must include roles[])
 * @param {string} permission - The permission key to check (from PERMISSIONS constant)
 * @returns {boolean}
 */
export function hasPermission(context, permission) {
    const { teamMember, organization } = context;

    if (!teamMember || !organization) return false;

    const roleKey = teamMember.roleKey;

    // Admin role always has all permissions (safety net)
    if (roleKey === ADMIN_ROLE_KEY) return true;

    // Find the role in the organization's roles array
    const role = organization.roles?.find((r) => r._key === roleKey);
    if (!role) return false;

    return role.permissions?.includes(permission) ?? false;
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
 */
export function getUserPermissions(context) {
    const { teamMember, organization } = context;

    if (!teamMember || !organization) return [];

    const roleKey = teamMember.roleKey;

    // Admin gets everything
    if (roleKey === ADMIN_ROLE_KEY) return [...ALL_PERMISSIONS];

    const role = organization.roles?.find((r) => r._key === roleKey);
    return role?.permissions || [];
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
