/**
 * Team member profile hook
 * Manages team member profile and forms data
 */

import { useState, useEffect } from "react";
import { teamMembersApi } from "../api/teamMembersApi";

export function useTeamMemberProfile(teamMemberId) {
  const [teamMember, setTeamMember] = useState(null);
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!teamMemberId) return;
    fetchData();
  }, [teamMemberId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching team member with ID:", teamMemberId);

      const [teamMemberData, formsData] = await Promise.all([
        teamMembersApi.getById(teamMemberId),
        teamMembersApi.getTeamMemberForms(teamMemberId),
      ]);

      console.log("Team member data:", teamMemberData);
      console.log("Forms data:", formsData);

      setTeamMember(teamMemberData);
      setForms(formsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    teamMember,
    forms,
    loading,
    error,
    refetch: fetchData,
  };
}
