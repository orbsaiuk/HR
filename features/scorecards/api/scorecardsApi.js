import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const scorecardsApi = {
  /**
   * Get all scorecards for an application
   */
  async getByApplication(applicationId) {
    return apiClient.get(API_ENDPOINTS.SCORECARDS(applicationId));
  },

  /**
   * Get the current user's scorecard for an application
   */
  async getMine(applicationId) {
    return apiClient.get(API_ENDPOINTS.SCORECARD_MINE(applicationId));
  },

  /**
   * Get scorecard summary (averages) for an application
   */
  async getSummary(applicationId) {
    return apiClient.get(API_ENDPOINTS.SCORECARD_SUMMARY(applicationId));
  },

  /**
   * Create or update a scorecard
   */
  async upsert(applicationId, data) {
    return apiClient.post(API_ENDPOINTS.SCORECARDS(applicationId), data);
  },

  /**
   * Delete a scorecard
   */
  async delete(applicationId, scorecardId) {
    return apiClient.delete(
      `${API_ENDPOINTS.SCORECARDS(applicationId)}/${scorecardId}`,
    );
  },
};
