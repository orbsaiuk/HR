import { NextResponse } from "next/server";
import { resolveOrgContext, invalidateOrgContextCache } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS, ADMIN_ROLE_KEY } from "@/shared/lib/permissions";
import {
    getRoleByKey,
    updateRole,
    deleteRole,
    getRoleMemberCount,
} from "@/features/roles/services/rolesService";
import { logAuditEvent } from "@/features/audit/services/auditService";
import { incrementPermissionsVersion } from "@/features/organizations/services/organizationService";

/**
 * GET /api/roles/[key] — Get a single role by key
 */
export async function GET(request, { params }) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_ROLES);
        const { key } = await params;

        const role = await getRoleByKey(context.orgId, key);
        if (!role) {
            return NextResponse.json({ error: "Role not found" }, { status: 404 });
        }

        // Include member count
        const memberCount = await getRoleMemberCount(context.orgId, key);

        return NextResponse.json({ ...role, memberCount });
    } catch (error) {
        console.error("Error fetching role:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch role" },
            { status },
        );
    }
}

/**
 * PUT /api/roles/[key] — Update a role's name, description, or permissions
 */
export async function PUT(request, { params }) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_ROLES);

        const { key } = await params;
        const updates = await request.json();

        // Verify role exists
        const role = await getRoleByKey(context.orgId, key);
        if (!role) {
            return NextResponse.json({ error: "Role not found" }, { status: 404 });
        }

        const result = await updateRole(context.orgId, key, updates);

        // Invalidate cached org context so permission changes take effect immediately
        invalidateOrgContextCache(context.organization.clerkOrgId);

        await Promise.all([
            logAuditEvent({
                action: "role.updated",
                category: "roles",
                description: `Updated role "${role.name}"`,
                actorId: context.teamMember._id,
                orgId: context.orgId,
                targetType: "role",
                targetId: key,
                metadata: {
                    before: JSON.stringify({ name: role.name, permissions: role.permissions }),
                    after: JSON.stringify(updates),
                },
            }),
            incrementPermissionsVersion(context.orgId),
        ]);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Error updating role:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to update role" },
            { status },
        );
    }
}

/**
 * DELETE /api/roles/[key] — Delete a custom role
 */
export async function DELETE(request, { params }) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_ROLES);

        const { key } = await params;

        // Prevent deleting the admin role
        if (key === ADMIN_ROLE_KEY) {
            return NextResponse.json(
                { error: "Cannot delete the admin role" },
                { status: 400 },
            );
        }

        // Fetch role before deletion for audit log
        const roleToDelete = await getRoleByKey(context.orgId, key);

        const result = await deleteRole(context.orgId, key);

        // Invalidate cached org context so permission changes take effect immediately
        invalidateOrgContextCache(context.organization.clerkOrgId);

        await Promise.all([
            logAuditEvent({
                action: "role.deleted",
                category: "roles",
                description: `Deleted role "${roleToDelete?.name || key}"`,
                actorId: context.teamMember._id,
                orgId: context.orgId,
                targetType: "role",
                targetId: key,
                metadata: {
                    before: JSON.stringify(roleToDelete),
                },
            }),
            incrementPermissionsVersion(context.orgId),
        ]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting role:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to delete role" },
            { status },
        );
    }
}
