/**
 * Forms list page component (orchestration only)
 */

"use client";

import { useEffect, useState } from "react";
import { useFormsList } from "../../model/useFormsList";
import { useFormFilters } from "../../model/useFormFilters";
import { useFormActions } from "../../model/useFormActions";
import { useFormPagination } from "../../model/useFormPagination";
import {
  DeleteFormDialog,
  FormsEmptyState,
  FormsFilters,
  FormsGrid,
  FormsListPageSkeleton,
  FormsPageHeader,
  FormsPagination,
} from "../components";
import { FORM_CARDS_PER_PAGE } from "../../lib/constants";
import { MOCK_FORMS } from "../../lib/mockForms";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";

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
  const [formToDelete, setFormToDelete] = useState(null);
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedForms,
    visibleRangeStart,
    visibleRangeEnd,
  } = useFormPagination(filteredForms, FORM_CARDS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, status, sortBy, sortOrder]);

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
    return <FormsListPageSkeleton />;
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
      <FormsPageHeader />

      <FormsFilters
        filters={formFilters}
        onFiltersChange={formFilters}
        resultCount={filteredForms.length}
        rangeStart={visibleRangeStart}
        rangeEnd={visibleRangeEnd}
      />

      {filteredForms.length > 0 ? (
        <>
          <FormsGrid
            forms={paginatedForms}
            onAction={handleAction}
            isUsingMockData={isUsingMockData}
          />

          <FormsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <FormsEmptyState hasFilters={hasFilters} />
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      <DeleteFormDialog
        open={!!formToDelete}
        onOpenChange={(open) => !open && setFormToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
