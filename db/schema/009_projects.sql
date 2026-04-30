-- 009_projects.sql

CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    short_description TEXT,
    description TEXT,
    project_type VARCHAR,
    industry VARCHAR,
    status VARCHAR DEFAULT 'open',
    technologies JSONB DEFAULT '[]',
    budget_min INTEGER,
    budget_max INTEGER,
    currency VARCHAR DEFAULT 'USD',
    duration JSONB,
    experience_level VARCHAR,
    team_size VARCHAR,
    requirements JSONB DEFAULT '[]',
    deliverables JSONB DEFAULT '[]',
    featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_org ON projects(org_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

CREATE TABLE IF NOT EXISTS project_proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    freelancer_id VARCHAR NOT NULL,
    cover_letter TEXT,
    proposed_budget INTEGER,
    status VARCHAR DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, freelancer_id)
);

CREATE INDEX IF NOT EXISTS idx_proposals_project ON project_proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer ON project_proposals(freelancer_id);
