import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import {
    getOrganizationRoles,
    createRole,
} from "@/features/roles/services/rolesService";
import { logAuditEvent } from "@/features/audit/services/auditService";

/**
 * GET /api/roles — List all roles for the organization
 */
export async function GET() {
    try {
        const context = await resolveOrgContext();

        // Anyone in the org can view roles (needed to display role names in UI)
        const roles = await getOrganizationRoles(context.orgId);
        return NextResponse.json(roles);
    } catch (error) {
        console.error("Error fetching roles:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch roles" },
            { status },
        );
    }
}

/**
 * POST /api/roles — Create a new custom role
 */
export async function POST(request) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_ROLES);

        const { name, description, permissions } = await request.json();

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "Role name is required" },
                { status: 400 },
            );
        }

        if (!permissions || !Array.isArray(permissions)) {
            return NextResponse.json(
                { error: "Permissions array is required" },
                { status: 400 },
            );
        }

        const result = await createRole(context.orgId, {
            name: name.trim(),
            description: description?.trim() || "",
            permissions,
        });

        await logAuditEvent({
            action: "role.created",
            category: "roles",
            description: `Created role "${name.trim()}"`,
            actorId: context.teamMember._id,
            orgId: context.orgId,
            targetType: "role",
            targetId: result._key,
            metadata: {
                after: JSON.stringify({ name: name.trim(), permissions }),
            },
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Error creating role:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to create role" },
            { status },
        );
    }
}
