export const auditLogQueries = {
    /**
     * Get audit logs for an organization, ordered by most recent.
     * Supports pagination via $limit parameter.
     */
    getByOrg: `*[_type == "auditLog" && organization._ref == $orgId] | order(createdAt desc) [0...$limit] {
    _id,
    action,
    category,
    description,
    "actor": actor-> { _id, name, email, avatar },
    targetType,
    targetId,
    metadata,
    createdAt
  }`,

    /**
     * Get audit logs filtered by category
     */
    getByCategory: `*[_type == "auditLog" && organization._ref == $orgId && category == $category] | order(createdAt desc) [0...$limit] {
    _id,
    action,
    category,
    description,
    "actor": actor-> { _id, name, email, avatar },
    targetType,
    targetId,
    metadata,
    createdAt
  }`,

    /**
     * Get audit logs filtered by actor
     */
    getByActor: `*[_type == "auditLog" && organization._ref == $orgId && actor._ref == $actorId] | order(createdAt desc) [0...$limit] {
    _id,
    action,
    category,
    description,
    "actor": actor-> { _id, name, email, avatar },
    targetType,
    targetId,
    metadata,
    createdAt
  }`,

    /**
     * Get audit logs filtered by both category and actor
     */
    getByCategoryAndActor: `*[_type == "auditLog" && organization._ref == $orgId && category == $category && actor._ref == $actorId] | order(createdAt desc) [0...$limit] {
    _id,
    action,
    category,
    description,
    "actor": actor-> { _id, name, email, avatar },
    targetType,
    targetId,
    metadata,
    createdAt
  }`,

    /**
     * Count total audit logs for an organization (for pagination)
     */
    countByOrg: `count(*[_type == "auditLog" && organization._ref == $orgId])`,

    /**
     * Count audit logs filtered by category
     */
    countByCategory: `count(*[_type == "auditLog" && organization._ref == $orgId && category == $category])`,
};
