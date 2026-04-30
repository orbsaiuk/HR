import { getSupabaseServer } from "@/lib/supabase/server";

/**
 * PostgreSQL (Supabase) Messaging Repository
 * Used when USE_PG_MESSAGING=true.
 */

function mapConversation(row) {
  return {
    _id: row.id,
    teamMember: { _id: row.team_member_id },
    user: { _id: row.user_id },
    organization: row.org_id ? { _id: row.org_id } : undefined,
    relatedForm: row.related_form_id ? { _id: row.related_form_id } : undefined,
    lastMessageAt: row.last_message_at,
    createdAt: row.created_at,
  };
}

function mapMessage(row) {
  return {
    _id: row.id,
    conversationId: row.conversation_id,
    sender: { _id: row.sender_id },
    recipient: { _id: row.recipient_id },
    content: row.content,
    read: row.read,
    createdAt: row.created_at,
  };
}

export async function getConversationsByRole(role, userId, orgId) {
  const supabase = getSupabaseServer();
  const column = role === "teamMember" ? "team_member_id" : "user_id";

  let query = supabase
    .from("conversations")
    .select("*")
    .eq(column, userId)
    .order("last_message_at", { ascending: false });

  if (role === "teamMember" && orgId) {
    query = query.eq("org_id", orgId);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(mapConversation);
}

export async function getConversationById(conversationId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();
  if (error) throw error;
  return data ? mapConversation(data) : null;
}

export async function getMessages(conversationId) {
  const supabase = getSupabaseServer();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data || []).map(mapMessage);
}

export async function createMessage(conversationId, senderId, recipientId, content) {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      recipient_id: recipientId,
      content,
      read: false,
    })
    .select()
    .single();
  if (error) throw error;

  // Update conversation lastMessageAt
  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId);

  return mapMessage(data);
}

export async function markMessagesAsRead(conversationId, userId) {
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("conversation_id", conversationId)
    .eq("recipient_id", userId)
    .eq("read", false);
  if (error) throw error;
}

export async function findOrCreateConversation(teamMemberId, userId, relatedFormId, orgId) {
  const supabase = getSupabaseServer();

  // Check existing
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("team_member_id", teamMemberId)
    .eq("user_id", userId)
    .maybeSingle();

  if (existing) return mapConversation(existing);

  // Create new
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      team_member_id: teamMemberId,
      user_id: userId,
      org_id: orgId || null,
      related_form_id: relatedFormId || null,
    })
    .select()
    .single();
  if (error) throw error;
  return mapConversation(data);
}
