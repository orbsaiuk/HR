import { client } from "@/sanity/client";
import { chatQueries } from "@/sanity/queries/chat";

export async function getConversations(role, userId) {
  const query =
    role === "teamMember"
      ? chatQueries.getConversationsByTeamMember
      : chatQueries.getConversationsByUser;

  return client.fetch(query, { userId });
}

export async function getConversationById(conversationId) {
  return client.fetch(chatQueries.getConversationById, { conversationId });
}

export async function getMessages(conversationId) {
  return client.fetch(chatQueries.getMessagesByConversationId, {
    conversationId,
  });
}

export async function sendMessage(
  conversationId,
  senderId,
  recipientId,
  content,
) {
  const message = await client.create({
    _type: "message",
    conversationId,
    sender: { _type: "reference", _ref: senderId },
    recipient: { _type: "reference", _ref: recipientId },
    content,
    read: false,
    createdAt: new Date().toISOString(),
  });

  // Update conversation lastMessageAt
  await client
    .patch(conversationId)
    .set({
      lastMessageAt: new Date().toISOString(),
    })
    .commit();

  // Fetch complete message with populated references
  return client.fetch(chatQueries.getMessageById, { messageId: message._id });
}

export async function markAsRead(conversationId, userId) {
  const messages = await client.fetch(chatQueries.getUnreadMessages, {
    conversationId,
    userId,
  });

  for (const messageId of messages) {
    await client.patch(messageId).set({ read: true }).commit();
  }
}

export async function findOrCreateConversation(
  teamMemberId,
  userId,
  relatedFormId,
) {
  // Check if conversation already exists
  const existingConversation = await client.fetch(
    chatQueries.getExistingConversation,
    { teamMemberId, userId },
  );

  if (existingConversation) {
    return existingConversation;
  }

  // Create new conversation
  return client.create({
    _type: "conversation",
    teamMember: { _type: "reference", _ref: teamMemberId },
    user: { _type: "reference", _ref: userId },
    relatedForm: relatedFormId
      ? { _type: "reference", _ref: relatedFormId }
      : undefined,
    lastMessageAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  });
}

export async function getTeamMemberIdByClerkId(clerkId) {
  return client.fetch(chatQueries.getTeamMemberByClerkId, { clerkId });
}

export async function getUserIdByClerkId(clerkId) {
  return client.fetch(chatQueries.getUserByClerkId, { clerkId });
}
