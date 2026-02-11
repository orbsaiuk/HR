"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  Calendar,
  Users,
  FileText,
  DollarSign,
  Edit,
  Trash2,
  Play,
  Pause,
  XCircle,
} from "lucide-react";
import { useJobPositionDetail } from "../model/useJobPositionDetail";
import { useJobPositionActions } from "../model/useJobPositionActions";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import {
  PositionDetailHeader,
  PositionMetricsGrid,
  PositionDescriptionSection,
  PositionRequirementsSection,
  PositionDetailsCard,
} from "./components";

export function JobPositionDetailPage({ positionId }) {
  const router = useRouter();
  const { position, loading, error, refetch } =
    useJobPositionDetail(positionId);
  const { deletePosition, updateStatus } = useJobPositionActions();
  const { toast, showToast, hideToast } = useToast();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={refetch} />;
  if (!position) return <Error message="Position not found" />;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this position?")) return;
    const result = await deletePosition(positionId);
    if (result.success) {
      router.push("/dashboard/positions");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleStatusChange = async (newStatus) => {
    const result = await updateStatus(positionId, newStatus);
    if (result.success) {
      refetch();
      showToast(
        `Position ${newStatus === "open" ? "opened" : newStatus}`,
        "success",
      );
    } else {
      showToast(result.error, "error");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <PositionDetailHeader
        position={position}
        positionId={positionId}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      <PositionMetricsGrid position={position} positionId={positionId} />

      <PositionDescriptionSection description={position.description} />

      <PositionRequirementsSection requirements={position.requirements} />

      <PositionDetailsCard position={position} />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
