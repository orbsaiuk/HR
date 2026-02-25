import { client } from "@/sanity/client";
import { auditLogQueries } from "@/sanity/queries";

/**
 * Create an audit log entry.
 * Called from API routes after successful operations.
 * Errors are swallowed — audit logging must never break the main operation.
 */
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

function buildQueryAndParams(orgId, options = {}) {
    const {
        category,
        actorId,
        startDate,
        endDate,
        page = 1,
        pageSize = 25,
        forExport = false,
    } = options;

    const offset = forExport ? 0 : (page - 1) * pageSize;
    const end = forExport ? 99999 : offset + pageSize;

    const hasDateRange = startDate && endDate;
    const hasCategory = !!category;
    const hasActor = !!actorId;

    const baseParams = { orgId, offset, end };

    if (forExport) {
        // Export queries — no pagination
        if (hasCategory && hasDateRange) {
            return {
                query: auditLogQueries.exportByCategoryAndDateRange,
                params: { ...baseParams, category, startDate, endDate },
            };
        }
        if (hasCategory) {
            return {
                query: auditLogQueries.exportByCategory,
                params: { ...baseParams, category },
            };
        }
        if (hasDateRange) {
            return {
                query: auditLogQueries.exportByDateRange,
                params: { ...baseParams, startDate, endDate },
            };
        }
        return {
            query: auditLogQueries.exportByOrg,
            params: baseParams,
        };
    }

    // Paginated queries
    if (hasCategory && hasActor && hasDateRange) {
        return {
            query: auditLogQueries.getByAllFilters,
            params: { ...baseParams, category, actorId, startDate, endDate },
        };
    }
    if (hasCategory && hasActor) {
        return {
            query: auditLogQueries.getByCategoryAndActor,
            params: { ...baseParams, category, actorId },
        };
    }
    if (hasCategory && hasDateRange) {
        return {
            query: auditLogQueries.getByCategoryAndDateRange,
            params: { ...baseParams, category, startDate, endDate },
        };
    }
    if (hasActor && hasDateRange) {
        return {
            query: auditLogQueries.getByActorAndDateRange,
            params: { ...baseParams, actorId, startDate, endDate },
        };
    }
    if (hasCategory) {
        return {
            query: auditLogQueries.getByCategory,
            params: { ...baseParams, category },
        };
    }
    if (hasActor) {
        return {
            query: auditLogQueries.getByActor,
            params: { ...baseParams, actorId },
        };
    }
    if (hasDateRange) {
        return {
            query: auditLogQueries.getByDateRange,
            params: { ...baseParams, startDate, endDate },
        };
    }
    return {
        query: auditLogQueries.getByOrg,
        params: baseParams,
    };
}

/**
 * Build the count query and params based on active filters.
 */
function buildCountQueryAndParams(orgId, options = {}) {
    const { category, startDate, endDate } = options;
    const hasDateRange = startDate && endDate;

    if (category && hasDateRange) {
        return {
            query: auditLogQueries.countByCategoryAndDateRange,
            params: { orgId, category, startDate, endDate },
        };
    }
    if (category) {
        return {
            query: auditLogQueries.countByCategory,
            params: { orgId, category },
        };
    }
    if (hasDateRange) {
        return {
            query: auditLogQueries.countByDateRange,
            params: { orgId, startDate, endDate },
        };
    }
    return {
        query: auditLogQueries.countByOrg,
        params: { orgId },
    };
}

export async function getAuditLogs(orgId, options = {}) {
    const safeOptions = {
        ...options,
        pageSize: Math.min(options.pageSize || 25, 100), // Cap at 100
    };
    const { query, params } = buildQueryAndParams(orgId, safeOptions);
    return client.fetch(query, params);
}


export async function getAuditLogCount(orgId, options = {}) {
    const { query, params } = buildCountQueryAndParams(orgId, options);
    return client.fetch(query, params);
}

export async function exportAuditLogs(orgId, options = {}) {
    const { query, params } = buildQueryAndParams(orgId, {
        ...options,
        forExport: true,
    });
    return client.fetch(query, params);
}

export async function deleteOldAuditLogs(orgId, retentionDays) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const ids = await client.fetch(auditLogQueries.getOlderThan, {
        orgId,
        cutoffDate: cutoffDate.toISOString(),
    });

    if (!ids || ids.length === 0) return 0;

    // Delete in batches of 100 to avoid transaction size limits
    const BATCH_SIZE = 100;
    let deleted = 0;

    for (let i = 0; i < ids.length; i += BATCH_SIZE) {
        const batch = ids.slice(i, i + BATCH_SIZE);
        const transaction = client.transaction();
        batch.forEach((id) => transaction.delete(id));
        await transaction.commit();
        deleted += batch.length;
    }

    return deleted;
}
