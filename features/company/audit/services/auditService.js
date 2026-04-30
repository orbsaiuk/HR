import {
  createLog,
  fetchLogs,
  countLogs,
  fetchAllLogs,
  deleteLogsBefore,
} from "../repositories/auditRepository";

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
    return await createLog({
      action,
      category,
      description,
      actorId,
      orgId,
      targetType,
      targetId,
      metadata,
    });
  } catch (error) {
    // Audit logging should never break the main operation.
    // Log the error but don't re-throw.
    console.error(
      "[auditService] Failed to create audit log:",
      error.message
    );
    return null;
  }
}

// ─── Query Helpers ────────────────────────────────────────────────────────────

function normalizeFilters(options = {}) {
  const { category, actorId, startDate, endDate } = options;
  const hasDateRange = !!(startDate || endDate);
  return {
    category: category || undefined,
    actorId: actorId || undefined,
    startDate: hasDateRange ? (startDate || "2000-01-01T00:00:00.000Z") : undefined,
    endDate: hasDateRange ? (endDate || "2099-12-31T23:59:59.999Z") : undefined,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function getAuditLogs(orgId, options = {}) {
  const safeOptions = {
    ...options,
    pageSize: Math.min(options.pageSize || 25, 100),
  };
  const f = normalizeFilters(safeOptions);
  const offset = ((safeOptions.page || 1) - 1) * safeOptions.pageSize;
  return fetchLogs(orgId, { filters: f, offset, limit: safeOptions.pageSize });
}

export async function getAuditLogCount(orgId, options = {}) {
  const f = normalizeFilters(options);
  return countLogs(orgId, { filters: f });
}

export async function exportAuditLogs(orgId, options = {}) {
  const f = normalizeFilters(options);
  return fetchAllLogs(orgId, { filters: f });
}

export async function deleteOldAuditLogs(orgId, retentionDays) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
  return deleteLogsBefore(orgId, cutoffDate);
}
