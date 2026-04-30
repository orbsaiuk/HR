import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * PostgreSQL (Supabase) Applications Repository
 * Used when USE_PG_RECRUITMENT=true.
 */

function mapApplication(row) {
  return {
    _id: row.id,
    jobPosition: row.job_positions ? {
      _id: row.job_positions.id,
      title: row.job_positions.title,
      department: row.job_positions.department,
      location: row.job_positions.location,
      description: row.job_positions.description,
    } : { _id: row.job_position_id },
    organization: row.org_id ? { _id: row.org_id } : undefined,
    applicant: { _id: row.applicant_id },
    form: row.form_id ? { _id: row.form_id } : undefined,
    status: row.status,
    notes: row.notes,
    rating: row.rating,
    rejectionReason: row.rejection_reason,
    answers: row.answers || [],
    profileSnapshot: row.profile_snapshot || {},
    appliedAt: row.applied_at,
    updatedAt: row.updated_at,
  };
}

export async function getApplicationsByOrg(orgId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("applications")
    .select("*, job_positions(*)")
    .eq("org_id", orgId)
    .order("applied_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapApplication);
}

export async function getApplicationsByTeamMember(orgId, teamMemberId) {
  return getApplicationsByOrg(orgId);
}

export async function getApplicationsByPosition(positionId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("applications")
    .select("*, job_positions(*)")
    .eq("job_position_id", positionId)
    .order("applied_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapApplication);
}

export async function getApplicationsByUser(userId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("applications")
    .select("*, job_positions(*)")
    .eq("applicant_id", userId)
    .order("applied_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapApplication);
}

export async function getApplicationById(id) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("applications")
    .select("*, job_positions(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ? mapApplication(data) : null;
}

export async function getApplicationByIdForUser(id, userId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("applications")
    .select("*, job_positions(*)")
    .eq("id", id)
    .eq("applicant_id", userId)
    .single();
  if (error) throw error;
  return data ? mapApplication(data) : null;
}

export async function getApplicationStats(orgId) {
  const supabase = getSupabaseServer();

  const statuses = ["new", "screening", "interview", "offered", "hired", "rejected"];
  const result = { total: 0 };

  for (const status of statuses) {
    const { count, error } = await supabase
      .from("applications")
      .select("*", { count: "exact", head: true })
      .eq("org_id", orgId)
      .eq("status", status);
    if (error) throw error;
    result[status] = count || 0;
    result.total += count || 0;
  }

  return result;
}

export async function updateApplication(id, updates) {
  const supabase = getSupabaseServer();
  const pgUpdates = { updated_at: new Date().toISOString() };
  if (updates.status !== undefined) pgUpdates.status = updates.status;
  if (updates.notes !== undefined) pgUpdates.notes = updates.notes;
  if (updates.rating !== undefined) pgUpdates.rating = updates.rating;
  if (updates.rejectionReason !== undefined) pgUpdates.rejection_reason = updates.rejectionReason;

  const { data, error } = await supabase
    .from("applications")
    .update(pgUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapApplication(data);
}

export async function checkDuplicate(positionId, userId) {
  const supabase = getSupabaseServer();
  const { count, error } = await supabase
    .from("applications")
    .select("*", { count: "exact", head: true })
    .eq("job_position_id", positionId)
    .eq("applicant_id", userId);
  if (error) throw error;
  return count || 0;
}

export async function createApplication(doc) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("applications")
    .insert({
      job_position_id: doc.jobPosition?._ref || doc.job_position_id,
      org_id: doc.organization?._ref || doc.org_id || null,
      applicant_id: doc.applicant?._ref || doc.applicant_id,
      form_id: doc.form?._ref || doc.form_id || null,
      status: "new",
      answers: doc.answers || [],
      profile_snapshot: doc.profileSnapshot || {},
    })
    .select()
    .single();
  if (error) throw error;
  return mapApplication(data);
}
