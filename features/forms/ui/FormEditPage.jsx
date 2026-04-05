/**
 * Form edit page component
 */

"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Save } from "lucide-react";
import { useFormEdit } from "../model/useFormEdit";
import { FormBuilder } from "../components/FormBuilder/FormBuilder";
import { Loading } from "@/shared/components/feedback/Loading";
import { AssignedTeamMembersField } from "@/shared/components/forms/AssignedTeamMembersField";
import { Button } from "@/components/ui/button";

export function FormEditPage({ formId }) {
  const router = useRouter();
  const {
    title,
    setTitle,
    description,
    setDescription,
    fields,
    setFields,
    assignedTo,
    setAssignedTo,
    loading,
    savingDraft,
    error,
    saveForm,
  } = useFormEdit(formId);

  const handleSave = async () => {
    const result = await saveForm(false);
    if (!result.success) {
      alert(result.error);
    }
  };

  if (loading) return <Loading fullPage />;

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
              تعديل النموذج
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              حدّث الحقول والإعدادات الخاصة بالنموذج.
            </p>
          </div>

          <Button
            onClick={handleSave}
            disabled={savingDraft}
            className="inline-flex items-center gap-2 bg-[#5338D5] hover:bg-[#462EA8]"
          >
            <Save size={18} />
            {savingDraft ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </Button>
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

      <AssignedTeamMembersField value={assignedTo} onChange={setAssignedTo} />
    </div>
  );
}
