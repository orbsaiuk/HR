"use client";

import { useState, useEffect } from "react";
import { teamMemberManagementApi } from "../api/teamMemberManagementApi";

export function useTeamMemberManagement() {
  const [invites, setInvites] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [invitesData, teamMembersData] = await Promise.all([
        teamMemberManagementApi.getInvites(),
        teamMemberManagementApi.getTeamMembers(),
      ]);
      setInvites(invitesData);
      setTeamMembers(teamMembersData);
    } catch (err) {
      setError(err.message || "Failed to fetch team member management data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createInvite = async (email) => {
    try {
      const newInvite = await teamMemberManagementApi.createInvite(email);
      await fetchData();
      return { success: true, data: newInvite };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to create invite",
      };
    }
  };

  const deleteInvite = async (id) => {
    try {
      await teamMemberManagementApi.deleteInvite(id);
      setInvites((prev) => prev.filter((invite) => invite._id !== id));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to delete invite",
      };
    }
  };

  const removeTeamMember = async (id) => {
    try {
      await teamMemberManagementApi.removeTeamMember(id);
      setTeamMembers((prev) =>
        prev.filter((teamMember) => teamMember._id !== id),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "Failed to remove team member",
      };
    }
  };

  return {
    invites,
    teamMembers,
    loading,
    error,
    createInvite,
    deleteInvite,
    removeTeamMember,
    refetch: fetchData,
  };
}
