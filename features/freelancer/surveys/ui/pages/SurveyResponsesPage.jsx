"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Inbox } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/shared/api/client";
import { API_ENDPOINTS } from "@/shared/api/endpoints";

function formatDate(dateString) {
  if (!dateString) return "غير محدد";
  return new Date(dateString).toLocaleString("ar-EG", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SurveyResponsesPage({ surveyId }) {
  const router = useRouter();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResponses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get(API_ENDPOINTS.FREELANCER_SURVEY_RESPONSES(surveyId));
      setResponses(data);
    } catch (err) {
      setError(err.message || "تعذر جلب ردود الاستبيان");
    } finally {
      setLoading(false);
    }
  }, [surveyId]);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  if (loading) {
    return (
      <div className="space-y-4" dir="rtl">
        <Skeleton className="h-28 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
        <Skeleton className="h-24 w-full rounded-xl" />
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
          ردود الاستبيان
        </h1>
        <p className="mt-1 text-sm text-slate-600 sm:text-base">
          {responses.length} رد محفوظ على هذا الاستبيان.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}

      {responses.length > 0 ? (
        <div className="space-y-3">
          {responses.map((response) => (
            <Card
              key={response._id}
              className="cursor-pointer border-slate-200 transition-shadow hover:shadow-md"
              onClick={() => router.push(`/freelancer/surveys/${surveyId}/responses/${response._id}`)}
            >
              <CardContent className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-slate-900">
                    {response.respondent?.name || response.respondentName || "مستجيب غير معروف"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {response.respondent?.email || response.respondentEmail || "لا يوجد بريد إلكتروني"}
                  </p>
                </div>
                <span className="text-sm text-slate-500">
                  {formatDate(response.submittedAt || response.createdAt)}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#4B2EE8]/10 text-[#4B2EE8]">
            <Inbox size={22} />
          </div>
          <p className="text-base font-semibold text-slate-700">لا توجد ردود بعد</p>
          <p className="mt-1 text-sm text-slate-500">ستظهر الردود هنا بعد إرسال الاستبيان.</p>
        </div>
      )}
    </div>
  );
}
