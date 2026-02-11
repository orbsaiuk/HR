"use client";

import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { useApplicationsList } from "../model/useApplicationsList";
import { useApplicationActions } from "../model/useApplicationActions";
import { ApplicationsTable } from "./ApplicationsTable";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function PositionApplicationsPage({ positionId }) {
  const { applications, loading, error, refetch, setApplications } =
    useApplicationsList(positionId);
  const { updateStatus, deleteApplication } = useApplicationActions();
  const { toast, showToast, hideToast } = useToast();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={refetch} />;

  const handleStatusChange = async (appId, newStatus) => {
    const result = await updateStatus(appId, newStatus);
    if (result.success) {
      setApplications(
        applications.map((a) =>
          a._id === appId ? { ...a, status: newStatus } : a,
        ),
      );
      showToast(`Application moved to ${newStatus}`, "success");
    } else {
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
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/dashboard/positions/${positionId}`}>
              <ArrowLeft size={20} />
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Users size={22} className="text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
            <Badge variant="secondary">{applications.length}</Badge>
          </div>
        </div>
      </div>

      {/* Table */}
      {applications.length === 0 ? (
        <div className="py-16 text-center text-muted-foreground">
          No applications yet. Candidates will appear here when they apply.
        </div>
      ) : (
        <ApplicationsTable
          applications={applications}
          positionId={positionId}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
