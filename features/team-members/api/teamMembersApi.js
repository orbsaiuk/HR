/**
 * Team members API service
 */

import { apiClient } from "@/shared/api/client";

export const teamMembersApi = {
  async getAll() {
    return apiClient.get("/api/team-members");
  },

  async getById(id) {
    return apiClient.get(`/api/team-members/${id}`);
  },

  async getTeamMemberForms(teamMemberId) {
    return apiClient.get(`/api/team-members/${teamMemberId}/forms`);
  },
};
