import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * PostgreSQL (Supabase) Contracts Repository
 * Used when USE_PG_CONTRACTS=true.
 */

function mapContract(row) {
  return {
    _id: row.id,
    id: row.id,
    organization: { _id: row.org_id },
    createdBy: { _id: row.created_by },
    templateId: row.template_id,
    title: row.title,
    description: row.description,
    type: row.type,
    category: row.category,
    status: row.status,
    formData: row.form_data || {},
    clauses: row.clauses || [],
    whatsapp: row.whatsapp || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getContractsByCreator(orgId, userId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("org_id", orgId)
    .eq("created_by", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapContract);
}

export async function getContractByIdScoped(id, orgId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .eq("org_id", orgId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapContract(data) : null;
}

export async function createContract(doc) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("contracts")
    .insert({
      org_id: doc.organization?._ref || doc.org_id,
      created_by: doc.createdBy?._ref || doc.created_by,
      template_id: doc.templateId || null,
      title: doc.title,
      description: doc.description,
      type: doc.type,
      category: doc.category,
      status: doc.status || "created",
      form_data: doc.formData || {},
      clauses: doc.clauses || [],
      whatsapp: doc.whatsapp || { sendCount: 0 },
    })
    .select()
    .single();
  if (error) throw error;
  return mapContract(data);
}

export async function updateContract(id, updates) {
  const supabase = getSupabaseServer();
  const pgUpdates = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) pgUpdates.title = updates.title;
  if (updates.status !== undefined) pgUpdates.status = updates.status;
  if (updates.formData !== undefined) pgUpdates.form_data = updates.formData;
  if (updates.clauses !== undefined) pgUpdates.clauses = updates.clauses;

  const { data, error } = await supabase
    .from("contracts")
    .update(pgUpdates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return mapContract(data);
}

export async function patchContractSent(id) {
  const supabase = getSupabaseServer();

  // Fetch current whatsapp metadata
  const { data: current } = await supabase
    .from("contracts")
    .select("whatsapp")
    .eq("id", id)
    .maybeSingle();

  const now = new Date().toISOString();
  const currentWhatsapp = current?.whatsapp || {};
  const { data, error } = await supabase
    .from("contracts")
    .update({
      status: "sent",
      whatsapp: {
        ...currentWhatsapp,
        lastSentAt: now,
        sendCount: (currentWhatsapp.sendCount || 0) + 1,
      },
      updated_at: now,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  if (error) throw error;
  return mapContract(data);
}

export async function getContractsByFreelancerClerkId(clerkId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("form_data->>secondPartyUserId", clerkId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(mapContract);
}

export async function getContractByIdForFreelancer(id, clerkId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("contracts")
    .select("*")
    .eq("id", id)
    .eq("form_data->>secondPartyUserId", clerkId)
    .maybeSingle();
  if (error) throw error;
  return data ? mapContract(data) : null;
}

export async function updateContractFreelancerStatusRepo(id, clerkId, status) {
  const supabase = getSupabaseServer();
  const pgUpdates = {
    status,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("contracts")
    .update(pgUpdates)
    .eq("id", id)
    .eq("form_data->>secondPartyUserId", clerkId)
    .select()
    .maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Contract not found or not authorized");
  return mapContract(data);
}
