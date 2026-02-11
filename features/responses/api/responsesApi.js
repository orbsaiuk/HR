/**
 * Responses API service
 */

import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const responsesApi = {
    /**
     * Fetch responses for a form
     */
    async getByFormId(formId) {
        return apiClient.get(`${API_ENDPOINTS.RESPONSES}?formId=${formId}`);
    },

    /**
     * Fetch a single response
     */
    async getById(id) {
        return apiClient.get(API_ENDPOINTS.RESPONSE_BY_ID(id));
    },

    /**
     * Delete a response
     */
    async delete(id) {
        return apiClient.delete(API_ENDPOINTS.RESPONSE_BY_ID(id));
    },
};
