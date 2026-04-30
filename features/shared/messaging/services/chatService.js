import {
  getConversationsByRole,
  getConversationById as repoGetConversationById,
  getMessages as fetchMessages,
  createMessage,
  markMessagesAsRead,
  findOrCreateConversation as repoFindOrCreateConversation,
} from "../repositories/messagingRepository";

// Users/team members are still in Sanity
import { client } from "@/sanity/client";
import { userProfileQueries } from "@/sanity/queries";

export async function getConversations(role, userId, orgId) {
  return getConversationsByRole(role, userId, orgId);
}

export async function getConversationById(conversationId) {
  return repoGetConversationById(conversationId);
}

export async function getMessages(conversationId) {
  return fetchMessages(conversationId);
}

export async function sendMessage(
  conversationId,
  senderId,
  recipientId,
  content,
) {
  return createMessage(conversationId, senderId, recipientId, content);
}

export async function markAsRead(conversationId, userId) {
  return markMessagesAsRead(conversationId, userId);
}

export async function findOrCreateConversation(
  teamMemberId,
  userId,
  relatedFormId,
  orgId,
) {
  return repoFindOrCreateConversation(teamMemberId, userId, relatedFormId, orgId);
}

export async function getTeamMemberIdByClerkId(clerkId) {
  // Inline GROQ — no longer needs the messaging queries file
  return client.fetch(
    `*[_type == "organization" && _id == $orgId][0]{
      "userId": teamMembers[user->clerkId == $clerkId][0].user->_id
    }.userId`,
    { clerkId }
  );
}

export async function getUserIdByClerkId(clerkId) {
  return client.fetch(userProfileQueries.getByClerkId, { clerkId });
}
