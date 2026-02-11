/**
 * Forms list page component (orchestration only)
 */

"use client";

import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { useFormsList } from "../model/useFormsList";
import { useFormFilters } from "../model/useFormFilters";
import { useFormActions } from "../model/useFormActions";
import { FormsFilters } from "./FormsFilters";
import { FormsTable } from "./FormsTable";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { EmptyState } from "@/shared/components/feedback/EmptyState";

export function FormsListPage() {
  const { forms, loading, error, refetch, setForms } = useFormsList();
  const { deleteForm } = useFormActions();
  const filters = useFormFilters(forms);

  const handleAction = async (action, formId) => {
    let result;
    let confirmMessage;

    switch (action) {
      case "delete":
        confirmMessage =
          "Are you sure you want to delete this form? This action cannot be undone.";
        if (!confirm(confirmMessage)) return;
        result = await deleteForm(formId);
        if (result.success) {
          setForms(forms.filter((f) => f._id !== formId));
        }
        break;

      default:
        break;
    }

    if (result && !result.success) {
      alert(result.error || "Operation failed. Please try again.");
    }
  };

  if (loading) {
    return <Loading fullPage />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  const hasFilters = filters.search;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Forms</h1>
          <p className="text-gray-600 mt-1">Manage and organize your forms</p>
        </div>
        <Link
          href="/dashboard/forms/create"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Form
        </Link>
      </div>

      {/* Filters */}
      <FormsFilters filters={filters} onFiltersChange={filters} />

      {/* Forms List */}
      {filters.filteredForms.length > 0 ? (
        <FormsTable
          forms={filters.filteredForms}
          onSort={filters.handleSort}
          onAction={handleAction}
        />
      ) : (
        <EmptyState
          icon={FileText}
          title={hasFilters ? "No matching forms" : "No forms yet"}
          description={
            hasFilters
              ? "Try adjusting your filters to see more results."
              : "Create your first form to get started"
          }
          action={
            !hasFilters && {
              label: "Create Form",
              href: "/dashboard/forms/create",
              icon: Plus,
            }
          }
        />
      )}
    </div>
  );
}
