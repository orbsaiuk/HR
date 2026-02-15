"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationDetail } from "../model/useApplicationDetail";
import { useApplicationActions } from "../model/useApplicationActions";
import { ApplicationDetailHeader } from "./ApplicationDetailHeader";
import { ApplicantInfoCard } from "./ApplicantInfoCard";
import { ApplicationAnswersCard } from "./ApplicationAnswersCard";
import { PositionInfoCard } from "./PositionInfoCard";
import { StatusActionsCard } from "./StatusActionsCard";
import { RatingAndNotesCard } from "./RatingAndNotesCard";
import { ScorecardPanel } from "@/features/scorecards";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";

export function ApplicationDetailPage({ applicationId, positionId }) {
  const router = useRouter();
  const { application, loading, error, refetch, setApplication } =
    useApplicationDetail(applicationId);
  const { updateStatus, updateApplication, deleteApplication, actionLoading } =
    useApplicationActions();
  const { toast, showToast, hideToast } = useToast();

  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState(0);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (application) {
      setNotes(application.notes || "");
      setRating(application.rating || 0);
      setRejectionReason(application.rejectionReason || "");
    }
  }, [application]);

  const handleStatusChange = async (newStatus) => {
    const extra = {};
    if (newStatus === "rejected") extra.rejectionReason = rejectionReason;
    extra.notes = notes;
    extra.rating = rating;

    const result = await updateStatus(applicationId, newStatus, extra);
    if (result.success) {
      setApplication({
        ...application,
        status: newStatus,
        notes,
        rating,
        rejectionReason,
      });
      showToast(`Status changed to ${newStatus}`, "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleSaveNotes = async () => {
    const result = await updateApplication(applicationId, {
      notes,
      rating,
      rejectionReason,
    });
    if (result.success) {
      showToast("Notes saved", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    const result = await deleteApplication(applicationId);
    if (result.success) {
      showToast("Application deleted", "success");
      router.push(`/dashboard/positions/${positionId}`);
    } else {
      showToast(result.error, "error");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!application) return <Error message="Application not found" />;

  const { applicant, jobPosition, answers, status, appliedAt } = application;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <ApplicationDetailHeader
        applicantName={applicant?.name}
        positionTitle={jobPosition?.title}
        appliedAt={appliedAt}
        status={status}
        positionId={positionId}
        onDelete={handleDelete}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <ApplicantInfoCard name={applicant?.name} email={applicant?.email} />
          <ApplicationAnswersCard answers={answers} />

          {/* Evaluation Scorecards */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Evaluation Scorecards
            </h2>
            <ScorecardPanel applicationId={applicationId} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <PositionInfoCard position={jobPosition} />
          <StatusActionsCard
            status={status}
            onStatusChange={handleStatusChange}
            isLoading={actionLoading}
          />
          <RatingAndNotesCard
            rating={rating}
            onRatingChange={setRating}
            notes={notes}
            onNotesChange={setNotes}
            rejectionReason={rejectionReason}
            onRejectionReasonChange={setRejectionReason}
            status={status}
            onSave={handleSaveNotes}
            isLoading={actionLoading}
          />
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
