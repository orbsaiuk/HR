/**
 * Team member profile page component
 */

"use client";

import Link from "next/link";
import { useTeamMemberProfile } from "../model/useTeamMemberProfile";
import { TeamMemberHeader } from "./TeamMemberHeader";
import { TeamMemberStats } from "./TeamMemberStats";
import { TeamMemberForms } from "./TeamMemberForms";
import { Loading } from "@/shared/components/feedback/Loading";
import { ArrowLeft } from "lucide-react";

export function TeamMemberProfilePage({ teamMemberId }) {
  const { teamMember, forms, loading, error } =
    useTeamMemberProfile(teamMemberId);

  if (loading) return <Loading fullPage />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error: {error}</p>
        <p className="text-gray-500 mt-2">Team member ID: {teamMemberId}</p>
      </div>
    );
  }

  if (!teamMember) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-900">Team member not found</p>
        <p className="text-gray-500 mt-2">ID: {teamMemberId}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/team-members"
        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
      >
        <ArrowLeft size={20} />
        Back to Team Members
      </Link>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start gap-6">
          <TeamMemberHeader teamMember={teamMember} />
          <TeamMemberStats forms={forms} teamMember={teamMember} />
        </div>
      </div>

      <TeamMemberForms forms={forms} />
    </div>
  );
}
