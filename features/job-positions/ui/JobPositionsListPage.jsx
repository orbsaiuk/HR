"use client";

import Link from "next/link";
import { Plus, Briefcase } from "lucide-react";
import { useJobPositionsList } from "../model/useJobPositionsList";
import { useJobPositionActions } from "../model/useJobPositionActions";
import { JobPositionsTable } from "./JobPositionsTable";
import { JobPositionsStats } from "./JobPositionsStats";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { EmptyState } from "@/shared/components/feedback/EmptyState";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { usePermissions } from "@/features/team-member-management/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";

export function JobPositionsListPage() {
  const { positions, loading, error, refetch, setPositions } =
    useJobPositionsList();
  const { deletePosition, updateStatus } = useJobPositionActions();
  const { toast, showToast, hideToast } = useToast();
  const { hasPermission } = usePermissions();
  const canManagePositions = hasPermission(PERMISSIONS.MANAGE_POSITIONS);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this job position?")) return;
    const result = await deletePosition(id);
    if (result.success) {
      setPositions(positions.filter((p) => p._id !== id));
      showToast("Position deleted", "success");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleStatusChange = async (id, status) => {
    const result = await updateStatus(id, status);
    if (result.success) {
      setPositions(positions.map((p) => (p._id === id ? { ...p, status } : p)));
      showToast(`Position ${status === "open" ? "opened" : status}`, "success");
    } else {
      showToast(result.error, "error");
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Briefcase className="text-blue-600" size={24} />
            <h1 className="text-2xl font-bold text-gray-900">Job Positions</h1>
          </div>
          <p className="text-gray-500 mt-1">
            Manage your open positions and track applications.
          </p>
        </div>
        <PermissionGate permission={PERMISSIONS.MANAGE_POSITIONS}>
          <Button asChild>
            <Link href="/dashboard/positions/create">
              <Plus size={18} />
              New Position
            </Link>
          </Button>
        </PermissionGate>
      </div>

      {/* Stats */}
      <JobPositionsStats positions={positions} />

      {/* Content */}
      {positions.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No job positions yet"
          description="Create your first job position to start receiving applications."
          action={
            canManagePositions
              ? {
                href: "/dashboard/positions/create",
                label: "Create Position",
                icon: Plus,
              }
              : null
          }
        />
      ) : (
        <JobPositionsTable
          positions={positions}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
        />
      )}

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}

