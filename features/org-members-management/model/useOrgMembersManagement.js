"use client";

import { useState, useEffect } from "react";
import { orgMembersManagementApi } from "../api/orgMembersManagementApi";

export function useOrgMembersManagement() {
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
        orgMembersManagementApi.getInvites(),
        orgMembersManagementApi.getTeamMembers(),
        orgMembersManagementApi.getRoles(),
      ]);
      setInvites(invitesData || []);
      setTeamMembers(teamMembersData || []);
      setRoles(rolesData || []);
    } catch (err) {
      setError(err.message || "تعذر تحميل بيانات إدارة أعضاء الشركة");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createInvite = async (email, roleKey) => {
    try {
      const newInvite = await orgMembersManagementApi.createInvite(
        email,
        roleKey,
      );
      await fetchData();
      return { success: true, data: newInvite };
    } catch (err) {
      return {
        success: false,
        error: err.message || "تعذر إنشاء الدعوة",
      };
    }
  };

  const deleteInvite = async (key) => {
    try {
      await orgMembersManagementApi.deleteInvite(key);
      // Invites are embedded array items identified by _key
      setInvites((prev) => prev.filter((invite) => invite._key !== key));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "تعذر حذف الدعوة",
      };
    }
  };

  const removeTeamMember = async (userId) => {
    try {
      await orgMembersManagementApi.removeTeamMember(userId);
      // Team members are embedded entries; filter by user._id
      setTeamMembers((prev) => prev.filter((tm) => tm.user?._id !== userId));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "تعذر إزالة عضو الشركة",
      };
    }
  };

  const changeRole = async (teamMemberKey, roleKey) => {
    try {
      await orgMembersManagementApi.changeRole(teamMemberKey, roleKey);
      // Update the local state optimistically
      setTeamMembers((prev) =>
        prev.map((tm) => (tm._key === teamMemberKey ? { ...tm, roleKey } : tm)),
      );
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message || "تعذر تغيير الدور",
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
