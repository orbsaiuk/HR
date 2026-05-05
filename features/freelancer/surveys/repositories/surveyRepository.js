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
    .select(`
      *,
      survey_questions(count),
      survey_responses(count)
    `)
    .eq("created_by", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(row => {
    const s = mapSurvey(row);
    s.questionCount = row.survey_questions?.[0]?.count || 0;
    s.responseCount = row.survey_responses?.[0]?.count || 0;
    return s;
  });
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

  if (doc.questions && doc.questions.length > 0) {
    const questionsToInsert = doc.questions.map((q, index) => ({
      survey_id: data.id,
      type: q.type,
      label: q.label,
      placeholder: q.placeholder,
      required: q.required || false,
      options: q.options || [],
      file_type: q.fileType || 'any',
      validation: q.validation || {},
      sort_order: q.order !== undefined ? q.order : index,
    }));
    const { error: questionsError } = await supabase
      .from("survey_questions")
      .insert(questionsToInsert);
    if (questionsError) throw questionsError;
  }

  return getSurveyByIdForUser(data.id, data.created_by);
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

  if (updates.questions) {
    const questionsToUpsert = updates.questions.map((q, index) => {
      const row = {
        survey_id: id,
        type: q.type,
        label: q.label,
        placeholder: q.placeholder,
        required: q.required || false,
        options: q.options || [],
        file_type: q.fileType || 'any',
        validation: q.validation || {},
        sort_order: q.order !== undefined ? q.order : index,
      };
      if (q._key && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(q._key)) {
        row.id = q._key;
      }
      return row;
    });

    const { data: existingQuestions } = await supabase
      .from("survey_questions")
      .select("id")
      .eq("survey_id", id);
      
    const keepIds = questionsToUpsert.map(q => q.id).filter(Boolean);
    const toDelete = (existingQuestions || [])
      .map(eq => eq.id)
      .filter(eqId => !keepIds.includes(eqId));

    if (toDelete.length > 0) {
      await supabase.from("survey_questions").delete().in("id", toDelete);
    }
    
    if (questionsToUpsert.length > 0) {
      const { error: upsertError } = await supabase
        .from("survey_questions")
        .upsert(questionsToUpsert);
      if (upsertError) throw upsertError;
    }
  }

  return getSurveyByIdForUser(id, data.created_by);
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

