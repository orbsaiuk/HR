-- ============================================================
-- 003: Forms, Form Fields, and Form Responses
-- Mirrors: sanity/schemas/forms/form.js (form + formField)
-- ============================================================

CREATE TABLE IF NOT EXISTS forms (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Creator: references user by Sanity _id
  created_by    TEXT NOT NULL,

  -- Organization: references org by Sanity _id
  org_id        TEXT,

  title         TEXT NOT NULL,
  description   TEXT,

  -- "draft", "published", "closed"
  status        TEXT NOT NULL DEFAULT 'draft',

  -- Settings as JSON: { allowAnonymous, requireAuth, limitResponses, expirationDate }
  settings      JSONB DEFAULT '{}',

  -- Assigned users (array of Sanity user _ids)
  assigned_to   JSONB DEFAULT '[]',

  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listing forms by org
CREATE INDEX IF NOT EXISTS idx_forms_org
  ON forms (org_id, updated_at DESC);

-- Index for filtering by status
CREATE INDEX IF NOT EXISTS idx_forms_status
  ON forms (org_id, status);


CREATE TABLE IF NOT EXISTS form_fields (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- FK to forms table
  form_id       UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,

  -- Field type: "text", "textarea", "number", "email", "multipleChoice",
  --             "dropdown", "date", "time", "datetime", "file"
  type          TEXT NOT NULL,

  label         TEXT NOT NULL,
  placeholder   TEXT,
  required      BOOLEAN NOT NULL DEFAULT FALSE,

  -- Options for multipleChoice/dropdown (array of strings)
  options       JSONB DEFAULT '[]',

  -- File type restriction: "any", "image", "document"
  file_type     TEXT DEFAULT 'any',

  -- Validation rules: { min, max, pattern }
  validation    JSONB DEFAULT '{}',

  -- Display order (0-indexed)
  sort_order    INTEGER NOT NULL DEFAULT 0
);

-- Index for fetching fields of a form in order
CREATE INDEX IF NOT EXISTS idx_form_fields_form
  ON form_fields (form_id, sort_order ASC);


CREATE TABLE IF NOT EXISTS form_responses (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- FK to forms table
  form_id       UUID NOT NULL REFERENCES forms(id) ON DELETE CASCADE,

  -- Respondent: references user by Sanity _id (NULL if anonymous)
  respondent_id TEXT,

  -- All field answers as JSON: { "field_id": "answer_value", ... }
  answers       JSONB NOT NULL DEFAULT '{}',

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listing responses per form
CREATE INDEX IF NOT EXISTS idx_form_responses_form
  ON form_responses (form_id, created_at DESC);

-- Index for checking if a user already responded
CREATE INDEX IF NOT EXISTS idx_form_responses_respondent
  ON form_responses (form_id, respondent_id);
