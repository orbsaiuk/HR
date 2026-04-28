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
import { useJobPositionDetail } from "@/features/company/job-positions";
import { PositionApplicationsSkeleton } from "./PositionApplicationsSkeleton";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";

export function PositionApplicationsPage({ positionId }) {
  const [view, setView] = useState("kanban");
  const { applications, loading, error, refetch, setApplications } =
    useApplicationsList(positionId);
  const { position } = useJobPositionDetail(positionId);
  const { updateStatus, actionLoading } = useApplicationActions();
  const { toast, showToast, hideToast } = useToast();
  const positionName =
    position?.title || applications?.[0]?.jobPosition?.title || "";

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

  if (loading) return <PositionApplicationsSkeleton />;
  if (error) return <Error message={error} onRetry={refetch} />;

  const handleStatusChange = async (appId, newStatus) => {
    const previous = applications;

    setApplications(
      applications.map((a) =>
        a._id === appId ? { ...a, status: newStatus } : a,
      ),
    );

    const result = await updateStatus(appId, newStatus);
    if (!result.success) {
      setApplications(previous);
      showToast(result.error, "error");
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <ApplicationsPageHeader
          positionId={positionId}
          totalApplications={applications.length}
          positionName={positionName}
        />
        <ApplicationsViewToggle view={view} onViewChange={setView} />
      </div>

      {applications.length > 0 && <ApplicationsStatsBar stats={stats} />}

      {applications.length === 0 ? (
        <ApplicationsEmptyState />
      ) : view === "kanban" ? (
        <KanbanBoard
          applications={applications}
          positionId={positionId}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <div className="w-full">
          <ApplicationsTable
            applications={applications}
            positionId={positionId}
            onStatusChange={handleStatusChange}
          />
        </div>
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}