-- ============================================================
-- 001: Audit Logs
-- Mirrors: sanity/schemas/audit/auditLog.js
-- ============================================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- The action performed, e.g. "role.created", "member.removed"
  action        TEXT NOT NULL,

  -- Category: "roles", "team", "forms", "positions", "applications", "settings"
  category      TEXT NOT NULL,

  -- Human-readable description
  description   TEXT NOT NULL,

  -- Actor: references user by Sanity _id (string FK, not hard constraint)
  actor_id      TEXT NOT NULL,

  -- Organization: references org by Sanity _id
  org_id        TEXT NOT NULL,

  -- The type of resource affected, e.g. "role", "teamMember", "form"
  target_type   TEXT,

  -- The ID of the affected resource
  target_id     TEXT,

  -- Metadata JSON: { before, after, ip }
  metadata      JSONB DEFAULT '{}',

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listing logs by organization (most common query)
CREATE INDEX IF NOT EXISTS idx_audit_logs_org_id
  ON audit_logs (org_id, created_at DESC);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_audit_logs_category
  ON audit_logs (org_id, category, created_at DESC);

-- Index for filtering by actor
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor
  ON audit_logs (actor_id, created_at DESC);
