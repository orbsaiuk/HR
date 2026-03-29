/**
 * Dashboard API service
 * Handles all dashboard-related API calls
 */

import { MOCK_DASHBOARD_DATA } from '../lib/mockDashboardData';

const DASHBOARD_DELAY_MS = 180;

export const dashboardApi = {
    /**
     * Fetch company dashboard data
     * @returns {Promise<Object>} Dashboard stats for cards, charts, and latest jobs
     */
    async getStats() {
        await delay(DASHBOARD_DELAY_MS);
        return JSON.parse(JSON.stringify(MOCK_DASHBOARD_DATA));
    },
};

function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
