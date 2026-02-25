import { NextResponse } from "next/server";
import { resolveOrgContext } from "@/shared/lib/orgContext";
import { requirePermission } from "@/shared/lib/permissionChecker";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { getApiKeyById, revokeApiKey } from "@/features/api-keys/services/apiKeyService";
import { logAuditEvent } from "@/features/audit/services/auditService";

/**
 * GET /api/api-keys/[id] — Get a single API key by ID.
 * Requires manage_settings permission.
 */
export async function GET(request, { params }) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_SETTINGS);

        const { id } = await params;
        const apiKey = await getApiKeyById(id);

        if (!apiKey) {
            return NextResponse.json({ error: "API key not found" }, { status: 404 });
        }

        // Ensure the key belongs to this organization
        if (apiKey.organization?._id !== context.orgId) {
            return NextResponse.json({ error: "API key not found" }, { status: 404 });
        }

        return NextResponse.json(apiKey);
    } catch (error) {
        console.error("Error fetching API key:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to fetch API key" },
            { status },
        );
    }
}

/**
 * DELETE /api/api-keys/[id] — Revoke an API key.
 * Sets isRevoked = true (document is kept for audit purposes).
 * Requires manage_settings permission.
 */
export async function DELETE(request, { params }) {
    try {
        const context = await resolveOrgContext();
        requirePermission(context, PERMISSIONS.MANAGE_SETTINGS);

        const { id } = await params;
        const apiKey = await getApiKeyById(id);

        if (!apiKey) {
            return NextResponse.json({ error: "API key not found" }, { status: 404 });
        }

        // Ensure the key belongs to this organization
        if (apiKey.organization?._id !== context.orgId) {
            return NextResponse.json({ error: "API key not found" }, { status: 404 });
        }

        await revokeApiKey(id);

        await logAuditEvent({
            action: "api_key.revoked",
            category: "settings",
            description: `Revoked API key "${apiKey.name}" (${apiKey.keyPrefix}...)`,
            actorId: context.teamMember._id,
            orgId: context.orgId,
            targetType: "apiKey",
            targetId: id,
            metadata: {
                before: JSON.stringify({ name: apiKey.name, keyPrefix: apiKey.keyPrefix }),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error revoking API key:", error);
        const status = error.status || 500;
        return NextResponse.json(
            { error: error.message || "Failed to revoke API key" },
            { status },
        );
    }
}
