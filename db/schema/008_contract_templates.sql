-- 008_contract_templates.sql

CREATE TABLE IF NOT EXISTS contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id VARCHAR NOT NULL,
    created_by VARCHAR NOT NULL,
    title VARCHAR NOT NULL,
    description TEXT,
    type VARCHAR NOT NULL,
    category VARCHAR,
    clauses JSONB NOT NULL DEFAULT '[]',
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying templates by organization
CREATE INDEX IF NOT EXISTS idx_contract_templates_org ON contract_templates(org_id);

-- Update the contracts table to safely add template references
ALTER TABLE contracts ADD COLUMN IF NOT EXISTS template_id UUID;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'contracts_template_id_fkey'
        AND table_name = 'contracts'
    ) THEN
        ALTER TABLE contracts ADD CONSTRAINT contracts_template_id_fkey FOREIGN KEY (template_id) REFERENCES contract_templates(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Index for querying contracts by freelancer user id
CREATE INDEX IF NOT EXISTS idx_contracts_freelancer_id ON contracts ((form_data->>'secondPartyUserId'));
