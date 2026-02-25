import { client } from "@/sanity/client";
import { auditLogQueries } from "@/sanity/queries";

export async function logAuditEvent({
    action,
    category,
    description,
    actorId,
    orgId,
    targetType,
    targetId,
    metadata,
}) {
    try {
        return await client.create({
            _type: "auditLog",
            action,
            category,
            description,
            actor: { _type: "reference", _ref: actorId },
            organization: { _type: "reference", _ref: orgId },
            targetType: targetType || undefined,
            targetId: targetId || undefined,
            metadata: metadata || {},
            createdAt: new Date().toISOString(),
        });
    } catch (error) {
        // Audit logging should never break the main operation.
        // Log the error but don't re-throw.
        console.error("[auditService] Failed to create audit log:", error.message);
        return null;
    }
}

export async function getAuditLogs(
    orgId,
    { category, actorId, limit = 50 } = {},
) {
    if (category && actorId) {
        return client.fetch(auditLogQueries.getByCategoryAndActor, {
            orgId,
            category,
            actorId,
            limit,
        });
    }
    if (category) {
        return client.fetch(auditLogQueries.getByCategory, {
            orgId,
            category,
            limit,
        });
    }
    if (actorId) {
        return client.fetch(auditLogQueries.getByActor, {
            orgId,
            actorId,
            limit,
        });
    }
    return client.fetch(auditLogQueries.getByOrg, { orgId, limit });
}

/**
 * Get total count of audit logs for an organization (for pagination).
 *
 * @param {string} orgId - The Sanity organization _id
 * @param {Object} [options]
 * @param {string} [options.category] - Filter by category
 */
export async function getAuditLogCount(orgId, { category } = {}) {
    if (category) {
        return client.fetch(auditLogQueries.countByCategory, { orgId, category });
    }
    return client.fetch(auditLogQueries.countByOrg, { orgId });
}
