"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

function renderAnswer(answer) {
  if (Array.isArray(answer.values) && answer.values.length > 0) return answer.values.join("، ");
  return answer.value || "لا توجد إجابة";
}

export function SurveyResponseDetailPage({ surveyId, responseId }) {
  const router = useRouter();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResponse = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get(
        API_ENDPOINTS.FREELANCER_SURVEY_RESPONSE_BY_ID(surveyId, responseId),
      );
      setResponse(data);
    } catch (err) {
      setError(err.message || "تعذر جلب تفاصيل الرد");
    } finally {
      setLoading(false);
    }
  }, [surveyId, responseId]);

  useEffect(() => {
    fetchResponse();
  }, [fetchResponse]);

  if (loading) {
    return (
      <div className="space-y-4" dir="rtl">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-2xl border border-slate-200 bg-linear-to-l from-white via-purple-50/30 to-white px-5 py-6 shadow-sm">
        <button
          onClick={() => router.back()}
          className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
        >
          <ArrowRight size={16} />
          العودة
        </button>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {response?.survey?.title || "تفاصيل الرد"}
        </h1>
        {response && (
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            {response.respondent?.name || response.respondentName || "مستجيب غير معروف"}
            {" - "}
            {response.respondent?.email || response.respondentEmail || "لا يوجد بريد إلكتروني"}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {response && (
        <div className="space-y-3">
          {(response.answers || []).map((answer) => (
            <Card key={answer._key || answer.questionKey} className="border-slate-200">
              <CardContent className="p-5">
                <p className="text-sm font-semibold text-slate-500">
                  {answer.questionLabel || answer.questionKey}
                </p>
                <p className="mt-2 whitespace-pre-wrap text-base text-slate-900">
                  {renderAnswer(answer)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
