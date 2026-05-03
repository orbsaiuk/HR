export const dashboardApi = {
  /**
   * Fetch freelancer dashboard stats
   * @returns {Promise<Object>} Dashboard stats for cards and recent applications
   */
  async getStats() {
    const res = await fetch("/api/freelancer/dashboard");
    if (!res.ok) {
      throw new Error("Failed to fetch dashboard stats");
    }
    return res.json();
  },
};
