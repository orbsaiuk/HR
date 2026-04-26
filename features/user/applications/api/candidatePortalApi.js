import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const candidatePortalApi = {
  /**
   * Get all of the current user's applications
   */
  async getMyApplications() {
    return apiClient.get(API_ENDPOINTS.MY_APPLICATIONS);
  },

  /**
   * Get a single application detail
   */
  async getMyApplicationById(id) {
    return apiClient.get(API_ENDPOINTS.MY_APPLICATION_BY_ID(id));
  },
};
