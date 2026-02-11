/**
 * User submissions API
 */

import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const userSubmissionsApi = {
    /**
     * Get all submissions for current user
     */
    async getMySubmissions() {
        return apiClient.get(API_ENDPOINTS.USER_SUBMISSIONS);
    },

    /**
     * Get submission by ID
     */
    async getSubmissionById(id) {
        return apiClient.get(API_ENDPOINTS.USER_SUBMISSION_BY_ID(id));
    },

    /**
     * Mark submission as read
     */
    async markAsRead(id) {
        return apiClient.patch(API_ENDPOINTS.USER_SUBMISSION_MARK_READ(id));
    },

    /**
     * Mark all submissions as read
     */
    async markAllAsRead() {
        return apiClient.patch(API_ENDPOINTS.USER_SUBMISSIONS_MARK_ALL_READ);
    },
};
