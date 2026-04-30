-- 007_job_positions.sql

CREATE TABLE IF NOT EXISTS job_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id VARCHAR NOT NULL,
    recruiter_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    department VARCHAR,
    description TEXT,
    requirements TEXT,
    location VARCHAR,
    type VARCHAR DEFAULT 'full-time',
    seniority VARCHAR DEFAULT 'mid',
    salary_min NUMERIC,
    salary_max NUMERIC,
    currency VARCHAR DEFAULT 'USD',
    status VARCHAR DEFAULT 'draft',
    deadline TIMESTAMP WITH TIME ZONE,
    is_urgent BOOLEAN DEFAULT false,
    application_method VARCHAR DEFAULT 'form',
    form_id UUID REFERENCES forms(id) ON DELETE SET NULL,
    assigned_to VARCHAR[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying positions by organization
CREATE INDEX IF NOT EXISTS idx_job_positions_org ON job_positions(org_id);

-- Update the applications table to use UUIDs for job positions instead of sanity strings
ALTER TABLE applications ADD COLUMN job_position_id UUID REFERENCES job_positions(id) ON DELETE CASCADE;

-- Note: In a fresh start we can safely drop the old column.
ALTER TABLE applications DROP COLUMN sanity_position_id;
