/**
 * Response detail page component
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useResponseDetail } from "../model/useResponseDetail";
import { useResponseStatus } from "../model/useResponseStatus";
import {
  ResponseDetailHeader,
  ResponseInfoCards,
  StatusActionButtons,
  StatusNoteCard,
  ResponseAnswers,
  RejectionModal,
} from "../components/detail";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { chatApi } from "@/features/chat/api/chatApi";

export function ResponseDetailPage({ responseId, formId }) {
  const router = useRouter();
  const { user } = useUser();
  const isTeamMember = user?.publicMetadata?.role === "teamMember";
  const { response, form, loading, error, deleteResponse, refetch } =
    useResponseDetail(responseId, formId);

  const { status, statusNote, setStatus, setStatusNote, updateStatus } =
    useResponseStatus();

  const [isSending, setIsSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);

  // Update local state when response loads
  useEffect(() => {
    if (response) {
      setStatus(response.status || "pending");
      setStatusNote(response.statusNote || "");
    }
  }, [response, setStatus, setStatusNote]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this response?")) return;

    const result = await deleteResponse();
    if (!result.success) {
      alert(result.error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdatingStatus(newStatus);
    const result = await updateStatus(responseId, newStatus, statusNote);
    if (result.success) {
      await refetch();
      alert("Status updated successfully");
    } else {
      alert(result.error || "Failed to update status");
    }
    setUpdatingStatus(null);
  };

  const handleSaveNote = async () => {
    setIsSavingNote(true);
    const currentStatus = response?.status || "pending";
    const result = await updateStatus(responseId, currentStatus, statusNote);
    if (result.success) {
      await refetch();
      alert("Note saved successfully");
    } else {
      alert(result.error || "Failed to save note");
    }
    setIsSavingNote(false);
  };

  const handleRejectClick = () => {
    setShowRejectionModal(true);
  };

  const handleRejectSubmit = async (rejectionReason) => {
    setUpdatingStatus("rejected");
    const result = await updateStatus(
      responseId,
      "rejected",
      "",
      rejectionReason,
    );
    if (result.success) {
      await refetch();
      setShowRejectionModal(false);
      alert("Submission rejected and reason sent to student");
    } else {
      alert(result.error || "Failed to reject submission");
    }
    setUpdatingStatus(null);
  };

  const handleSendMessage = async () => {
    try {
      setIsSending(true);

      const userId = response.user?._id || response.user?.id;

      if (!userId) {
        alert("User information not available");
        return;
      }

      const conversation = await chatApi.createConversation({
        userId: userId,
        formId: formId,
      });

      router.push(`/dashboard/messages/${conversation._id}`);
    } catch (error) {
      console.error("Error creating conversation:", error);
      alert("Failed to start conversation. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const currentStatus = response?.status || "pending";

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} onRetry={refetch} />;
  if (!response) return <Error message="Response not found" />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <ResponseDetailHeader
        formTitle={form?.title}
        onBack={() => router.back()}
        onSendMessage={handleSendMessage}
        onDelete={handleDelete}
        isSending={isSending}
      />

      {/* Info Cards */}
      <ResponseInfoCards response={response} />

      {/* Status Note - Only visible for team members */}
      {isTeamMember && (
        <StatusNoteCard
          statusNote={statusNote}
          onNoteChange={setStatusNote}
          onSave={handleSaveNote}
          isSaving={isSavingNote}
          hasChanges={statusNote !== (response?.statusNote || "")}
          isTeamMember={isTeamMember}
          status={currentStatus}
          rejectionReason={response?.rejectionReason}
        />
      )}

      {/* Show rejection reason to candidates */}
      {!isTeamMember && (
        <StatusNoteCard
          statusNote={response.statusNote}
          rejectionReason={response.rejectionReason}
          isTeamMember={false}
          status={currentStatus}
        />
      )}

      {/* Answers */}
      <ResponseAnswers form={form} response={response} />

      {/* Status Action Buttons - Only visible for team members */}
      {isTeamMember && (
        <StatusActionButtons
          currentStatus={currentStatus}
          updatingStatus={updatingStatus}
          onStatusUpdate={handleStatusUpdate}
          onRejectClick={handleRejectClick}
        />
      )}

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={showRejectionModal}
        onClose={() => setShowRejectionModal(false)}
        onSubmit={handleRejectSubmit}
        isSubmitting={updatingStatus === "rejected"}
      />
    </div>
  );
}
