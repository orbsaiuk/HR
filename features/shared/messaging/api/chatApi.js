/**
 * Chat API service
 * Handles all chat/messaging-related API calls
 */

import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const chatApi = {
    /**
     * Fetch all conversations
     */
    async getConversations() {
        return apiClient.get(API_ENDPOINTS.CONVERSATIONS);
    },

    /**
     * Fetch a single conversation by ID
     */
    async getConversation(id) {
        return apiClient.get(API_ENDPOINTS.CONVERSATION_BY_ID(id));
    },

    /**
     * Fetch messages for a conversation
     */
    async getMessages(conversationId) {
        return apiClient.get(API_ENDPOINTS.MESSAGES(conversationId));
    },

    /**
     * Send a message
     */
    async sendMessage(conversationId, content) {
        return apiClient.post(API_ENDPOINTS.MESSAGES(conversationId), { content });
    },

    /**
     * Create a new conversation
     */
    async createConversation(data) {
        return apiClient.post(API_ENDPOINTS.CONVERSATIONS, {
            userId: data.userId,
            formId: data.formId,
        });
    },

    /**
     * Mark messages as read in a conversation
     */
    async markAsRead(conversationId) {
        return apiClient.patch(API_ENDPOINTS.MARK_AS_READ(conversationId));
    },
};
