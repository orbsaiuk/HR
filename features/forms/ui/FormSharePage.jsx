/**
 * Form share page component
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Copy, Check, Share2, Code2 } from "lucide-react";
import { useFormDetail } from "../model/useFormDetail";
import { Loading } from "@/shared/components/feedback/Loading";
import { Error } from "@/shared/components/feedback/Error";
import { Toast } from "@/shared/components/feedback/Toast";
import { useToast } from "@/shared/hooks/useToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FormSharePage({ formId }) {
  const router = useRouter();
  const { form, loading, error, refetch } = useFormDetail(formId);
  const [copied, setCopied] = useState(false);
  const { toast, showToast, hideToast } = useToast();

  const shareUrl = form
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/forms/${form._id}`
    : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      showToast("تم نسخ رابط النموذج", "success");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      showToast("تعذر نسخ الرابط. حاول مرة أخرى.", "error");
    }
  };

  if (loading) return <Loading fullPage />;
  if (error) return <Error message={error} onRetry={refetch} />;
  if (!form) return <Error message="النموذج غير موجود" />;

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
            مشاركة النموذج
          </h1>
          <p className="mt-1 text-sm text-slate-600 sm:text-base">
            {form.title || "نموذج بدون عنوان"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <Share2 size={22} className="text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">رابط المشاركة</h2>
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={shareUrl}
            readOnly
            className="flex-1 bg-slate-50"
          />
          <Button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 bg-[#5338D5] hover:bg-[#462EA8]"
          >
            {copied ? <Check size={20} /> : <Copy size={20} />}
            {copied ? "تم النسخ" : "نسخ"}
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          كل من يملك هذا الرابط يمكنه عرض النموذج وإرسال استجابة.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <Code2 size={22} className="text-indigo-600" />
          <h2 className="text-xl font-bold text-slate-900">تضمين النموذج</h2>
        </div>
        <p className="mb-4 text-sm text-slate-600 sm:text-base">
          انسخ الكود التالي لإدراج النموذج داخل موقعك:
        </p>
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
          <code className="text-sm">
            {`<iframe src="${shareUrl}" width="100%" height="600" frameborder="0"></iframe>`}
          </code>
        </div>
      </div>

      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
    </div>
  );
}
