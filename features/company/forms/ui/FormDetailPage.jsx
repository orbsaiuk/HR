/**
 * Form detail page component
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  Edit,
  Link2,
  Trash2,
  CalendarDays,
  FileText,
} from "lucide-react";
import { useFormDetail } from "../model/useFormDetail";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { usePermissions } from "@/features/company/org-members/model/usePermissions";
import { PERMISSIONS } from "@/shared/lib/permissions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const FIELD_TYPE_LABELS = {
  text: "نص قصير",
  textarea: "نص طويل",
  number: "رقم",
  email: "بريد إلكتروني",
  multipleChoice: "اختيار متعدد",
  dropdown: "قائمة منسدلة",
  date: "تاريخ",
  time: "وقت",
  datetime: "تاريخ ووقت",
  file: "رفع ملف",
};

export function FormDetailPage({ formId }) {
  const router = useRouter();
  const { form, loading, error, deleteForm, refetch } = useFormDetail(formId);
  const { toast, showToast, hideToast } = useToast();
  const { hasPermission } = usePermissions();
  const canManageForms = hasPermission(PERMISSIONS.MANAGE_FORMS);
  const isMockForm = Boolean(form?.isMock);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/company/forms/${form._id}`;

    const textarea = document.createElement("textarea");
    textarea.value = url;
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "-9999px";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
      showToast("تم نسخ الرابط بنجاح", "success");
    } catch (err) {
      showToast("فشل في نسخ الرابط", "error");
    }

    document.body.removeChild(textarea);
  };

  const handleDelete = async () => {
    const result = await deleteForm();
    if (result.success) {
      showToast("تم حذف النموذج بنجاح", "success");
    } else {
      showToast(result.error || "تعذر حذف النموذج. حاول مرة أخرى.", "error");
    }
    setIsDeleteDialogOpen(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCount = (value) => {
    const normalized = Number(value || 0);
    return Number.isNaN(normalized)
      ? "0"
      : new Intl.NumberFormat("ar-SA").format(normalized);
  };

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} onRetry={refetch} />;
  if (!form) return <Error message="النموذج غير موجود" />;

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-2xl border border-slate-200 bg-linear-to-l from-white via-indigo-50/30 to-white px-5 py-6 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <button
              onClick={() => router.back()}
              className="cursor-pointer mb-3 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-slate-900"
            >
              <ArrowRight size={16} />
              العودة
            </button>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              {form.title || "نموذج بدون عنوان"}
            </h1>
            <p className="mt-2 text-sm text-slate-600 sm:text-base">
              {form.description?.trim() || "لا يوجد وصف لهذا النموذج."}
            </p>
          </div>

          {canManageForms && !isMockForm && (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                asChild
                variant="outline"
                className="inline-flex items-center gap-2"
              >
                <Link href={`/company/forms/${form._id}/edit`}>
                  <Edit size={16} />
                  تعديل
                </Link>
              </Button>

              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center gap-2"
                onClick={handleCopyLink}
              >
                <Link2 size={16} />
                نسخ الرابط
              </Button>

              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash2 size={16} />
                حذف
              </Button>
            </div>
          )}
        </div>
      </div>

      {isMockForm && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          هذا نموذج تجريبي لعرض واجهة التفاصيل. خيارات التعديل غير متاحة في وضع
          البيانات التجريبية.
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-violet-100">
              <CalendarDays className="text-violet-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">آخر تحديث</p>
              <p className="text-lg font-bold text-slate-900">
                {formatDate(form.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100">
              <FileText className="text-emerald-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-600">عدد الحقول</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCount(form.fields?.length || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold text-slate-900">حقول النموذج</h2>
        {form.fields && form.fields.length > 0 ? (
          <div className="space-y-3">
            {form.fields.map((field, index) => (
              <div
                key={field._key || index}
                className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
              >
                <span className="w-8 text-sm font-medium text-slate-500">
                  {index + 1}.
                </span>
                <div className="flex-1">
                  <p className="font-medium text-slate-900">
                    {field.label || "حقل بدون عنوان"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {FIELD_TYPE_LABELS[field.type] || field.type}
                  </p>
                </div>
                {field.required && (
                  <Badge className="border-transparent bg-red-100 text-red-700 hover:bg-red-100">
                    مطلوب
                  </Badge>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500">لا توجد حقول مضافة حتى الآن.</p>
        )}
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              هل أنت متأكد من حذف هذا النموذج؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء. سيتم حذف النموذج وجميع بياناته
              نهائياً.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2 sm:justify-start">
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف النموذج
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
