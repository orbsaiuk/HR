/**
 * Dashboard API service
 * Handles all dashboard-related API calls
 */

import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/api/endpoints';

export const dashboardApi = {
    /**
     * Fetch dashboard statistics
     * @returns {Promise<Object>} Dashboard stats including forms count, responses, etc.
     */
    async getStats() {
        let forms = [];

        try {
            forms = await apiClient.get(API_ENDPOINTS.FORMS);
        } catch (error) {
            // If the user lacks VIEW_FORMS permission (403), degrade gracefully
            // instead of breaking the entire dashboard
            if (error.status === 403) {
                forms = [];
            } else {
                throw error;
            }
        }

        // Calculate stats from forms data
        const totalForms = forms.length;
        const publishedForms = forms.filter(f => f.status === 'published').length;
        const draftForms = forms.filter(f => f.status === 'draft').length;
        const totalResponses = forms.reduce((sum, form) => sum + (form.responseCount || 0), 0);

        // Create recent activity
        const recentActivity = forms
            .slice(0, 5)
            .map(form => ({
                id: form._id,
                type: form.status === 'published' ? 'form_published' : 'form_created',
                title: form.title,
                date: form.updatedAt,
                status: form.status,
            }));

        return {
            totalForms,
            publishedForms,
            draftForms,
            totalResponses,
            recentActivity,
        };
    },
};
