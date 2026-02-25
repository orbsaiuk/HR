import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission, getUserPermissions } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { createApiKey, getApiKeys } from "@/features/api-keys/services/apiKeyService";
import { logAuditEvent } from "@/features/audit/services/auditService";

/**
 * GET /api/api-keys — List all API keys for the organization.
 * Requires manage_settings permission.
 */
export async function GET() {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_SETTINGS);

        const keys = await getApiKeys(context.orgId);
        return NextResponse.json(keys);
    } catch (error) {
        console.error("Error fetching API keys:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch API keys" },
            { status },
        );
    }
}

export async function POST(request) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_SETTINGS);

        const { name, permissions, expiresAt } = await request.json();

        if (!name || typeof name !== "string" || name.trim().length === 0) {
            return NextResponse.json(
                { error: "API key name is required" },
                { status: 400 },
            );
        }

        if (!permissions || !Array.isArray(permissions) || permissions.length === 0) {
            return NextResponse.json(
                { error: "permissions must be a non-empty array" },
                { status: 400 },
            );
        }

        // Validate that the requested permissions are a subset of the creator's permissions
        const creatorPermissions = getUserPermissions(context);
        const invalidPermissions = permissions.filter((p) => !creatorPermissions.includes(p));
        if (invalidPermissions.length > 0) {
            return NextResponse.json(
                {
                    error: `Cannot grant permissions you don't have: ${invalidPermissions.join(", ")}`,
                },
                { status: 403 },
            );
        }

        const { rawKey, apiKey } = await createApiKey(context.orgId, context.teamMember._id, {
            name: name.trim(),
            permissions,
            expiresAt,
        });

        await logAuditEvent({
            action: "api_key.created",
            category: "settings",
            description: `Created API key "${name.trim()}" with permissions: ${permissions.join(", ")}`,
            actorId: context.teamMember._id,
            orgId: context.orgId,
            targetType: "apiKey",
            targetId: apiKey._id,
            metadata: {
                after: JSON.stringify({ name: name.trim(), permissions, expiresAt }),
            },
        });

        // Return the raw key — this is the ONLY time it's available
        return NextResponse.json({ rawKey, apiKey }, { status: 201 });
    } catch (error) {
        console.error("Error creating API key:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to create API key" },
            { status },
        );
    }
}
