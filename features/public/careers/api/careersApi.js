import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const careersApi = {
  /**
   * Get all open positions for the careers page
   */
  async getPositions(params = {}) {
    const query = new URLSearchParams();
    if (params.department) query.set("department", params.department);
    if (params.location) query.set("location", params.location);
    if (params.type) query.set("type", params.type);
    if (params.search) query.set("search", params.search);

    const qs = query.toString();
    const url = `${API_ENDPOINTS.CAREERS}${qs ? `?${qs}` : ""}`;
    return apiClient.get(url);
  },

  /**
   * Get a single position by ID
   */
  async getById(id) {
    return apiClient.get(API_ENDPOINTS.CAREER_BY_ID(id));
  },

  /**
   * Get filter options (departments, locations)
   */
  async getFilters() {
    return apiClient.get(API_ENDPOINTS.CAREER_FILTERS);
  },

  /**
   * Submit an application for a position
   */
  async apply(positionId, data) {
    return apiClient.post(API_ENDPOINTS.CAREER_APPLY(positionId), data);
  },

  /**
   * Check if current user already applied to a position
   */
  async checkApplied(positionId) {
    return apiClient.get(API_ENDPOINTS.CAREER_APPLY(positionId));
  },
};
