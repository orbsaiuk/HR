import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const jobPositionsApi = {
  async getAll() {
    return apiClient.get(API_ENDPOINTS.JOB_POSITIONS);
  },

  async getById(id) {
    return apiClient.get(API_ENDPOINTS.JOB_POSITION_BY_ID(id));
  },

  async getStats() {
    return apiClient.get(API_ENDPOINTS.JOB_POSITION_STATS);
  },

  async create(data) {
    return apiClient.post(API_ENDPOINTS.JOB_POSITIONS, data);
  },

  async update(id, data) {
    return apiClient.put(API_ENDPOINTS.JOB_POSITION_BY_ID(id), data);
  },

  async delete(id) {
    return apiClient.delete(API_ENDPOINTS.JOB_POSITION_BY_ID(id));
  },

  async updateStatus(id, status) {
    return apiClient.patch(API_ENDPOINTS.JOB_POSITION_STATUS(id), { status });
  },
};
