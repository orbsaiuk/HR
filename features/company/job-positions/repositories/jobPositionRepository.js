import { getSupabaseServer } from "@/lib/supabase/server";

function mapJobPosition(row) {
  let computedStatus = row.status;
  
  if (row.status === "open" && row.deadline) {
    const deadlineDate = new Date(row.deadline);
    const today = new Date();
    // Reset time portion to compare dates
    today.setHours(0, 0, 0, 0);
    deadlineDate.setHours(0, 0, 0, 0);
    
    if (!isNaN(deadlineDate.getTime()) && deadlineDate < today) {
      computedStatus = "closed";
    }
  }

  return {
    _id: row.id,
    title: row.title,
    department: row.department,
    description: row.description,
    requirements: row.requirements,
    location: row.location,
    type: row.type,
    seniority: row.seniority,
    salaryMin: row.salary_min,
    salaryMax: row.salary_max,
    currency: row.currency,
    status: computedStatus,
    deadline: row.deadline,
    isUrgent: row.is_urgent,
    applicationMethod: row.application_method,
    form: row.form_id ? { _id: row.form_id } : undefined,
    recruiter: { _id: row.recruiter_id },
    organization: { _id: row.org_id },
    assignedTo: (row.assigned_to || []).map((id) => ({ _id: id })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getJobPositionsByOrg(orgId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("job_positions")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapJobPosition);
}

export async function getJobPositionsAssignedToUser(orgId, userId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("job_positions")
    .select("*")
    .eq("org_id", orgId)
    .or(`recruiter_id.eq.${userId},assigned_to.cs.{"${userId}"}`)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapJobPosition);
}

export async function getJobPositionById(id) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("job_positions")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data ? mapJobPosition(data) : null;
}

export async function getJobPositionStats(orgId) {
  const positions = await getJobPositionsByOrg(orgId);
  const result = { total: positions.length, open: 0, "on-hold": 0, closed: 0 };

  for (const position of positions) {
    if (result[position.status] !== undefined) {
      result[position.status]++;
    }
  }

  return result;
}

export async function createJobPosition(doc) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("job_positions")
    .insert({
      org_id: doc.organization?._ref || doc.org_id,
      recruiter_id: doc.recruiter?._ref || doc.recruiter_id,
      title: doc.title,
      department: doc.department,
      description: doc.description,
      requirements: doc.requirements,
      location: doc.location,
      type: doc.type,
      seniority: doc.seniority,
      salary_min: doc.salaryMin,
      salary_max: doc.salaryMax,
      currency: doc.currency,
      status: doc.status || "open",
      deadline: doc.deadline,
      is_urgent: doc.isUrgent || false,
      application_method: doc.applicationMethod || "form",
      form_id: doc.form?._ref || doc.form_id || null,
      assigned_to: doc.assignedTo?.map(a => a._ref) || [],
    })
    .select()
    .single();
  if (error) throw error;
  return mapJobPosition(data);
}

export async function updateJobPosition(id, updates) {
  const supabase = getSupabaseServer();
  const pgUpdates = { updated_at: new Date().toISOString() };
  
  if (updates.title !== undefined) pgUpdates.title = updates.title;
  if (updates.department !== undefined) pgUpdates.department = updates.department;
  if (updates.description !== undefined) pgUpdates.description = updates.description;
  if (updates.requirements !== undefined) pgUpdates.requirements = updates.requirements;
  if (updates.location !== undefined) pgUpdates.location = updates.location;
  if (updates.type !== undefined) pgUpdates.type = updates.type;
  if (updates.seniority !== undefined) pgUpdates.seniority = updates.seniority;
  if (updates.salaryMin !== undefined) pgUpdates.salary_min = updates.salaryMin;
  if (updates.salaryMax !== undefined) pgUpdates.salary_max = updates.salaryMax;
  if (updates.currency !== undefined) pgUpdates.currency = updates.currency;
  if (updates.status !== undefined) pgUpdates.status = updates.status;
  if (updates.deadline !== undefined) pgUpdates.deadline = updates.deadline;
  if (updates.isUrgent !== undefined) pgUpdates.is_urgent = updates.isUrgent;
  if (updates.applicationMethod !== undefined) pgUpdates.application_method = updates.applicationMethod;
  
  if (updates.formId !== undefined) {
    pgUpdates.form_id = updates.formId || null;
  } else if (updates.form !== undefined) {
    pgUpdates.form_id = updates.form?._ref || null;
  }

  if (updates.assignedTo !== undefined) {
    pgUpdates.assigned_to = updates.assignedTo.map(a => a._ref || a);
  }

  const { data, error } = await supabase
    .from("job_positions")
    .update(pgUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapJobPosition(data);
}

export async function deleteJobPosition(id) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("job_positions").delete().eq("id", id);
  if (error) throw error;
}

export async function updateJobPositionStatus(id, status) {
  return updateJobPosition(id, { status });
}
