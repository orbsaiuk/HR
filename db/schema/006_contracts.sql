-- ============================================================
-- 006: Contracts (instances, not templates)
-- Mirrors: sanity/schemas/contracts/contract.js
--
-- Note: contractTemplate stays in Sanity (content, rich-text clauses).
--       We reference it via template_id (string Sanity _id).
-- ============================================================

CREATE TABLE IF NOT EXISTS contracts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Organization: references org by Sanity _id
  org_id            TEXT NOT NULL,

  -- Creator: references user by Sanity _id
  created_by        TEXT NOT NULL,

  -- Template reference (Sanity _id of contractTemplate)
  template_id       TEXT,

  title             TEXT NOT NULL,
  description       TEXT,

  -- Contract type, e.g. "employment", "freelance", "nda"
  type              TEXT NOT NULL,
  category          TEXT,

  -- Status: "created", "sent"
  status            TEXT NOT NULL DEFAULT 'created',

  -- Form data JSON (all party info, compensation, dates, etc.)
  form_data         JSONB DEFAULT '{}',

  -- Resolved contract clauses: [{ text }]
  clauses           JSONB DEFAULT '[]',

  -- WhatsApp metadata: { lastSentAt, sendCount }
  whatsapp          JSONB DEFAULT '{}',

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listing contracts by org
CREATE INDEX IF NOT EXISTS idx_contracts_org
  ON contracts (org_id, created_at DESC);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_contracts_status
  ON contracts (org_id, status);

-- Index for contracts by creator
CREATE INDEX IF NOT EXISTS idx_contracts_creator
  ON contracts (created_by, created_at DESC);
