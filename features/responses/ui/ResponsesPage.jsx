/**
 * Responses page component
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useResponses } from "../model/useResponses";
import { ResponseFilters } from "../components/ResponseFilters";
import { ResponseTable } from "../components/ResponseTable";
import { CompareSelector } from "../components/compare/CompareSelector";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { ExportButton } from "@/features/export";
import { responsesApi } from "../api/responsesApi";

const MAX_SELECTIONS = 5;

export function ResponsesPage({ formId }) {
  const router = useRouter();
  const { form, responses, loading, error, refetch } = useResponses(formId);
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    status: "all",
  });
  const [selectedIds, setSelectedIds] = useState([]);

  const filteredResponses = responses.filter((response) => {
    // Search filter
    const searchMatch =
      !filters.search ||
      response.user?.name
        ?.toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      response.user?.email
        ?.toLowerCase()
        .includes(filters.search.toLowerCase());

    // Date from filter
    const dateFromMatch =
      !filters.dateFrom ||
      new Date(response.submittedAt) >= new Date(filters.dateFrom);

    // Date to filter
    const dateToMatch =
      !filters.dateTo ||
      new Date(response.submittedAt) <= new Date(filters.dateTo + "T23:59:59");

    // Status filter
    const statusMatch =
      !filters.status ||
      filters.status === "all" ||
      (response.status || "pending") === filters.status;

    return searchMatch && dateFromMatch && dateToMatch && statusMatch;
  });

  const handleSelectResponse = (response) => {
    router.push(`/dashboard/forms/${formId}/responses/${response._id}`);
  };

  const handleDeleteResponse = async (responseId) => {
    try {
      await responsesApi.delete(responseId);
      // Remove from selection if deleted
      setSelectedIds((prev) => prev.filter((id) => id !== responseId));
      await refetch();
    } catch (err) {
      console.error("Error deleting response:", err);
      alert("Failed to delete response");
    }
  };

  const handleToggleSelection = (responseId) => {
    setSelectedIds((prev) => {
      if (prev.includes(responseId)) {
        return prev.filter((id) => id !== responseId);
      }
      if (prev.length >= MAX_SELECTIONS) {
        return prev; // Don't exceed max
      }
      return [...prev, responseId];
    });
  };

  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Responses</h1>
            <p className="text-gray-600 mt-1">
              {form?.title || "Form"} • {filteredResponses.length}{" "}
              {filteredResponses.length === 1 ? "response" : "responses"}
            </p>
          </div>
        </div>
        <ExportButton responses={filteredResponses} form={form} />
      </div>

      {/* Filters */}
      <ResponseFilters filters={filters} onFiltersChange={setFilters} />

      {/* Responses Table */}
      <ResponseTable
        responses={filteredResponses}
        onSelectResponse={handleSelectResponse}
        onDeleteResponse={handleDeleteResponse}
        selectedIds={selectedIds}
        onToggleSelection={handleToggleSelection}
      />

      {/* Compare Selector Floating Bar */}
      <CompareSelector
        formId={formId}
        selectedIds={selectedIds}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}
