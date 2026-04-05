/**
 * Analytics page component
 */

"use client";

import { useRouter } from "next/navigation";
import {
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Clock,
  BarChart3,
} from "lucide-react";
import { useAnalytics } from "../model/useAnalytics";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";

export function AnalyticsPage({ formId }) {
  const router = useRouter();
  const { form, analytics, loading, error, refetch } = useAnalytics(formId);

  const formatCount = (value) => {
    const normalized = Number(value || 0);
    return Number.isNaN(normalized)
      ? "0"
      : new Intl.NumberFormat("ar-SA").format(normalized);
  };

  const formatPercent = (value) => {
    const normalized = Number(value || 0);
    if (Number.isNaN(normalized)) return "0%";
    return `${new Intl.NumberFormat("ar-SA", { maximumFractionDigits: 1 }).format(normalized)}%`;
  };

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} onRetry={refetch} />;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-2xl border border-slate-200 bg-linear-to-l from-white via-indigo-50/30 to-white px-5 py-6 shadow-sm">
        <div>
          <button
            onClick={() => router.back()}
            className="mb-3 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
          >
            <ArrowRight size={16} />
            العودة
          </button>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            تحليلات النموذج
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            {form?.title || "نموذج بدون عنوان"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-100">
              <MessageSquare className="text-indigo-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">إجمالي الاستجابات</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCount(analytics?.totalResponses)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100">
              <TrendingUp className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">معدل الإكمال</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatPercent(analytics?.completionRate)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-100">
              <Clock className="text-violet-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">متوسط وقت الإكمال</p>
              <p className="text-2xl font-bold text-slate-900">
                {analytics?.avgTime || "0m"}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100">
              <BarChart3 className="text-amber-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">عدد الحقول</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCount(form?.fields?.length || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-900">
          إحصائيات الحقول
        </h2>
        {analytics?.fieldStats && analytics.fieldStats.length > 0 ? (
          <div className="space-y-4">
            {analytics.fieldStats.map((stat) => (
              <div key={stat.fieldId} className="rounded-lg bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-slate-900">
                    {stat.label || "حقل بدون عنوان"}
                  </p>
                  <p className="text-sm text-slate-500">{stat.type}</p>
                </div>
                <div className="space-y-2">
                  {stat.options?.map((option) => (
                    <div key={option.value} className="flex items-center gap-2">
                      <div className="h-2 flex-1 rounded-full bg-slate-200">
                        <div
                          className="h-2 rounded-full bg-indigo-600"
                          style={{ width: `${option.percentage}%` }}
                        />
                      </div>
                      <span className="w-24 text-left text-sm text-slate-600">
                        {formatCount(option.count)} (
                        {formatPercent(option.percentage)})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">لا تتوفر إحصائيات للحقول حتى الآن.</p>
        )}
      </div>
    </div>
  );
}
