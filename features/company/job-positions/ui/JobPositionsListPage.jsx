"use client";

import { useState } from "react";
import Link from "next/link";
import { useJobPositionsList } from "../model/useJobPositionsList";
import { useJobPositionActions } from "../model/useJobPositionActions";
import { useJobPositionsFilters } from "../model/useJobPositionsFilters";
import { MOCK_POSITION_CARDS } from "../lib/mockPositions";
import { JobPositionCard } from "./JobPositionCard";
import { JobPositionsFilters, JobPositionsPagination } from "./components";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { Button } from "@/components/ui/button";
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { usePermissions } from "@/features/company/org-members/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";
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
import { Plus } from "lucide-react";

export function JobPositionsListPage() {
  const { positions, loading, error, refetch, setPositions } =
    useJobPositionsList();
  const { deletePosition, updateStatus } = useJobPositionActions();
  const { toast, showToast, hideToast } = useToast();
  const { hasPermission } = usePermissions();
  const canManagePositions = hasPermission(PERMISSIONS.MANAGE_POSITIONS);
  const [mockPositions, setMockPositions] = useState(() =>
    MOCK_POSITION_CARDS.map((position) => ({ ...position })),
  );
  const [positionToDelete, setPositionToDelete] = useState(null);

  const getPositionKey = (position) => position._id || position.id;
  const getPositionSlug = (position) =>
    position.slug || position._id || position.id;

  const isUsingMockData = positions.length === 0;
  const displayedPositions = isUsingMockData ? mockPositions : positions;

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    sortBy,
    setSortBy,
    pageSize,
    handlePageSizeChange,
    currentPage,
    totalPages,
    paginatedPositions,
    filteredCount,
    resetFilters,
    goToPage,
  } = useJobPositionsFilters(displayedPositions);

  const handleDeleteConfirm = (id) => {
    setPositionToDelete(id);
  };

  const executeDelete = async () => {
    if (!positionToDelete) return;
    const id = positionToDelete;
    setPositionToDelete(null);

    if (isUsingMockData) {
      setMockPositions((prev) =>
        prev.filter((position) => getPositionKey(position) !== id),
      );
      showToast("تم حذف الوظيفة بنجاح", "success");
      return;
    }

    const result = await deletePosition(id);

    if (result.success) {
      setPositions(positions.filter((p) => p._id !== id));
      showToast("تم حذف الوظيفة بنجاح", "success");
      return;
    }

    showToast(result.error, "error");
  };

  const handleStatusChange = async (id, status) => {
    if (isUsingMockData) {
      setMockPositions((prev) =>
        prev.map((position) =>
          getPositionKey(position) === id ? { ...position, status } : position,
        ),
      );
      showToast("تم تحديث حالة الوظيفة", "success");
      return;
    }

    const result = await updateStatus(id, status);

    if (result.success) {
      setPositions(positions.map((p) => (p._id === id ? { ...p, status } : p)));
      showToast("تم تحديث حالة الوظيفة", "success");
      return;
    }

    showToast(result.error, "error");
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">الوظائف</h1>
          </div>
          <p className="mt-1 text-gray-500">
            إدارة الوظائف المفتوحة ومتابعة طلبات التقديم.
          </p>
        </div>

        <PermissionGate permission={PERMISSIONS.MANAGE_POSITIONS}>
          <Button asChild className="bg-[#5338D5] hover:bg-[#462EA8]">
            <Link href="/company/positions/create">
              <Plus size={18} />
              إضافة وظيفة
            </Link>
          </Button>
        </PermissionGate>
      </div>

      <div className="mt-6 flex min-h-[80vh] flex-col space-y-5">
        <JobPositionsFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          typeFilter={typeFilter}
          onTypeChange={setTypeFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          resultCount={filteredCount}
          onReset={resetFilters}
        />

        {paginatedPositions.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {paginatedPositions.map((position) => (
              <JobPositionCard
                key={position._id || position.id}
                position={position}
                showActions={canManagePositions}
                onDelete={handleDeleteConfirm}
                onStatusChange={handleStatusChange}
                detailsHref={
                  isUsingMockData
                    ? `/company/positions/${getPositionSlug(position)}`
                    : undefined
                }
                editHref={isUsingMockData ? "/company/positions" : undefined}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            لا توجد وظائف مطابقة للفلاتر المحددة.
          </div>
        )}

        <div className="mt-auto">
          <JobPositionsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={goToPage}
            pageSize={pageSize}
            onPageSizeChange={handlePageSizeChange}
          />
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <AlertDialog
        open={!!positionToDelete}
        onOpenChange={(open) => !open && setPositionToDelete(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف هذه الوظيفة؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف الوظيفة نهائياً وإزالة
              جميع البيانات المرتبطة بها.
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
