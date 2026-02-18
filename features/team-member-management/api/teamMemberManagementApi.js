import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

export const teamMemberManagementApi = {
  async getInvites() {
    return apiClient.get(API_ENDPOINTS.TEAM_MEMBER_INVITES);
  },

  async createInvite(email, roleKey) {
    return apiClient.post(API_ENDPOINTS.TEAM_MEMBER_INVITES, { email, roleKey });
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

  async changeRole(teamMemberKey, roleKey) {
    return apiClient.patch(API_ENDPOINTS.TEAM_MEMBER_CHANGE_ROLE(teamMemberKey), { roleKey });
  },

  async getMyPermissions() {
    return apiClient.get(API_ENDPOINTS.TEAM_MEMBER_MY_PERMISSIONS);
  },

  async getRoles() {
    return apiClient.get(API_ENDPOINTS.ROLES);
  },

  async checkIsOwner() {
    return apiClient.get(API_ENDPOINTS.TEAM_MEMBER_IS_OWNER);
  },
};
