/**
 * Form card component
 */

import Link from "next/link";
import { FileText, MessageSquare, CalendarDays } from "lucide-react";
import { FormActionsMenu } from "./FormActionsMenu";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function FormCard({
  form,
  onAction,
  showActions = true,
  isMock = false,
}) {
  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (value) => {
    const normalized = Number(value || 0);
    return Number.isNaN(normalized)
      ? "0"
      : new Intl.NumberFormat("ar-SA").format(normalized);
  };

  const statusLabel =
    form.status === "published"
      ? "منشور"
      : form.status === "archived"
        ? "مؤرشف"
        : "مسودة";

  const statusClassName =
    form.status === "published"
      ? "bg-emerald-100 text-emerald-700"
      : form.status === "archived"
        ? "bg-slate-200 text-slate-700"
        : "bg-amber-100 text-amber-700";

  const summary =
    form.description?.trim() || "لا يوجد وصف لهذا النموذج حالياً.";

  return (
    <Card className="h-full border-slate-200 shadow-sm" dir="rtl">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <Link
            href={`/company/forms/${form._id}`}
            className="flex min-w-0 flex-1 items-start gap-3 rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5338D5]/40"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
              <FileText className="text-indigo-600" size={20} />
            </div>
            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-slate-900">
                {form.title || "نموذج بدون عنوان"}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                {summary}
              </p>
            </div>
          </Link>

          {showActions && (
            <FormActionsMenu form={form} onAction={onAction} isMock={isMock} />
          )}
        </div>

        <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
          <span className="inline-flex items-center gap-1.5">
            <MessageSquare size={15} />
            {formatNumber(form.responseCount)} استجابة
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={15} />
            {formatDate(form.updatedAt)}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <Badge className={`border-transparent ${statusClassName}`}>
            {statusLabel}
          </Badge>
          <Link
            href={`/company/forms/${form._id}`}
            className="text-sm font-medium text-[#5338D5] hover:text-[#462EA8]"
          >
            عرض التفاصيل
          </Link>
        </div>

        {isMock && <p className="text-xs text-slate-500">بيانات تجريبية</p>}
      </CardContent>
    </Card>
  );
}
