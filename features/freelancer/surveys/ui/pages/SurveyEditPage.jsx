"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";
import { toast } from "sonner";

import { FormBuilder } from "@/features/company/forms/components/FormBuilder/FormBuilder";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { freelancerSurveysApi } from "../../api/freelancerSurveysApi";
import { useSurveyActions } from "../../model/useSurveyActions";

function validateSurvey({ title, questions }) {
  if (!title.trim()) return "عنوان الاستبيان مطلوب";
  if (questions.length === 0) return "أضف سؤالاً واحداً على الأقل";
  if (questions.some((question) => !question.label?.trim())) {
    return "كل سؤال يحتاج إلى عنوان";
  }
  if (
    questions.some(
      (question) =>
        ["multipleChoice", "dropdown"].includes(question.type) &&
        !question.options?.some((option) => option.trim()),
    )
  ) {
    return "أسئلة الاختيار تحتاج إلى خيار واحد على الأقل";
  }
  return null;
}

export function SurveyEditPage({ surveyId }) {
  const router = useRouter();
  const { updateSurvey, updating } = useSurveyActions();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSurvey = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const survey = await freelancerSurveysApi.getSurveys()
        .then(surveys => surveys.find(s => s._id === surveyId || s.id === surveyId));
      setTitle(survey.title || "");
      setDescription(survey.description || "");
      setQuestions(survey.questions || []);
    } catch (err) {
      setError(err.message || "تعذر جلب الاستبيان");
    } finally {
      setLoading(false);
    }
  }, [surveyId]);

  useEffect(() => {
    fetchSurvey();
  }, [fetchSurvey]);

  const handleSave = async () => {
    const validationError = validateSurvey({ title, questions });
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setError(null);
    const result = await updateSurvey(surveyId, {
      title,
      description,
      questions,
    });
    if (result.success) {
      toast.success("تم حفظ التعديلات بنجاح");
      router.push("/freelancer/surveys");
      return;
    }

    setError(result.error || "تعذر تحديث الاستبيان");
    toast.error(result.error || "تعذر تحديث الاستبيان");
  };

  if (loading) {
    return (
      <div className="space-y-6" dir="rtl">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-2xl border border-slate-200 bg-linear-to-l from-white via-purple-50/30 to-white px-5 py-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              <ArrowRight size={16} />
              العودة
            </button>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              تعديل الاستبيان
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              حدّث أسئلة الاستبيان وبياناته الأساسية.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={updating}
            className="inline-flex items-center gap-2 bg-[#4B2EE8] hover:bg-[#462EA8]"
          >
            <Save size={18} />
            {updating ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormBuilder
          title={title}
          description={description}
          fields={questions}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onFieldsChange={setQuestions}
        />
      </div>

    </div>
  );
}
