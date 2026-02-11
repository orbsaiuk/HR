/**
 * Analytics API service
 */

import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const analyticsApi = {
    /**
     * Fetch analytics for a form
     */
    async getByFormId(formId) {
        return apiClient.get(API_ENDPOINTS.FORM_ANALYTICS(formId));
    },
};
