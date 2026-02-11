/**
 * Team members list page component
 */

"use client";

import { useTeamMembersList } from "../model/useTeamMembersList";
import { TeamMemberCard } from "./TeamMemberCard";
import { TeamMembersSearch } from "./TeamMembersSearch";
import { TeamMembersEmpty } from "./TeamMembersEmpty";
import { Loading } from "@/shared/components/feedback/Loading";

export function TeamMembersListPage() {
  const { teamMembers, loading, search, setSearch } = useTeamMembersList();

  console.log("Team members loaded:", teamMembers);

  if (loading) return <Loading fullPage />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
        <p className="text-gray-600 mt-1">
          Browse and connect with team members
        </p>
      </div>

      <TeamMembersSearch search={search} onSearchChange={setSearch} />

      {teamMembers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teamMembers.map((teamMember) => {
            console.log(
              "Rendering team member:",
              teamMember._id,
              teamMember.name,
            );
            return (
              <TeamMemberCard key={teamMember._id} teamMember={teamMember} />
            );
          })}
        </div>
      ) : (
        <TeamMembersEmpty hasSearch={!!search} />
      )}
    </div>
  );
}
