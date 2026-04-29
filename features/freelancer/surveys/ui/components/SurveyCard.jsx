"use client";

import { Clock, Trash2, FileEdit, Pencil, Inbox } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function SurveyCard({ survey, onDelete, onEdit, onResponses }) {
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow" dir="rtl">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#4B2EE8]/10">
            <FileEdit className="text-[#4B2EE8]" size={20} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600">
              {survey.questionCount ?? 0} سؤال
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-3 py-1 text-sm font-medium text-[#4B2EE8]">
              {survey.responseCount ?? 0} رد
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 leading-snug">
            {survey.title || "استبيان بدون عنوان"}
          </h3>
          <p className="line-clamp-2 text-sm text-slate-500 leading-relaxed">
            {survey.description?.trim() || "لا يوجد وصف لهذا الاستبيان حالياً."}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            <Clock size={14} />
            {formatDate(survey.createdAt)}
          </span>
          <div className="inline-flex items-center gap-1">
            <button
              onClick={() => onEdit?.(survey._id)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-600 transition-colors hover:bg-slate-100"
              title="تعديل"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={() => onResponses?.(survey._id)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-emerald-600 transition-colors hover:bg-emerald-50"
              title="الردود"
            >
              <Inbox size={16} />
            </button>
            <button
              onClick={() => onDelete?.(survey._id)}
              className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
              title="حذف"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
