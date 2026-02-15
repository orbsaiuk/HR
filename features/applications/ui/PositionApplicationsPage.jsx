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

export function PositionApplicationsPage({ positionId }) {
  const [view, setView] = useState("kanban");
  const { applications, loading, error, refetch, setApplications } =
    useApplicationsList(positionId);
  const { updateStatus, deleteApplication } = useApplicationActions();
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
    setApplications(
      applications.map((a) =>
        a._id === appId ? { ...a, status: newStatus } : a,
      ),
    );

    // Persist in background, revert on failure
    const result = await updateStatus(appId, newStatus);
    if (!result.success) {
      setApplications(previous);
      showToast(result.error, "error");
    }
  };

  const handleDelete = async (appId) => {
    if (!confirm("Are you sure you want to delete this application?")) return;
    const result = await deleteApplication(appId);
    if (result.success) {
      setApplications(applications.filter((a) => a._id !== appId));
      showToast("Application deleted", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  return (
    <div className="space-y-6">
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
        <div className="max-w-5xl">
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
    </div>
  );
}
