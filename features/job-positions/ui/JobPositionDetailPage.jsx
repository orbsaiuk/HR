"use client";

import { useState } from "react";
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

export function JobPositionDetailPage({ positionId }) {
  const router = useRouter();
  const { position, loading, error, refetch } =
    useJobPositionDetail(positionId);
  const { deletePosition, updateStatus } = useJobPositionActions();
  const { toast, showToast, hideToast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={refetch} />;
  if (!position) return <Error message="المنصب الوظيفي غير موجود" />;

  const executeDelete = async () => {
    setIsDeleteDialogOpen(false);
    const result = await deletePosition(positionId);
    if (result.success) {
      router.push("/company/positions");
    } else {
      showToast(result.error, "error");
    }
  };

  const handleStatusChange = async (newStatus) => {
    const result = await updateStatus(positionId, newStatus);
    if (result.success) {
      refetch();
      const statusMessage =
        newStatus === "open"
          ? "تم فتح المنصب"
          : newStatus === "closed"
            ? "تم إغلاق المنصب"
            : newStatus === "draft"
              ? "تم تحويل المنصب إلى مسودة"
              : "تم تحديث حالة المنصب";
      showToast(statusMessage, "success");
    } else {
      showToast(result.error, "error");
    }
  };

  return (
    <div className="mx-auto space-y-6">
      <PositionDetailHeader
        position={position}
        positionId={positionId}
        onStatusChange={handleStatusChange}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <PositionMetricsGrid position={position} positionId={positionId} />

      <PositionDescriptionSection description={position.description} />

      <PositionRequirementsSection requirements={position.requirements} />

      <PositionDetailsCard position={position} />

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد أنك تريد حذف هذا المنصب؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف المنصب الوظيفي نهائياً
              وإزالة جميع طلبات التقديم والبيانات المرتبطة به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex sm:justify-start gap-2">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
