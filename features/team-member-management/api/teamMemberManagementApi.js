import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const teamMemberManagementApi = {
  async getInvites() {
    return apiClient.get(API_ENDPOINTS.TEAM_MEMBER_INVITES);
  },

  async createInvite(email) {
    return apiClient.post(API_ENDPOINTS.TEAM_MEMBER_INVITES, { email });
  },

  async deleteInvite(id) {
    return apiClient.delete(API_ENDPOINTS.TEAM_MEMBER_INVITE_BY_ID(id));
  },

  async getTeamMembers() {
    return apiClient.get(API_ENDPOINTS.TEAM_MEMBERS_MANAGED);
  },

  async removeTeamMember(id) {
    return apiClient.delete(API_ENDPOINTS.TEAM_MEMBER_REMOVE(id));
  },

  async checkIsOwner() {
    return apiClient.get(API_ENDPOINTS.TEAM_MEMBER_IS_OWNER);
  },
};
