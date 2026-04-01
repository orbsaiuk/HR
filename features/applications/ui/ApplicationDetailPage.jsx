"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApplicationDetail } from "../model/useApplicationDetail";
import { useApplicationActions } from "../model/useApplicationActions";
import { ApplicationDetailHeader } from "./ApplicationDetailHeader";
import { ApplicantInfoCard } from "./ApplicantInfoCard";
import { ApplicationAnswersCard } from "./ApplicationAnswersCard";
import { ProfileSnapshotSection } from "./components/profile-snapshot/ProfileSnapshotSection";
import { PositionInfoCard } from "./PositionInfoCard";
import { StatusActionsCard } from "./StatusActionsCard";
import { RatingAndNotesCard } from "./RatingAndNotesCard";
import { ScorecardPanel } from "@/features/scorecards";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STATUS_LABELS = {
  new: "جديد",
  screening: "فرز أولي",
  interview: "مقابلة",
  offered: "عرض وظيفي",
  hired: "تم التوظيف",
  rejected: "مرفوض",
};

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

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

    if (application?.isMock) {
      setApplication({
        ...application,
        status: newStatus,
        notes,
        rating,
        rejectionReason,
      });
      showToast(
        `تم تحديث الحالة إلى ${STATUS_LABELS[newStatus] || newStatus}`,
        "success",
      );
      return;
    }

    const result = await updateStatus(applicationId, newStatus, extra);
    if (result.success) {
      setApplication({
        ...application,
        status: newStatus,
        notes,
        rating,
        rejectionReason,
      });
      showToast(
        `تم تحديث الحالة إلى ${STATUS_LABELS[newStatus] || newStatus}`,
        "success",
      );
    } else {
      showToast(result.error, "error");
    }
  };

  const handleSaveNotes = async () => {
    if (application?.isMock) {
      setApplication({
        ...application,
        notes,
        rating,
        rejectionReason,
      });
      showToast("تم حفظ الملاحظات", "success");
      return;
    }

    const result = await updateApplication(applicationId, {
      notes,
      rating,
      rejectionReason,
    });
    if (result.success) {
      showToast("تم حفظ الملاحظات", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const executeDelete = async () => {
    setIsDeleteDialogOpen(false);

    if (application?.isMock) {
      showToast("تم حذف طلب التقديم", "success");
      router.push(`/company/positions/${positionId}/applications`);
      return;
    }

    const result = await deleteApplication(applicationId);
    if (result.success) {
      showToast("تم حذف طلب التقديم", "success");
      router.push(`/company/positions/${positionId}`);
    } else {
      showToast(result.error, "error");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;
  if (!application) return <Error message="لم يتم العثور على طلب التقديم" />;

  const {
    applicant,
    jobPosition,
    answers,
    profileSnapshot,
    status,
    appliedAt,
  } = application;

  return (
    <div className=" mx-auto space-y-6" dir="rtl">
      <ApplicationDetailHeader
        applicantName={applicant?.name}
        positionTitle={jobPosition?.title}
        appliedAt={appliedAt}
        status={status}
        positionId={positionId}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <ApplicantInfoCard name={applicant?.name} email={applicant?.email} />

          {profileSnapshot && (
            <ProfileSnapshotSection
              profileSnapshot={profileSnapshot}
              applicantName={applicant?.name}
              applicantEmail={applicant?.email}
            />
          )}

          <ApplicationAnswersCard answers={answers} />

          {/* Evaluation Scorecards */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              بطاقات التقييم
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف طلب التقديم؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف طلب التقديم نهائيا من
              النظام.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex sm:justify-start gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
