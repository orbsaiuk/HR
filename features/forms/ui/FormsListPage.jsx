/**
 * Forms list page component (orchestration only)
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Plus, ClipboardList } from "lucide-react";
import { useFormsList } from "../model/useFormsList";
import { useFormFilters } from "../model/useFormFilters";
import { useFormActions } from "../model/useFormActions";
import { FormsFilters } from "./FormsFilters";
import { FormCard } from "./FormCard";
import { FormsPagination } from "./FormsPagination";
import { MOCK_FORMS } from "../lib/mockForms";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { Button } from "@/components/ui/button";
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
import { PermissionGate } from "@/shared/components/auth/PermissionGate";
import { usePermissions } from "@/features/team-member-management/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";

const FORM_CARDS_PER_PAGE = 9;

export function FormsListPage() {
  const { forms, loading, error, refetch, setForms } = useFormsList();
  const { deleteForm } = useFormActions();
  const { toast, showToast, hideToast } = useToast();
  const [mockForms, setMockForms] = useState(() =>
    MOCK_FORMS.map((form) => ({ ...form })),
  );
  const isUsingMockData = forms.length === 0 && mockForms.length > 0;
  const displayedForms = isUsingMockData ? mockForms : forms;
  const formFilters = useFormFilters(displayedForms);
  const { filteredForms, search, status, sortBy, sortOrder } = formFilters;
  const { hasPermission } = usePermissions();
  const canManageForms = hasPermission(PERMISSIONS.MANAGE_FORMS);
  const [formToDelete, setFormToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filteredForms.length / FORM_CARDS_PER_PAGE);

  const paginatedForms = useMemo(() => {
    const start = (currentPage - 1) * FORM_CARDS_PER_PAGE;
    return filteredForms.slice(start, start + FORM_CARDS_PER_PAGE);
  }, [filteredForms, currentPage]);

  const visibleRangeStart =
    filteredForms.length === 0
      ? 0
      : (currentPage - 1) * FORM_CARDS_PER_PAGE + 1;
  const visibleRangeEnd = Math.min(
    currentPage * FORM_CARDS_PER_PAGE,
    filteredForms.length,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, sortBy, sortOrder]);

  useEffect(() => {
    setCurrentPage((previousPage) => {
      const safeTotalPages = Math.max(totalPages, 1);
      return Math.min(previousPage, safeTotalPages);
    });
  }, [totalPages]);

  const handleAction = (action, formId) => {
    if (action === "delete") {
      setFormToDelete(formId);
    }
  };

  const handleConfirmDelete = async () => {
    if (!formToDelete) return;

    if (isUsingMockData) {
      setMockForms((prev) => prev.filter((form) => form._id !== formToDelete));
      setFormToDelete(null);
      showToast("تم حذف النموذج التجريبي", "success");
      return;
    }

    const result = await deleteForm(formToDelete);
    setFormToDelete(null);

    if (result.success) {
      setForms((prev) => prev.filter((form) => form._id !== formToDelete));
      showToast("تم حذف النموذج بنجاح", "success");
      return;
    }

    showToast(result.error || "تعذر حذف النموذج. حاول مرة أخرى.", "error");
  };

  if (loading) {
    return <Loading fullPage />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  const hasFilters =
    search.trim().length > 0 ||
    status !== "all" ||
    sortBy !== "createdAt" ||
    sortOrder !== "desc";

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-2xl bg-linear-to-l from-white via-indigo-50/30 to-white px-5 py-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              النماذج
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              إدارة النماذج ومتابعة حالة النشر والاستجابات.
            </p>
          </div>

          <PermissionGate permission={PERMISSIONS.MANAGE_FORMS}>
            <Button
              asChild
              className="w-full bg-[#5338D5] hover:bg-[#462EA8] sm:w-auto"
            >
              <Link
                href="/company/forms/create"
                className="inline-flex items-center gap-2"
              >
                <Plus size={18} />
                إضافة نموذج
              </Link>
            </Button>
          </PermissionGate>
        </div>
      </div>

      <FormsFilters
        filters={formFilters}
        onFiltersChange={formFilters}
        resultCount={filteredForms.length}
        rangeStart={visibleRangeStart}
        rangeEnd={visibleRangeEnd}
      />

      {filteredForms.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {paginatedForms.map((form) => (
              <FormCard
                key={form._id}
                form={form}
                onAction={handleAction}
                isMock={isUsingMockData}
              />
            ))}
          </div>

          <FormsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <ClipboardList size={22} />
          </div>
          <p className="text-base font-semibold text-slate-700">
            {hasFilters ? "لا توجد نماذج مطابقة" : "لا توجد نماذج بعد"}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {hasFilters
              ? "جرب تعديل الفلاتر للحصول على نتائج أكثر."
              : "ابدأ بإنشاء نموذجك الأول لبدء استقبال الردود."}
          </p>
        </div>
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      <AlertDialog
        open={!!formToDelete}
        onOpenChange={(open) => !open && setFormToDelete(null)}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف هذا النموذج؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف النموذج نهائياً وجميع
              البيانات المرتبطة به.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 sm:justify-start">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
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
