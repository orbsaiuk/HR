import { getSupabaseServer } from "@/lib/supabase/server";
import { getFreelancerUserDoc } from "./surveyService";

export async function getSurveyResponsesForOwner(clerkId, surveyId) {
  const userDoc = await getFreelancerUserDoc(clerkId);
  const supabase = getSupabaseServer();
  
  // Verify survey belongs to user
  const { data: survey, error: surveyError } = await supabase
    .from("surveys")
    .select("id")
    .eq("id", surveyId)
    .eq("created_by", userDoc._id)
    .single();
    
  if (surveyError || !survey) throw new Error("Survey not found or unauthorized");

  const { data, error } = await supabase
    .from("survey_responses")
    .select("*")
    .eq("survey_id", surveyId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function getSurveyResponseByIdForOwner(clerkId, responseId) {
  const userDoc = await getFreelancerUserDoc(clerkId);
  const supabase = getSupabaseServer();
  
  const { data: response, error } = await supabase
    .from("survey_responses")
    .select("*, surveys!inner(created_by)")
    .eq("id", responseId)
    .single();

  if (error || !response) return null;
  if (response.surveys.created_by !== userDoc._id) return null;

  return response;
}

export async function deleteSurveyResponse(clerkId, responseId) {
  const existing = await getSurveyResponseByIdForOwner(clerkId, responseId);
  if (!existing) throw new Error("Survey response not found");
  
  const supabase = getSupabaseServer();
  await supabase.from("survey_responses").delete().eq("id", responseId);
}
