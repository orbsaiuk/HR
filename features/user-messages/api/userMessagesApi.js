/**
 * User messages API service
 */

import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const userMessagesApi = {
    async getConversations() {
        return apiClient.get(API_ENDPOINTS.CONVERSATIONS);
    },
};
