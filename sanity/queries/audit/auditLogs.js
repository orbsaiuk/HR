/**
 * Shared projection for audit log fields.
 * Used across all queries to ensure consistent shape.
 */
const AUDIT_LOG_PROJECTION = `{
    _id,
    action,
    category,
    description,
    "actor": actor-> { _id, name, email, avatar },
    targetType,
    targetId,
    metadata,
    createdAt
  }`;

export const auditLogQueries = {
  /**
   * Get audit logs for an organization, ordered by most recent.
   * Supports pagination via $offset and $limit parameters.
   */
  getByOrg: `*[_type == "auditLog" && organization._ref == $orgId] | order(createdAt desc) [$offset...$end] ${AUDIT_LOG_PROJECTION}`,

  /**
   * Get audit logs filtered by category with pagination.
   */
  getByCategory: `*[_type == "auditLog" && organization._ref == $orgId && category == $category] | order(createdAt desc) [$offset...$end] ${AUDIT_LOG_PROJECTION}`,

  /**
   * Get audit logs filtered by actor with pagination.
   */
  getByActor: `*[_type == "auditLog" && organization._ref == $orgId && actor._ref == $actorId] | order(createdAt desc) [$offset...$end] ${AUDIT_LOG_PROJECTION}`,

  /**
   * Get audit logs filtered by both category and actor with pagination.
   */
  getByCategoryAndActor: `*[_type == "auditLog" && organization._ref == $orgId && category == $category && actor._ref == $actorId] | order(createdAt desc) [$offset...$end] ${AUDIT_LOG_PROJECTION}`,

  /**
   * Get audit logs filtered by date range with pagination.
   * $startDate and $endDate are ISO datetime strings.
   */
  getByDateRange: `*[_type == "auditLog" && organization._ref == $orgId && createdAt >= $startDate && createdAt <= $endDate] | order(createdAt desc) [$offset...$end] ${AUDIT_LOG_PROJECTION}`,

  /**
   * Get audit logs filtered by category and date range with pagination.
   */
  getByCategoryAndDateRange: `*[_type == "auditLog" && organization._ref == $orgId && category == $category && createdAt >= $startDate && createdAt <= $endDate] | order(createdAt desc) [$offset...$end] ${AUDIT_LOG_PROJECTION}`,

  /**
   * Get audit logs filtered by actor and date range with pagination.
   */
  getByActorAndDateRange: `*[_type == "auditLog" && organization._ref == $orgId && actor._ref == $actorId && createdAt >= $startDate && createdAt <= $endDate] | order(createdAt desc) [$offset...$end] ${AUDIT_LOG_PROJECTION}`,

  /**
   * Get audit logs filtered by all filters (category, actor, date range) with pagination.
   */
  getByAllFilters: `*[_type == "auditLog" && organization._ref == $orgId && category == $category && actor._ref == $actorId && createdAt >= $startDate && createdAt <= $endDate] | order(createdAt desc) [$offset...$end] ${AUDIT_LOG_PROJECTION}`,

  // ─── Export queries (no pagination — fetch all matching records) ───────────

  /**
   * Export all audit logs for an organization (no pagination).
   * Used for CSV/JSON export.
   */
  exportByOrg: `*[_type == "auditLog" && organization._ref == $orgId] | order(createdAt desc) ${AUDIT_LOG_PROJECTION}`,

  /**
   * Export audit logs filtered by category (no pagination).
   */
  exportByCategory: `*[_type == "auditLog" && organization._ref == $orgId && category == $category] | order(createdAt desc) ${AUDIT_LOG_PROJECTION}`,

  /**
   * Export audit logs filtered by date range (no pagination).
   */
  exportByDateRange: `*[_type == "auditLog" && organization._ref == $orgId && createdAt >= $startDate && createdAt <= $endDate] | order(createdAt desc) ${AUDIT_LOG_PROJECTION}`,

  /**
   * Export audit logs filtered by category and date range (no pagination).
   */
  exportByCategoryAndDateRange: `*[_type == "auditLog" && organization._ref == $orgId && category == $category && createdAt >= $startDate && createdAt <= $endDate] | order(createdAt desc) ${AUDIT_LOG_PROJECTION}`,

  // ─── Count queries ─────────────────────────────────────────────────────────

  /**
   * Count total audit logs for an organization (for pagination)
   */
  countByOrg: `count(*[_type == "auditLog" && organization._ref == $orgId])`,

  /**
   * Count audit logs filtered by category
   */
  countByCategory: `count(*[_type == "auditLog" && organization._ref == $orgId && category == $category])`,

  /**
   * Count audit logs filtered by date range
   */
  countByDateRange: `count(*[_type == "auditLog" && organization._ref == $orgId && createdAt >= $startDate && createdAt <= $endDate])`,

  /**
   * Count audit logs filtered by category and date range
   */
  countByCategoryAndDateRange: `count(*[_type == "auditLog" && organization._ref == $orgId && category == $category && createdAt >= $startDate && createdAt <= $endDate])`,

  // ─── Retention ─────────────────────────────────────────────────────────────

  /**
   * Get IDs of audit logs older than a given date (for retention cleanup).
   * Returns only _id to minimize data transfer.
   */
  getOlderThan: `*[_type == "auditLog" && organization._ref == $orgId && createdAt < $cutoffDate]._id`,
};
