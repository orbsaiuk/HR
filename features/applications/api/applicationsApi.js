import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const applicationsApi = {
  async getAll(positionId) {
    const url = positionId
      ? `${API_ENDPOINTS.APPLICATIONS}?positionId=${positionId}`
      : API_ENDPOINTS.APPLICATIONS;
    return apiClient.get(url);
  },

  async getById(id) {
    return apiClient.get(API_ENDPOINTS.APPLICATION_BY_ID(id));
  },

  async getStats() {
    return apiClient.get(API_ENDPOINTS.APPLICATION_STATS);
  },

  async create(data) {
    return apiClient.post(API_ENDPOINTS.APPLICATIONS, data);
  },

  async update(id, data) {
    return apiClient.put(API_ENDPOINTS.APPLICATION_BY_ID(id), data);
  },

  async delete(id) {
    return apiClient.delete(API_ENDPOINTS.APPLICATION_BY_ID(id));
  },

  async updateStatus(id, status, extra = {}) {
    return apiClient.patch(API_ENDPOINTS.APPLICATION_STATUS(id), {
      status,
      ...extra,
    });
  },
};
