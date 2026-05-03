/**
 * Dashboard API service
 * Handles all dashboard-related API calls
 */

export const dashboardApi = {
  /**
   * Fetch company dashboard data
   * @returns {Promise<Object>} Dashboard stats for cards, charts, and latest jobs
   */
  async getStats() {
    const res = await fetch("/api/company/dashboard");
    if (!res.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }
    return res.json();
  },
};
