/**
 * Team members list hook
 * Manages team members list state and filtering
 */

import { useState, useEffect, useMemo } from "react";
import { teamMembersApi } from "../api/teamMembersApi";

export function useTeamMembersList() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const data = await teamMembersApi.getAll();
      setTeamMembers(data);
    } catch (err) {
      console.error("Error fetching team members:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredTeamMembers = useMemo(() => {
    if (!search) return teamMembers;

    const searchLower = search.toLowerCase();
    return teamMembers.filter(
      (teamMember) =>
        teamMember.name?.toLowerCase().includes(searchLower) ||
        teamMember.bio?.toLowerCase().includes(searchLower),
    );
  }, [teamMembers, search]);

  return {
    teamMembers: filteredTeamMembers,
    loading,
    search,
    setSearch,
    refetch: fetchTeamMembers,
  };
}
