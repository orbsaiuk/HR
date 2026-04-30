import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * PostgreSQL (Supabase) Audit Log Repository
 *
 * All direct Supabase queries for audit logs are encapsulated here.
 * This file is used when USE_PG_AUDIT=true.
 *
 * Returns data in the same shape as the Sanity repository so the
 * service layer doesn't need to know which backend is active.
 */

/**
 * Map a PG row to the same shape returned by Sanity GROQ projections.
 */
function mapRowToLog(row) {
  return {
    _id: row.id,
    action: row.action,
    category: row.category,
    description: row.description,
    actor: row.actor_name
      ? { _id: row.actor_id, name: row.actor_name, email: row.actor_email, avatar: row.actor_avatar }
      : { _id: row.actor_id },
    targetType: row.target_type,
    targetId: row.target_id,
    metadata: row.metadata,
    createdAt: row.created_at,
  };
}

export async function createLog({
  action,
  category,
  description,
  actorId,
  orgId,
  targetType,
  targetId,
  metadata,
}) {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("audit_logs")
    .insert({
      action,
      category,
      description,
      actor_id: actorId,
      org_id: orgId,
      target_type: targetType || null,
      target_id: targetId || null,
      metadata: metadata || {},
    })
    .select()
    .single();

  if (error) throw error;
  return mapRowToLog(data);
}

/**
 * Fetch paginated audit logs with dynamic filters.
 * The service layer passes pre-built query/params for Sanity,
 * but for PG we receive a structured filters object instead.
 */
export async function fetchLogs(orgId, { filters = {}, offset = 0, limit = 25 }) {
  const supabase = getSupabaseServer();

  let query = supabase
    .from("audit_logs")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.actorId) {
    query = query.eq("actor_id", filters.actorId);
  }
  if (filters.startDate) {
    query = query.gte("created_at", filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte("created_at", filters.endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(mapRowToLog);
}

/**
 * Count audit logs matching filters.
 */
export async function countLogs(orgId, { filters = {} }) {
  const supabase = getSupabaseServer();

  let query = supabase
    .from("audit_logs")
    .select("*", { count: "exact", head: true })
    .eq("org_id", orgId);

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.startDate) {
    query = query.gte("created_at", filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte("created_at", filters.endDate);
  }

  const { count, error } = await query;
  if (error) throw error;

  return count || 0;
}

/**
 * Fetch all audit logs matching filters (no pagination, for export).
 */
export async function fetchAllLogs(orgId, { filters = {} }) {
  const supabase = getSupabaseServer();

  let query = supabase
    .from("audit_logs")
    .select("*")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });

  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.startDate) {
    query = query.gte("created_at", filters.startDate);
  }
  if (filters.endDate) {
    query = query.lte("created_at", filters.endDate);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data || []).map(mapRowToLog);
}

/**
 * Delete audit logs older than a cutoff date.
 */
export async function deleteLogsBefore(orgId, cutoffDate) {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("audit_logs")
    .delete()
    .eq("org_id", orgId)
    .lt("created_at", cutoffDate.toISOString())
    .select("id");

  if (error) throw error;
  return data?.length || 0;
}
