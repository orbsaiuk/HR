"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Error } from "@/shared/components/feedback/Error";
import { SURVEY_CARDS_PER_PAGE } from "../../lib/constants";
import { useSurveyActions } from "../../model/useSurveyActions";
import { useSurveyPagination } from "../../model/useSurveyPagination";
import { useSurveysList } from "../../model/useSurveysList";
import { DeleteSurveyDialog } from "../components/DeleteSurveyDialog";
import { SurveysEmptyState } from "../components/SurveysEmptyState";
import { SurveysGrid } from "../components/SurveysGrid";
import { SurveysPageHeader } from "../components/SurveysPageHeader";
import { SurveysPageSkeleton } from "../components/SurveysPageSkeleton";
import { SurveysPagination } from "../components/SurveysPagination";

export function SurveysPage() {
  const router = useRouter();
  const { surveys, loading, error, refetch, setSurveys } = useSurveysList();
  const { deleteSurvey } = useSurveyActions();
  const [surveyToDelete, setSurveyToDelete] = useState(null);

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: paginatedSurveys,
  } = useSurveyPagination(surveys, SURVEY_CARDS_PER_PAGE);

  const handleCreate = () => {
    router.push("/freelancer/surveys/create");
  };

  const handleEdit = (id) => {
    router.push(`/freelancer/surveys/${id}/edit`);
  };

  const handleResponses = (id) => {
    router.push(`/freelancer/surveys/${id}/responses`);
  };

  const handleDeleteDialogChange = (open) => {
    if (!open) setSurveyToDelete(null);
  };

  const handleDelete = async () => {
    if (!surveyToDelete) return;

    const result = await deleteSurvey(surveyToDelete);
    setSurveyToDelete(null);

    if (result.success) {
      setSurveys((prev) => prev.filter((survey) => survey._id !== surveyToDelete));
      toast.success("تم حذف الاستبيان بنجاح");
      return;
    }

    toast.error(result.error || "تعذر حذف الاستبيان. حاول مرة أخرى.");
  };

  if (loading) {
    return <SurveysPageSkeleton />;
  }

  if (error) {
    return <Error message={error} onRetry={refetch} />;
  }

  return (
    <div className="space-y-6" dir="rtl">
      <SurveysPageHeader onCreate={handleCreate} />

      {surveys.length > 0 ? (
        <>
          <SurveysGrid
            surveys={paginatedSurveys}
            onDelete={setSurveyToDelete}
            onEdit={handleEdit}
            onResponses={handleResponses}
          />

          <SurveysPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <SurveysEmptyState />
      )}

      <DeleteSurveyDialog
        open={!!surveyToDelete}
        onOpenChange={handleDeleteDialogChange}
        onConfirm={handleDelete}
      />
    </div>
  );
}
