-- ============================================================
-- 011: Dashboard Functions
-- Functions for aggregating dashboard statistics
-- ============================================================

-- Function to group applications by day for a given organization
CREATE OR REPLACE FUNCTION get_application_stats_by_day(
  p_org_id TEXT,
  p_days_limit INT DEFAULT 7
)
RETURNS TABLE (
  apply_date DATE,
  applications_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE(applied_at) as apply_date,
    COUNT(id) as applications_count
  FROM applications
  WHERE org_id = p_org_id
    AND applied_at >= NOW() - (p_days_limit || ' days')::interval
  GROUP BY DATE(applied_at)
  ORDER BY DATE(applied_at) ASC;
END;
$$;

-- Function to group applications by week for a given organization
CREATE OR REPLACE FUNCTION get_application_stats_by_week(
  p_org_id TEXT,
  p_weeks_limit INT DEFAULT 4
)
RETURNS TABLE (
  week_start DATE,
  applications_count BIGINT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    DATE_TRUNC('week', applied_at)::DATE as week_start,
    COUNT(id) as applications_count
  FROM applications
  WHERE org_id = p_org_id
    AND applied_at >= NOW() - (p_weeks_limit || ' weeks')::interval
  GROUP BY DATE_TRUNC('week', applied_at)
  ORDER BY week_start ASC;
END;
$$;
