"use client";

import { useState, useMemo } from "react";
import { useApplicationsList } from "../model/useApplicationsList";
import { useApplicationActions } from "../model/useApplicationActions";
import { ApplicationsPageHeader } from "./ApplicationsPageHeader";
import { ApplicationsStatsBar } from "./ApplicationsStatsBar";
import { ApplicationsViewToggle } from "./ApplicationsViewToggle";
import { ApplicationsEmptyState } from "./ApplicationsEmptyState";
import { ApplicationsTable } from "./ApplicationsTable";
import { KanbanBoard } from "./KanbanBoard";
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

export function PositionApplicationsPage({ positionId }) {
  const [view, setView] = useState("kanban");
  const [applicationToDelete, setApplicationToDelete] = useState(null);
  const { applications, loading, error, refetch, setApplications } =
    useApplicationsList(positionId);
  const { updateStatus, deleteApplication, actionLoading } =
    useApplicationActions();
  const { toast, showToast, hideToast } = useToast();

  const stats = useMemo(() => {
    if (!applications) return {};
    return {
      total: applications.length,
      new: applications.filter((a) => a.status === "new").length,
      inProgress: applications.filter((a) =>
        ["screening", "interview", "offered"].includes(a.status),
      ).length,
      hired: applications.filter((a) => a.status === "hired").length,
      rejected: applications.filter((a) => a.status === "rejected").length,
    };
  }, [applications]);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={refetch} />;

  const handleStatusChange = async (appId, newStatus) => {
    // Optimistic update
    const previous = applications;
    const targetApplication = applications.find((a) => a._id === appId);

    setApplications(
      applications.map((a) =>
        a._id === appId ? { ...a, status: newStatus } : a,
      ),
    );

    if (targetApplication?.isMock) {
      showToast("تم تحديث حالة الطلب", "success");
      return;
    }

    // Persist in background, revert on failure
    const result = await updateStatus(appId, newStatus);
    if (!result.success) {
      setApplications(previous);
      showToast(result.error, "error");
    }
  };

  const handleDelete = (appId) => {
    setApplicationToDelete(appId);
  };

  const executeDelete = async () => {
    if (!applicationToDelete) return;

    const appId = applicationToDelete;
    setApplicationToDelete(null);

    const targetApplication = applications.find((a) => a._id === appId);
    if (targetApplication?.isMock) {
      setApplications(applications.filter((a) => a._id !== appId));
      showToast("تم حذف طلب التقديم", "success");
      return;
    }

    const result = await deleteApplication(appId);
    if (result.success) {
      setApplications(applications.filter((a) => a._id !== appId));
      showToast("تم حذف طلب التقديم", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ApplicationsPageHeader
          positionId={positionId}
          totalApplications={applications.length}
        />
        <ApplicationsViewToggle view={view} onViewChange={setView} />
      </div>

      {/* Stats Bar */}
      {applications.length > 0 && <ApplicationsStatsBar stats={stats} />}

      {/* Content */}
      {applications.length === 0 ? (
        <ApplicationsEmptyState />
      ) : view === "kanban" ? (
        <KanbanBoard
          applications={applications}
          positionId={positionId}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      ) : (
        <div className="w-full">
          <ApplicationsTable
            applications={applications}
            positionId={positionId}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <AlertDialog
        open={!!applicationToDelete}
        onOpenChange={(open) => !open && setApplicationToDelete(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف طلب التقديم؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف الطلب نهائيا.
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
