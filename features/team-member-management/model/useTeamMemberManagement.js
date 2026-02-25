"use client";

import { useState, useEffect } from "react";
import { teamMemberManagementApi } from "../api/teamMemberManagementApi";

export function useTeamMemberManagement() {
  const [invites, setInvites] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [invitesData, teamMembersData, rolesData] = await Promise.all([
        teamMemberManagementApi.getInvites(),
        teamMemberManagementApi.getTeamMembers(),
        teamMemberManagementApi.getRoles(),
      ]);
      setInvites(invitesData || []);
      setTeamMembers(teamMembersData || []);
      setRoles(rolesData || []);
    } catch (err) {
      setError(err.message || "Failed to fetch team member management data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createInvite = async (email, roleKey) => {
    try {
      const newInvite = await teamMemberManagementApi.createInvite(
        email,
        roleKey,
      );
      await fetchData();
      return { success: true, data: newInvite };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to create invite",
      };
    }
  };

  const deleteInvite = async (key) => {
    try {
      await teamMemberManagementApi.deleteInvite(key);
      // Invites are embedded array items identified by _key
      setInvites((prev) => prev.filter((invite) => invite._key !== key));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to delete invite",
      };
    }
  };

  const removeTeamMember = async (userId) => {
    try {
      await teamMemberManagementApi.removeTeamMember(userId);
      // Team members are embedded entries; filter by user._id
      setTeamMembers((prev) =>
        prev.filter((tm) => tm.user?._id !== userId),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to remove team member",
      };
    }
  };

  const changeRole = async (teamMemberKey, roleKey) => {
    try {
      await teamMemberManagementApi.changeRole(teamMemberKey, roleKey);
      // Update the local state optimistically
      setTeamMembers((prev) =>
        prev.map((tm) =>
          tm._key === teamMemberKey ? { ...tm, roleKey } : tm,
        ),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to change role",
      };
    }
  };

  return {
    invites,
    teamMembers,
    roles,
    loading,
    error,
    createInvite,
    deleteInvite,
    removeTeamMember,
    changeRole,
    refetch: fetchData,
  };
}
