import { getSupabaseServer } from "@/lib/supabase/server";

function mapTemplate(row) {
  return {
    _id: row.id,
    id: row.id,
    organization: { _id: row.org_id },
    createdBy: { _id: row.created_by },
    title: row.title,
    description: row.description,
    type: row.type,
    category: row.category,
    clauses: row.clauses || [],
    isActive: row.is_active,
    usageCount: row.usage_count,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getContractTemplates(orgId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("contract_templates")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapTemplate);
}

export async function getContractTemplateById(id) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("contract_templates")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapTemplate(data) : null;
}

export async function createContractTemplate(doc) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("contract_templates")
    .insert({
      org_id: doc.organization?._ref || doc.org_id,
      created_by: doc.createdBy?._ref || doc.created_by,
      title: doc.title,
      description: doc.description || "",
      type: doc.type,
      category: doc.category || "",
      clauses: doc.clauses || [],
      is_active: doc.isActive !== false,
      usage_count: doc.usageCount || 0,
    })
    .select()
    .single();
  if (error) throw error;
  return mapTemplate(data);
}

export async function updateContractTemplate(id, updates) {
  const supabase = getSupabaseServer();
  const pgUpdates = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) pgUpdates.title = updates.title;
  if (updates.description !== undefined) pgUpdates.description = updates.description;
  if (updates.type !== undefined) pgUpdates.type = updates.type;
  if (updates.category !== undefined) pgUpdates.category = updates.category;
  if (updates.clauses !== undefined) pgUpdates.clauses = updates.clauses;
  if (updates.isActive !== undefined) pgUpdates.is_active = updates.isActive;
  if (updates.usageCount !== undefined) pgUpdates.usage_count = updates.usageCount;

  const { data, error } = await supabase
    .from("contract_templates")
    .update(pgUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapTemplate(data);
}

export async function deleteContractTemplate(id) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("contract_templates")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function incrementTemplateUsage(id) {
  const supabase = getSupabaseServer();
  // Call an RPC if we had one, but we can also just fetch and update.
  // Given we are avoiding RPCs unless necessary, we'll fetch and increment.
  const { data: current, error: fetchError } = await supabase.from("contract_templates").select("usage_count").eq("id", id).maybeSingle();
  if (!fetchError && current) {
    const currentCount = current.usage_count == null ? 0 : current.usage_count;
    await supabase.from("contract_templates").update({ usage_count: currentCount + 1 }).eq("id", id);
  }
}
