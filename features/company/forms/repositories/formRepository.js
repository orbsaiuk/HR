import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * PostgreSQL (Supabase) Forms Repository
 * Used when USE_PG_FORMS=true.
 */

function mapForm(row) {
  return {
    _id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    createdBy: { _id: row.created_by },
    organization: row.org_id ? { _id: row.org_id } : undefined,
    settings: row.settings || {},
    assignedTo: (row.assigned_to || []).map((id) => ({ _id: id })),
    publishedAt: row.published_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getFormsByOrg(orgId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("org_id", orgId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapForm);
}

export async function getFormsAssignedToUser(orgId, userId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("org_id", orgId)
    .or(`created_by.eq.${userId},assigned_to.cs.["${userId}"]`)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapForm);
}

export async function getFormsByTeamMember(orgId, userId) {
  return getFormsAssignedToUser(orgId, userId);
}

export async function getFormById(id) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("forms")
    .select("*, form_fields(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  if (!data) return null;
  const form = mapForm(data);
  form.fields = (data.form_fields || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((f) => ({
      _key: f.id,
      type: f.type,
      label: f.label,
      placeholder: f.placeholder,
      required: f.required,
      options: f.options,
      fileType: f.file_type,
      validation: f.validation,
      order: f.sort_order,
    }));
  return form;
}

export async function createForm(doc) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("forms")
    .insert({
      created_by: doc.createdBy?._ref || doc.created_by,
      org_id: doc.organization?._ref || doc.org_id,
      title: doc.title,
      description: doc.description,
      status: doc.status || "draft",
      settings: doc.settings || {},
      assigned_to: doc.assigned_to || [],
    })
    .select()
    .single();
  if (error) throw error;
  return mapForm(data);
}

export async function updateForm(id, updates) {
  const supabase = getSupabaseServer();
  const pgUpdates = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) pgUpdates.title = updates.title;
  if (updates.description !== undefined) pgUpdates.description = updates.description;
  if (updates.status !== undefined) pgUpdates.status = updates.status;
  if (updates.settings !== undefined) pgUpdates.settings = updates.settings;
  if (updates.publishedAt !== undefined) pgUpdates.published_at = updates.publishedAt;

  const { data, error } = await supabase
    .from("forms")
    .update(pgUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapForm(data);
}

export async function deleteForm(id) {
  const supabase = getSupabaseServer();
  const { error } = await supabase.from("forms").delete().eq("id", id);
  if (error) throw error;
}

export async function getPublishedFormsByUser(userId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("forms")
    .select("*")
    .eq("created_by", userId)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapForm);
}

export async function getFormFields(formId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("form_fields")
    .select("*")
    .eq("form_id", formId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data || []).map((f) => ({
    _key: f.id,
    type: f.type,
    label: f.label,
    placeholder: f.placeholder,
    required: f.required,
    options: f.options,
    fileType: f.file_type,
    validation: f.validation,
    order: f.sort_order,
  }));
}

export async function getResponsesByFormId(formId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("form_responses")
    .select("*")
    .eq("form_id", formId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function checkUserResponse(formId, userId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("form_responses")
    .select("id")
    .eq("form_id", formId)
    .eq("respondent_id", userId)
    .maybeSingle();
  if (error) throw error;
  return data || null;
}

export async function getUserByClerkId(clerkId) {
  // User lookups always go through Sanity (users stay in Sanity)
  const { client: sanityClient } = await import("@/sanity/client");
  const { userProfileQueries } = await import("@/sanity/queries");
  return sanityClient.fetch(userProfileQueries.getByClerkId, { clerkId });
}
