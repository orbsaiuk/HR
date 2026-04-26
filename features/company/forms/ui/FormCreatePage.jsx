"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Save, Send } from "lucide-react";
import { useFormCreate } from "../model/useFormCreate";
import { FormBuilder } from "../components/FormBuilder/FormBuilder";
import { Button } from "@/components/ui/button";

export function FormCreatePage() {
  const router = useRouter();
  const {
    title,
    setTitle,
    description,
    setDescription,
    fields,
    setFields,
    savingDraft,
    savingPublish,
    error,
    saveForm,
  } = useFormCreate();

  const handleSave = async (publish) => {
    const result = await saveForm(publish);
    if (!result.success && result.error) {
      alert(result.error);
    }
  };

  return (
    <div className="space-y-6" dir="rtl">
      <div className="rounded-2xl border border-slate-200 bg-linear-to-l from-white via-indigo-50/30 to-white px-5 py-6 shadow-sm">
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
              إنشاء نموذج جديد
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              أنشئ نموذجك عبر إضافة الحقول المطلوبة وتخصيص الإعدادات.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              onClick={() => handleSave(false)}
              disabled={savingDraft || savingPublish}
              variant="outline"
              className="inline-flex items-center gap-2"
            >
              <Save size={18} />
              {savingDraft ? "جارٍ الحفظ..." : "حفظ كمسودة"}
            </Button>
            <Button
              onClick={() => handleSave(true)}
              disabled={savingDraft || savingPublish}
              className="inline-flex items-center gap-2 bg-[#5338D5] hover:bg-[#462EA8]"
            >
              <Send size={18} />
              {savingPublish ? "جارٍ النشر..." : "نشر النموذج"}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <FormBuilder
          title={title}
          description={description}
          fields={fields}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onFieldsChange={setFields}
        />
      </div>
    </div>
  );
}
