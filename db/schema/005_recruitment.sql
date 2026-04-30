-- ============================================================
-- 005: Recruitment (Applications + Evaluation Scorecards)
-- Mirrors: sanity/schemas/recruitment/application.js
--          sanity/schemas/recruitment/evaluationScorecard.js
--
-- Note: jobPosition stays in Sanity (content/SEO).
--       We reference it via sanity_position_id (string).
-- ============================================================

CREATE TABLE IF NOT EXISTS applications (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- References jobPosition in Sanity by _id
  sanity_position_id  TEXT NOT NULL,

  -- Organization: references org by Sanity _id
  org_id              TEXT,

  -- Applicant: references user by Sanity _id
  applicant_id        TEXT NOT NULL,

  -- Application form reference (Sanity _id or PG UUID)
  form_id             TEXT,

  -- Status: "new", "screening", "interview", "offered", "hired", "rejected"
  status              TEXT NOT NULL DEFAULT 'new',

  notes               TEXT,
  rating              SMALLINT CHECK (rating >= 0 AND rating <= 5),
  rejection_reason    TEXT,

  -- Form answers JSON: [{ fieldId, fieldType, fieldLabel, value, fileUrl }]
  answers             JSONB DEFAULT '[]',

  -- Snapshot of applicant profile at time of application
  profile_snapshot    JSONB DEFAULT '{}',

  applied_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listing applications by position
CREATE INDEX IF NOT EXISTS idx_applications_position
  ON applications (sanity_position_id, applied_at DESC);

-- Index for listing applications by org
CREATE INDEX IF NOT EXISTS idx_applications_org
  ON applications (org_id, applied_at DESC);

-- Index for filtering by status within an org
CREATE INDEX IF NOT EXISTS idx_applications_org_status
  ON applications (org_id, status);

-- Index for applicant's own applications
CREATE INDEX IF NOT EXISTS idx_applications_applicant
  ON applications (applicant_id, applied_at DESC);

-- Unique constraint: one application per user per position
CREATE UNIQUE INDEX IF NOT EXISTS idx_applications_unique
  ON applications (sanity_position_id, applicant_id);


CREATE TABLE IF NOT EXISTS evaluation_scorecards (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- FK to applications table
  application_id    UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,

  -- Evaluator: references user by Sanity _id
  evaluator_id      TEXT NOT NULL,

  -- Organization: references org by Sanity _id
  org_id            TEXT,

  -- Criteria JSON: [{ name, score (1-5), comment }]
  criteria          JSONB NOT NULL DEFAULT '[]',

  -- Overall score (1-5), auto-calculated or overridden
  overall_score     NUMERIC(3,2) CHECK (overall_score >= 1 AND overall_score <= 5),

  -- Recommendation: "strong-hire", "hire", "no-hire", "strong-no-hire"
  recommendation    TEXT,

  summary           TEXT,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ
);

-- Index for fetching scorecards per application
CREATE INDEX IF NOT EXISTS idx_scorecards_application
  ON evaluation_scorecards (application_id);

-- Unique constraint: one scorecard per evaluator per application
CREATE UNIQUE INDEX IF NOT EXISTS idx_scorecards_unique
  ON evaluation_scorecards (application_id, evaluator_id);
