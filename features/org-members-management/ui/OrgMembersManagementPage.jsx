"use client";

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { useOrgMembersManagement } from "../model/useOrgMembersManagement";
import { PermissionGuard } from "./PermissionGuard";
import { InviteOrgMemberForm } from "./InviteOrgMemberForm";
import { InvitesList } from "./InvitesList";
import { OrgMembersList } from "./OrgMembersList";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";

export function OrgMembersManagementPage() {
  const {
    invites,
    teamMembers,
    roles,
    loading,
    error,
    createInvite,
    deleteInvite,
    removeTeamMember,
    changeRole,
    refetch,
  } = useOrgMembersManagement();
  const { toast, showToast, hideToast } = useToast();
  const [ownerTeamMemberId, setOwnerTeamMemberId] = useState(null);

  useEffect(() => {
    if (teamMembers.length > 0) {
      // The first team member in the list (sorted by joinedAt asc) is the owner
      setOwnerTeamMemberId(teamMembers[0]?.user?._id);
    }
  }, [teamMembers]);

  const handleInvite = async (email, roleKey) => {
    const result = await createInvite(email, roleKey);
    if (result.success) {
      showToast(`تم إرسال الدعوة إلى ${email}`, "success");
    } else {
      showToast(result.error, "error");
    }
    return result;
  };

  const handleDeleteInvite = async (id) => {
    const result = await deleteInvite(id);
    if (result.success) {
      showToast("تم إلغاء الدعوة", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleRemoveTeamMember = async (id) => {
    const result = await removeTeamMember(id);
    if (result.success) {
      showToast("تمت إزالة عضو الشركة", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleChangeRole = async (teamMemberKey, roleKey) => {
    const result = await changeRole(teamMemberKey, roleKey);
    if (result.success) {
      showToast("تم تحديث الدور بنجاح", "success");
    } else {
      showToast(result.error, "error");
    }
    return result;
  };

  return (
    <PermissionGuard>
      <div className="space-y-6" dir="rtl">
        {/* Page Header */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Users className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">
              إدارة أعضاء الشركة
            </h1>
          </div>
          <p className="text-gray-500">
            قم بدعوة أعضاء جدد للشركة وإدارة الأعضاء الحاليين. المستخدمون
            المدعوون سيصبحون أعضاء شركة تلقائيًا بعد إتمام التسجيل.
          </p>
        </div>

        {/* Invite Form */}
        <InviteOrgMemberForm onInvite={handleInvite} roles={roles} />

        {/* Content */}
        {loading ? (
          <Loading />
        ) : error ? (
          <Error message={error} onRetry={refetch} />
        ) : (
          <>
            <OrgMembersList
              teamMembers={teamMembers}
              roles={roles}
              onRemove={handleRemoveTeamMember}
              onChangeRole={handleChangeRole}
              ownerTeamMemberId={ownerTeamMemberId}
            />
            <InvitesList
              invites={invites}
              roles={roles}
              onDelete={handleDeleteInvite}
            />
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
    </PermissionGuard>
  );
}
