import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * PostgreSQL (Supabase) Surveys Repository
 * Used when USE_PG_SURVEYS=true.
 */

function mapSurvey(row) {
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    createdBy: { _id: row.created_by },
    settings: row.settings || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getSurveysByUser(userId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("surveys")
    .select("*")
    .eq("created_by", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapSurvey);
}

export async function getSurveyByIdForUser(id, userId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("surveys")
    .select("*, survey_questions(*)")
    .eq("id", id)
    .eq("created_by", userId)
    .single();
  if (error) throw error;
  if (!data) return null;
  const survey = mapSurvey(data);
  survey.questions = (data.survey_questions || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((q) => ({
      _key: q.id,
      type: q.type,
      label: q.label,
      placeholder: q.placeholder,
      required: q.required,
      options: q.options,
      fileType: q.file_type,
      validation: q.validation,
      order: q.sort_order,
    }));
  return survey;
}

export async function createSurvey(doc) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("surveys")
    .insert({
      created_by: doc.createdBy?._ref || doc.created_by,
      title: doc.title,
      description: doc.description,
      settings: doc.settings || {},
    })
    .select()
    .single();
  if (error) throw error;
  return mapSurvey(data);
}

export async function updateSurvey(id, updates) {
  const supabase = getSupabaseServer();
  const pgUpdates = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) pgUpdates.title = updates.title;
  if (updates.description !== undefined) pgUpdates.description = updates.description;
  if (updates.settings !== undefined) pgUpdates.settings = updates.settings;

  const { data, error } = await supabase
    .from("surveys")
    .update(pgUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapSurvey(data);
}

export async function deleteSurvey(id) {
  const supabase = getSupabaseServer();
  // Cascading delete handles survey_questions and survey_responses
  const { error } = await supabase.from("surveys").delete().eq("id", id);
  if (error) throw error;
}

export async function getResponseIdsForSurvey(surveyId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("survey_responses")
    .select("id")
    .eq("survey_id", surveyId);
  if (error) throw error;
  return (data || []).map((r) => r.id);
}

export async function deleteResponsesBatch(ids) {
  if (!ids || ids.length === 0) return;
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("survey_responses")
    .delete()
    .in("id", ids);
  if (error) throw error;
}

export async function getUserByClerkId(clerkId) {
  // Users always stay in Sanity
  const { client: sanityClient } = await import("@/sanity/client");
  const { userProfileQueries } = await import("@/sanity/queries");
  return sanityClient.fetch(userProfileQueries.getByClerkId, { clerkId });
}
