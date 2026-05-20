-- 012_projects_add_location_category.sql
-- Add location and category columns to projects table

ALTER TABLE projects ADD COLUMN IF NOT EXISTS location VARCHAR;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS category VARCHAR;
