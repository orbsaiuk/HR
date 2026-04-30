import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * PostgreSQL (Supabase) Scorecards Repository
 * Used when USE_PG_RECRUITMENT=true.
 */

function mapScorecard(row) {
  return {
    _id: row.id,
    application: { _id: row.application_id },
    evaluator: { _id: row.evaluator_id },
    organization: row.org_id ? { _id: row.org_id } : undefined,
    criteria: row.criteria || [],
    overallScore: row.overall_score,
    recommendation: row.recommendation,
    summary: row.summary,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getScorecardsByApplication(applicationId, orgId) {
  const supabase = getSupabaseServer();
  let query = supabase
    .from("evaluation_scorecards")
    .select("*")
    .eq("application_id", applicationId);
  if (orgId) query = query.eq("org_id", orgId);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapScorecard);
}

export async function getScorecardById(id) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("evaluation_scorecards")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ? mapScorecard(data) : null;
}

export async function getScorecardByEvaluatorAndApplication(evaluatorId, applicationId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("evaluation_scorecards")
    .select("*")
    .eq("evaluator_id", evaluatorId)
    .eq("application_id", applicationId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapScorecard(data) : null;
}

export async function getScorecardSummary(applicationId, orgId) {
  const scorecards = await getScorecardsByApplication(applicationId, orgId);
  if (!scorecards || scorecards.length === 0) return null;

  const totalScore = scorecards.reduce((sum, s) => sum + (s.overallScore || 0), 0);
  return {
    averageScore: totalScore / scorecards.length,
    count: scorecards.length,
    scorecards,
  };
}

export async function createScorecard(doc) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("evaluation_scorecards")
    .insert({
      application_id: doc.application?._ref || doc.application_id,
      evaluator_id: doc.evaluator?._ref || doc.evaluator_id,
      org_id: doc.organization?._ref || doc.org_id || null,
      criteria: doc.criteria || [],
      overall_score: doc.overallScore,
      recommendation: doc.recommendation,
      summary: doc.summary,
    })
    .select()
    .single();
  if (error) throw error;
  return mapScorecard(data);
}

export async function updateScorecard(id, updates) {
  const supabase = getSupabaseServer();
  const pgUpdates = { updated_at: new Date().toISOString() };
  if (updates.criteria !== undefined) pgUpdates.criteria = updates.criteria;
  if (updates.overallScore !== undefined) pgUpdates.overall_score = updates.overallScore;
  if (updates.recommendation !== undefined) pgUpdates.recommendation = updates.recommendation;
  if (updates.summary !== undefined) pgUpdates.summary = updates.summary;

  const { data, error } = await supabase
    .from("evaluation_scorecards")
    .update(pgUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapScorecard(data);
}

export async function deleteScorecard(id) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("evaluation_scorecards").delete().eq("id", id);
  if (error) throw error;
}
