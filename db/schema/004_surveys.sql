-- ============================================================
-- 004: Surveys, Questions, and Responses
-- Mirrors: sanity/schemas/surveys/survey.js
--          (survey, surveyQuestion, surveyResponse, surveyAnswer)
-- ============================================================

CREATE TABLE IF NOT EXISTS surveys (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Creator: references user by Sanity _id
  created_by    TEXT NOT NULL,

  title         TEXT NOT NULL,
  description   TEXT,

  -- Settings JSON: { allowAnonymous, requireAuth, limitResponses, expiresAt }
  settings      JSONB DEFAULT '{}',

  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS survey_questions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- FK to surveys table
  survey_id     UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

  -- Question type: "text", "textarea", "number", "email",
  --   "multipleChoice", "dropdown", "date", "time", "datetime", "file"
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

-- Index for fetching questions of a survey in order
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey
  ON survey_questions (survey_id, sort_order ASC);


CREATE TABLE IF NOT EXISTS survey_responses (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- FK to surveys table
  survey_id         UUID NOT NULL REFERENCES surveys(id) ON DELETE CASCADE,

  -- Respondent: references user by Sanity _id (NULL if anonymous)
  respondent_id     TEXT,

  respondent_name   TEXT,
  respondent_email  TEXT,

  -- Metadata JSON: { userAgent }
  metadata          JSONB DEFAULT '{}',

  submitted_at      TIMESTAMPTZ DEFAULT NOW(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listing responses per survey
CREATE INDEX IF NOT EXISTS idx_survey_responses_survey
  ON survey_responses (survey_id, created_at DESC);


CREATE TABLE IF NOT EXISTS survey_answers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- FK to survey_responses table
  response_id       UUID NOT NULL REFERENCES survey_responses(id) ON DELETE CASCADE,

  -- The question key (Sanity _key or UUID from survey_questions)
  question_key      TEXT NOT NULL,

  question_label    TEXT,
  question_type     TEXT,

  -- Single value answer
  value             TEXT,

  -- Multi-value answer (for multipleChoice)
  values            JSONB DEFAULT '[]',

  -- File URL (for file uploads, stored in Supabase Storage)
  file_url          TEXT
);

-- Index for fetching answers of a response
CREATE INDEX IF NOT EXISTS idx_survey_answers_response
  ON survey_answers (response_id);
