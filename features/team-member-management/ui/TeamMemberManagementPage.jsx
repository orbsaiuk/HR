"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useTeamMemberManagement } from "../model/useTeamMemberManagement";
import { OwnerGuard } from "./OwnerGuard";
import { InviteTeamMemberForm } from "./InviteTeamMemberForm";
import { InvitesList } from "./InvitesList";
import { TeamMembersList } from "./TeamMembersList";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";

export function TeamMemberManagementPage() {
  const {
    invites,
    teamMembers,
    loading,
    error,
    createInvite,
    deleteInvite,
    removeTeamMember,
    refetch,
  } = useTeamMemberManagement();
  const { toast, showToast, hideToast } = useToast();
  const [ownerTeamMemberId, setOwnerTeamMemberId] = useState(null);

  useEffect(() => {
    if (teamMembers.length > 0) {
      // The first team member in the list (sorted by createdAt asc) is the owner
      setOwnerTeamMemberId(teamMembers[0]?._id);
    }
  }, [teamMembers]);

  const handleInvite = async (email) => {
    const result = await createInvite(email);
    if (result.success) {
      showToast(`Invite sent to ${email}`, "success");
    } else {
      showToast(result.error, "error");
    }
    return result;
  };

  const handleDeleteInvite = async (id) => {
    const result = await deleteInvite(id);
    if (result.success) {
      showToast("Invite revoked", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleRemoveTeamMember = async (id) => {
    const result = await removeTeamMember(id);
    if (result.success) {
      showToast("Team member removed", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  return (
    <OwnerGuard>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Users className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Team Members
            </h1>
          </div>
          <p className="text-gray-500">
            Invite new team members and manage existing ones. Invited users will
            automatically become team members when they sign up.
          </p>
        </div>

        {/* Invite Form */}
        <InviteTeamMemberForm onInvite={handleInvite} />

        {/* Content */}
        {loading ? (
          <Loading />
        ) : error ? (
          <Error message={error} onRetry={refetch} />
        ) : (
          <>
            <TeamMembersList
              teamMembers={teamMembers}
              onRemove={handleRemoveTeamMember}
              ownerTeamMemberId={ownerTeamMemberId}
            />
            <InvitesList invites={invites} onDelete={handleDeleteInvite} />
          </>
        )}

        {/* Toast */}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={hideToast}
          />
        )}
      </div>
    </OwnerGuard>
  );
}
